import { User } from '../../types';
import { canAccessFeature, getDocumentLimit, hasPremiumAccess, shouldShowPaywall } from '../premiumUtils';

jest.mock('../../config', () => ({ isWhitelistedEmail: (email: string) => email === 'developer@example.com' }));

const freeUser: User = {
  uid: 'user', email: 'free@example.com', emailVerified: true, isPremium: false,
  subscriptionPlan: 'free', usageCount: 0, freeOptimizationsRemaining: 1, createdAt: new Date()
};

test('free accounts retain document creation but cannot access tools', () => {
  expect(getDocumentLimit(freeUser)).toBe(1);
  expect(shouldShowPaywall(freeUser)).toBe(true);
  expect(canAccessFeature(freeUser, 'resume')).toBe(false);
  expect(hasPremiumAccess(null)).toBe(false);
});

test('active plans grant only subscribed categories', () => {
  const user: User = { ...freeUser, subscriptionPlan: 'career', subscriptionStatus: 'active', subscriptionValidUntil: Date.now() + 60000 };
  expect(getDocumentLimit(user)).toBe(30);
  expect(canAccessFeature(user, 'resume')).toBe(true);
  expect(canAccessFeature(user, 'post-optimizer')).toBe(false);
});

test.each(['canceled', 'expired', undefined] as const)('status %s cannot use stale premium access', status => {
  const user: User = { ...freeUser, isPremium: true, subscriptionPlan: 'career', subscriptionStatus: status };
  expect(hasPremiumAccess(user)).toBe(false);
  expect(canAccessFeature(user, 'resume')).toBe(false);
});

test('developer accounts retain access', () => {
  expect(canAccessFeature({ ...freeUser, email: 'developer@example.com' }, 'resume')).toBe(true);
});

test('an expired billing period denies access even before a webhook arrives', () => {
  expect(hasPremiumAccess({ ...freeUser, subscriptionPlan: 'career', subscriptionStatus: 'active', subscriptionValidUntil: 1 })).toBe(false);
});