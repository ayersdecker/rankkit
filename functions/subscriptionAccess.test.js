const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hasSubscriptionAccess, isDeveloper, getSubscriptionUpdate } = require('./subscriptionAccess');

test('free and forged premium flags do not grant AI access', () => {
  assert.equal(hasSubscriptionAccess({ isPremium: true, subscriptionPlan: 'free' }, 'career'), false);
});

test('valid plans enforce category and expiry', () => {
  const user = { subscriptionPlan: 'career', subscriptionStatus: 'active', subscriptionValidUntil: 2000 };
  assert.equal(hasSubscriptionAccess(user, 'career', 1000), true);
  assert.equal(hasSubscriptionAccess(user, 'social', 1000), false);
  assert.equal(hasSubscriptionAccess(user, 'career', 2000), false);
  assert.equal(hasSubscriptionAccess({ ...user, subscriptionStatus: 'canceled' }, 'career', 1000), false);
  assert.equal(hasSubscriptionAccess({ ...user, subscriptionValidUntil: undefined }, 'career', 1000), false);
});

test('developer bypass requires a verified auth-token email', () => {
  assert.equal(isDeveloper({ email: 'ayersdecker@gmail.com', email_verified: false }), false);
  assert.equal(isDeveloper({ email: 'ayersdecker@gmail.com', email_verified: true }), true);
});

const subscription = { id: 'sub_test', status: 'active', items: { data: [{ price: { id: 'price_career' }, current_period_end: 10 }] } };
const prices = { career: 'price_career' };

test('webhook maps configured prices and paid periods to entitlements', () => {
  const update = getSubscriptionUpdate(subscription, prices, 1000);
  assert.equal(update.subscriptionPlan, 'career');
  assert.equal(update.subscriptionValidUntil, 10000);
  assert.equal(update.isPremium, true);
  assert.equal(hasSubscriptionAccess(update, 'career', 1000), true);
});

test('webhook denies canceled, unpaid, past-due, paused, and incomplete subscriptions', () => {
  for (const status of ['canceled', 'unpaid', 'past_due', 'paused', 'incomplete', 'incomplete_expired']) {
    assert.equal(getSubscriptionUpdate({ ...subscription, status }, prices, 1000).isPremium, false);
  }
});

test('webhook denies unknown prices and expired billing periods', () => {
  assert.equal(getSubscriptionUpdate(subscription, {}, 1000).isPremium, false);
  assert.equal(getSubscriptionUpdate(subscription, prices, 10000).isPremium, false);
});

test('trialing subscriptions map to the client trial status', () => {
  assert.equal(getSubscriptionUpdate({ ...subscription, status: 'trialing' }, prices, 1000).subscriptionStatus, 'trial');
});

test('AI HTTP endpoint denies free accounts before calling OpenAI', async context => {
  const { openaiChatProxy } = require('./index');
  const admin = require('firebase-admin');
  context.mock.method(admin.auth(), 'verifyIdToken', async () => ({ uid: 'free-user', email: 'free@example.com' }));
  context.mock.method(admin.firestore(), 'doc', () => ({
    get: async () => ({ data: () => ({ subscriptionPlan: 'free', isPremium: true }) })
  }));
  let status;
  let body;
  const response = {
    set() { return this; },
    status(value) { status = value; return this; },
    json(value) { body = value; return this; }
  };
  await openaiChatProxy({ method: 'POST', headers: { authorization: 'Bearer test-token' },
    body: { prompt: 'Find documents', category: 'career' } }, response);
  assert.equal(status, 403);
  assert.equal(body.error.code, 'SUBSCRIPTION_REQUIRED');
});

test('AI HTTP endpoint rejects invalid Firebase tokens', async context => {
  const { openaiChatProxy } = require('./index');
  const admin = require('firebase-admin');
  context.mock.method(admin.auth(), 'verifyIdToken', async () => { throw new Error('Invalid token'); });
  let status;
  const response = {
    set() { return this; }, status(value) { status = value; return this; }, json() { return this; }
  };
  await openaiChatProxy({ method: 'POST', headers: { authorization: 'Bearer invalid' }, body: {} }, response);
  assert.equal(status, 401);
});