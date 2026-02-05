import { SubscriptionPlan } from '../types';

/**
 * Subscription pricing configuration
 * Note: All accounts are currently free while in beta/development
 */

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '1 free optimization on signup',
      'Access to basic tools',
      'Limited document storage',
    ],
    toolCategories: [],
  },
  career: {
    id: 'career',
    name: 'Career Tools',
    price: 7.99,
    interval: 'month',
    features: [
      'Unlimited resume optimizations',
      'Unlimited cover letter generation',
      'Interview preparation guides',
      'Job search strategies',
      'ATS score checking',
      'Up to 30 saved documents',
    ],
    toolCategories: ['career'],
  },
  work: {
    id: 'work',
    name: 'Workplace Tools',
    price: 12.99,
    interval: 'month',
    features: [
      'Cold email generator',
      'Sales script builder',
      'Selling points finder',
      'Professional writing tools',
      'Up to 30 saved documents',
    ],
    toolCategories: ['work'],
  },
  social: {
    id: 'social',
    name: 'Social Media Tools',
    price: 12.99,
    interval: 'month',
    features: [
      'Unlimited post optimizations',
      'Multi-platform support',
      'Hashtag recommendations',
      'Engagement analytics',
      'Content scheduling insights',
      'Up to 30 saved documents',
    ],
    toolCategories: ['social'],
  },
  'pro-bundle': {
    id: 'pro-bundle',
    name: 'Pro Bundle',
    price: 19.99,
    interval: 'month',
    features: [
      '✨ All Workplace Tools',
      '✨ All Social Media Tools',
      'Priority support',
      'Advanced analytics',
      'Up to 30 saved documents',
    ],
    toolCategories: ['work', 'social'],
    isPopular: true,
    savings: 'Save $5.99/month',
  },
  'ultimate-bundle': {
    id: 'ultimate-bundle',
    name: 'Ultimate Bundle',
    price: 24.99,
    interval: 'month',
    features: [
      '🚀 All Career Tools',
      '🚀 All Workplace Tools',
      '🚀 All Social Media Tools',
      'Priority support',
      'Early access to new tools',
      'Advanced analytics',
      'Unlimited everything',
      'Up to 30 saved documents',
    ],
    toolCategories: ['career', 'work', 'social'],
    isPopular: true,
    savings: 'Save $8.98/month',
  },
};

/**
 * Get plan details by ID
 */
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId];
}

/**
 * Get all available plans (excluding free)
 */
export function getAvailablePlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free');
}

/**
 * Calculate savings compared to individual plans
 */
export function calculateSavings(planId: 'pro-bundle' | 'ultimate-bundle'): number {
  if (planId === 'pro-bundle') {
    return SUBSCRIPTION_PLANS.work.price + SUBSCRIPTION_PLANS.social.price - SUBSCRIPTION_PLANS['pro-bundle'].price;
  } else if (planId === 'ultimate-bundle') {
    return (
      SUBSCRIPTION_PLANS.career.price +
      SUBSCRIPTION_PLANS.work.price +
      SUBSCRIPTION_PLANS.social.price -
      SUBSCRIPTION_PLANS['ultimate-bundle'].price
    );
  }
  return 0;
}

/**
 * Check if a user has access to a specific tool category
 */
export function hasAccessToCategory(
  userPlan: string | undefined, 
  requiredCategory: 'career' | 'work' | 'social'
): boolean {
  // For now, everyone has access (free while in beta)
  return true;
  
  // Uncomment below when paywall is enabled:
  /*
  if (!userPlan || userPlan === 'free') return false;
  
  const plan = SUBSCRIPTION_PLANS[userPlan];
  if (!plan) return false;
  
  return plan.toolCategories.includes(requiredCategory);
  */
}

/**
 * Get recommended plan based on user needs
 */
export function getRecommendedPlan(categories: string[]): SubscriptionPlan {
  if (categories.length >= 3) {
    return SUBSCRIPTION_PLANS['ultimate-bundle'];
  } else if (categories.length === 2) {
    if (categories.includes('work') && categories.includes('social')) {
      return SUBSCRIPTION_PLANS['pro-bundle'];
    }
    return SUBSCRIPTION_PLANS['ultimate-bundle'];
  } else if (categories.length === 1) {
    const category = categories[0];
    return SUBSCRIPTION_PLANS[category] || SUBSCRIPTION_PLANS.career;
  }
  return SUBSCRIPTION_PLANS.career;
}
