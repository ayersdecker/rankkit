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
  
  // Then check premium status
  return user.isPremium || false;
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
  return !hasPremiumAccess(user);
}
