import { User } from '../types';
import { isWhitelistedEmail } from '../config';
import { getPlanById } from '../config/pricing';
import { hasActivePaidPlan, hasCategorySubscription } from './subscriptionVisibility';

export function hasPremiumAccess(user: User | null): boolean {
  return hasActivePaidPlan(user);
}

export function hasToolAccess(user: User | null, category: 'career' | 'work' | 'social'): boolean {
  return hasCategorySubscription(user, category);
}

export function getDocumentLimit(user: User | null): number {
  return hasPremiumAccess(user) ? 30 : 1;
}

export function shouldShowPaywall(user: User | null): boolean {
  return !hasPremiumAccess(user);
}

export function getSubscriptionTier(user: User | null): string {
  if (user?.emailVerified && isWhitelistedEmail(user.email)) return 'Developer';
  return hasPremiumAccess(user) ? getPlanById(user!.subscriptionPlan!)!.name : 'Free';
}

export function canAccessFeature(
  user: User | null,
  feature: 'resume' | 'cover-letter' | 'interview' | 'job-search' |
    'cold-email' | 'sales-script' | 'selling-points' | 'post-optimizer' | 'hashtag-generator'
): boolean {
  const categories: Record<typeof feature, 'career' | 'work' | 'social'> = {
    resume: 'career',
    'cover-letter': 'career',
    interview: 'career',
    'job-search': 'career',
    'cold-email': 'work',
    'sales-script': 'work',
    'selling-points': 'work',
    'post-optimizer': 'social',
    'hashtag-generator': 'social'
  };
  return hasToolAccess(user, categories[feature]);
}

