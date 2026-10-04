import { User } from '../types';
import { isWhitelistedEmail } from '../config';

type ToolCategory = 'career' | 'work' | 'social';

const ACTIVE_STATUSES = new Set(['active', 'trial']);

const PLAN_CATEGORIES: Record<string, ToolCategory[]> = {
  free: [],
  career: ['career'],
  work: ['work'],
  social: ['social'],
  'pro-bundle': ['work', 'social'],
  'ultimate-bundle': ['career', 'work', 'social']
};

export function hasActivePaidPlan(user: User | null): boolean {
  if (!user) {
    return false;
  }

  if (user.emailVerified && isWhitelistedEmail(user.email)) {
    return true;
  }

  if (!user.subscriptionPlan || user.subscriptionPlan === 'free' || !PLAN_CATEGORIES[user.subscriptionPlan]) {
    return false;
  }

  return ACTIVE_STATUSES.has(user.subscriptionStatus || '') &&
    typeof user.subscriptionValidUntil === 'number' && user.subscriptionValidUntil > Date.now();
}

export function hasCategorySubscription(user: User | null, category: ToolCategory): boolean {
  if (!user) {
    return false;
  }

  if (user.emailVerified && isWhitelistedEmail(user.email)) {
    return true;
  }

  if (!hasActivePaidPlan(user)) {
    return false;
  }

  const categories = PLAN_CATEGORIES[user.subscriptionPlan || 'free'] || [];
  return categories.includes(category);
}

export function shouldShowGenericUpgradeBanner(user: User | null): boolean {
  return !!user && !hasActivePaidPlan(user);
}

export function shouldShowCategoryUpgradeBanner(user: User | null, category: ToolCategory): boolean {
  return !!user && !hasCategorySubscription(user, category);
}

export function shouldShowSubscribeNotifications(user: User | null): boolean {
  return !hasActivePaidPlan(user);
}

export function getNotificationCategory(linkUrl?: string): ToolCategory | null {
  if (!linkUrl) {
    return null;
  }

  if (
    linkUrl.includes('/career-tools') ||
    linkUrl.includes('/resume-optimizer') ||
    linkUrl.includes('/cover-letter') ||
    linkUrl.includes('/interview-prep') ||
    linkUrl.includes('/job-search') ||
    linkUrl.includes('/job-application-toolkit')
  ) {
    return 'career';
  }

  if (
    linkUrl.includes('/workplace-tools') ||
    linkUrl.includes('/cold-email') ||
    linkUrl.includes('/selling-points') ||
    linkUrl.includes('/sales-script') ||
    linkUrl.includes('/objection-handler') ||
    linkUrl.includes('/pitch-perfect')
  ) {
    return 'work';
  }

  if (
    linkUrl.includes('/social-media-tools') ||
    linkUrl.includes('/post-optimizer') ||
    linkUrl.includes('/hashtag-generator')
  ) {
    return 'social';
  }

  return null;
}