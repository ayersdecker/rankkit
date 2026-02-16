import { User } from '../types';
import { isWhitelistedEmail } from '../config';

/**
 * Check if user has premium access (including whitelisted emails)
 */
export function hasPremiumAccess(user: User | null): boolean {
  if (!user) return false;
  
  // Check whitelist first
  if (isWhitelistedEmail(user.email)) {
    return true;
  }
  
  // For now, all accounts are free - everyone has access
  return true;
  
  // Uncomment below when paywall is enabled:
  /*
  return user.isPremium || false;
  */
}

/**
 * Check if user has access to a specific tool category
 */
export function hasToolAccess(
  user: User | null,
  category: 'career' | 'work' | 'social'
): boolean {
  if (!user) return false;
  
  // Check whitelist
  if (isWhitelistedEmail(user.email)) {
    return true;
  }
  
  // For now, all accounts have access (free during beta)
  return true;
  
  // Uncomment below when paywall is enabled:
  /*
  return hasAccessToCategory(user.subscriptionPlan, category);
  */
}

/**
 * Get document limit based on user status
 */
export function getDocumentLimit(user: User | null): number {
  return hasPremiumAccess(user) ? 30 : 1;
}

/**
 * Check if user should see paywall
 */
export function shouldShowPaywall(user: User | null): boolean {
  if (!user) return true;
  
  // For now, don't show paywall - all accounts are free
  return false;
  
  // Uncomment below when paywall is enabled:
  /*
  return !hasPremiumAccess(user);
  */
}

/**
 * Get user's subscription tier display name
 */
export function getSubscriptionTier(user: User | null): string {
  if (!user) return 'Free';
  
  if (isWhitelistedEmail(user.email)) {
    return 'Developer';
  }
  
  // For now everyone is on free tier
  return 'Free (Beta Access)';
  
  // Uncomment below when paywall is enabled:
  /*
  switch (user.subscriptionPlan) {
    case 'career':
      return 'Career Tools';
    case 'work':
      return 'Workplace Tools';
    case 'social':
      return 'Social Media Tools';
    case 'pro-bundle':
      return 'Pro Bundle';
    case 'ultimate-bundle':
      return 'Ultimate Bundle';
    default:
      return 'Free';
  }
  */
}

/**
 * Check if user can access a specific feature
 */
export function canAccessFeature(
  user: User | null,
  feature: 'resume' | 'cover-letter' | 'interview' | 'job-search' | 
          'cold-email' | 'sales-script' | 'selling-points' |
          'post-optimizer' | 'hashtag-generator'
): boolean {
  if (!user) return false;
  
  // For now, all features are accessible
  return true;
  
  // Uncomment below when paywall is enabled:
  /*
  // Whitelisted users have full access
  if (isWhitelistedEmail(user.email)) {
    return true;
  }
  
  // Map features to categories
  const featureCategoryMap: Record<string, 'career' | 'work' | 'social'> = {
    'resume': 'career',
    'cover-letter': 'career',
    'interview': 'career',
    'job-search': 'career',
    'cold-email': 'work',
    'sales-script': 'work',
    'selling-points': 'work',
    'post-optimizer': 'social',
    'hashtag-generator': 'social',
  };
  
  const category = featureCategoryMap[feature];
  if (!category) return false;
  
  return hasToolAccess(user, category);
  */
}

