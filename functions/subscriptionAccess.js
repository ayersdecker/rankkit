const PLAN_CATEGORIES = {
  career: ['career'], work: ['work'], social: ['social'],
  'pro-bundle': ['work', 'social'], 'ultimate-bundle': ['career', 'work', 'social']
};

function hasSubscriptionAccess(user, category, now = Date.now()) {
  return !!user && !!PLAN_CATEGORIES[user.subscriptionPlan]?.includes(category) &&
    ['active', 'trial'].includes(user.subscriptionStatus) &&
    typeof user.subscriptionValidUntil === 'number' && user.subscriptionValidUntil > now;
}

function isDeveloper(token) {
  return token.email_verified === true &&
    ['eclipse12895@gmail.com', 'ayersdecker@gmail.com'].includes((token.email || '').toLowerCase());
}

function getSubscriptionUpdate(subscription, priceIds, now = Date.now()) {
  const item = subscription.items.data[0];
  const plan = Object.entries(priceIds).find(([, priceId]) => priceId && priceId === item?.price.id)?.[0];
  const periodEnd = item?.current_period_end || subscription.current_period_end;
  const active = !!PLAN_CATEGORIES[plan] && ['active', 'trialing'].includes(subscription.status) && periodEnd * 1000 > now;
  return {
    subscriptionPlan: plan || 'free',
    subscriptionStatus: active ? (subscription.status === 'trialing' ? 'trial' : 'active') :
      subscription.status === 'canceled' ? 'canceled' : 'expired',
    subscriptionValidUntil: periodEnd ? periodEnd * 1000 : 0,
    isPremium: active,
    stripeSubscriptionId: subscription.id
  };
}

module.exports = { PLAN_CATEGORIES, hasSubscriptionAccess, isDeveloper, getSubscriptionUpdate };