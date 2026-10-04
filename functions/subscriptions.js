const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const { PLAN_CATEGORIES, getSubscriptionUpdate } = require('./subscriptionAccess');

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

function getAppUrl() {
  const url = new URL(process.env.APP_URL || '');
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
    throw new Error('APP_URL must use HTTPS');
  }
  return url.origin;
}

function getPriceIds() {
  return Object.fromEntries(Object.keys(PLAN_CATEGORIES).map(plan =>
    [plan, process.env[`STRIPE_PRICE_${plan.replace(/-/g, '_').toUpperCase()}`]]));
}

function billingEndpoint(handler) {
  return onRequest({ region: 'us-central1', secrets: ['STRIPE_SECRET_KEY'] }, async (req, res) => {
    try {
      const appUrl = getAppUrl();
      if (req.headers.origin && req.headers.origin !== appUrl) {
        res.status(403).json({ error: { message: 'Origin not allowed' } });
        return;
      }
      res.set('Access-Control-Allow-Origin', appUrl);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
      if (req.method !== 'POST') { res.status(405).send('Method not allowed'); return; }
      const token = (req.headers.authorization || '').match(/^Bearer (.+)$/)?.[1];
      let user;
      try { user = token && await admin.auth().verifyIdToken(token, true); } catch { user = null; }
      if (!user) { res.status(401).json({ error: { message: 'Sign in to manage billing.' } }); return; }
      if (!user.email_verified) { res.status(403).json({ error: { message: 'Verify your email before subscribing.' } }); return; }
      if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing Stripe secret');
      await handler(req, res, user, new Stripe(process.env.STRIPE_SECRET_KEY), appUrl);
    } catch (error) {
      logger.error('Billing endpoint failed', error);
      res.status(503).json({ error: { message: 'Subscription billing is unavailable. Please try again later.' } });
    }
  });
}

exports.createCheckoutSession = billingEndpoint(async (req, res, user, stripe, appUrl) => {
  const planId = req.body?.planId;
  const priceId = typeof planId === 'string' && Object.hasOwn(PLAN_CATEGORIES, planId) && getPriceIds()[planId];
  if (!priceId) {
    res.status(400).json({ error: { message: 'This subscription plan is not configured yet.' } });
    return;
  }
  const ref = db.doc(`users/${user.uid}`);
  const profile = await ref.get();
  if (!profile.exists) { res.status(404).json({ error: { message: 'Account not found.' } }); return; }
  let customerId = profile.data().stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { firebaseUid: user.uid } },
      { idempotencyKey: `rankkit-customer-${user.uid}` });
    customerId = customer.id;
    await ref.update({ stripeCustomerId: customerId });
  }
  const existing = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
  if (existing.data.some(subscription => !['canceled', 'incomplete_expired'].includes(subscription.status))) {
    res.status(409).json({ error: { message: 'You already have a subscription. Use Manage Subscription to update it.' } });
    return;
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription', customer: customerId, client_reference_id: user.uid,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { metadata: { firebaseUid: user.uid } },
    success_url: `${appUrl}/profile?tab=billing&checkout=success`,
    cancel_url: `${appUrl}/profile?tab=billing&checkout=canceled`
  }, { idempotencyKey: `rankkit-checkout-${user.uid}-${planId}-${Math.floor(Date.now() / 1800000)}` });
  res.json({ url: session.url });
});

exports.createBillingPortalSession = billingEndpoint(async (req, res, user, stripe, appUrl) => {
  const profile = await db.doc(`users/${user.uid}`).get();
  const customer = profile.data()?.stripeCustomerId;
  if (!customer) { res.status(400).json({ error: { message: 'No billing account exists yet.' } }); return; }
  const session = await stripe.billingPortal.sessions.create({ customer, return_url: `${appUrl}/profile?tab=billing` });
  res.json({ url: session.url });
});

exports.stripeWebhook = onRequest({ region: 'us-central1', secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] }, async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method not allowed'); return; }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    res.status(400).send('Invalid webhook signature');
    return;
  }
  try {
    const supported = ['checkout.session.completed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'];
    if (!supported.includes(event.type)) { res.json({ received: true }); return; }
    const object = event.data.object;
    const subscriptionId = event.type === 'checkout.session.completed' ? object.subscription : object.id;
    if (!subscriptionId) { res.json({ received: true }); return; }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const uid = subscription.metadata.firebaseUid;
    if (!uid) { res.json({ received: true }); return; }
    const update = getSubscriptionUpdate(subscription, getPriceIds());
    const ref = db.doc(`users/${uid}`);
    await db.runTransaction(async transaction => {
      const profile = await transaction.get(ref);
      if (!profile.exists || profile.data().stripeCustomerId !== subscription.customer) return;
      if (profile.data().stripeSubscriptionId && profile.data().stripeSubscriptionId !== subscription.id && !update.isPremium) return;
      transaction.update(ref, update);
    });
    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook failed', error);
    res.status(500).send('Webhook processing failed');
  }
});