import { User } from '../types';

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

function hasActivePaidPlan(user: User | null): boolean {
  if (!user) {
    return false;
  }

  if (user.isPremium) {
    return true;
  }

  if (!user.subscriptionPlan || user.subscriptionPlan === 'free') {
    return false;
  }

  if (!user.subscriptionStatus) {
    return true;
  }

  return ACTIVE_STATUSES.has(user.subscriptionStatus);
}

export function hasCategorySubscription(user: User | null, category: ToolCategory): boolean {
  if (!user) {
    return false;
  }

  if (user.isPremium) {
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
    linkUrl.includes('/hashtag-generator')
  ) {
    return 'social';
  }

  return null;
}