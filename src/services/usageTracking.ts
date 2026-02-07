import { doc, updateDoc, getDoc, setDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UsageRecord {
  userId: string;
  toolType: 'resume' | 'cover-letter' | 'post' | 'hashtag' | 'cold-email' | 'selling-points' | 'interview' | 'job-search' | 'sales-script' | 'objection-handler' | 'pitch-perfect';
  timestamp: Date;
  success: boolean;
  tokensUsed?: number;
}

export interface UsageStats {
  totalUsage: number;
  monthlyUsage: number;
  toolUsage: {
    resume: number;
    'cover-letter': number;
    post: number;
    hashtag: number;
    'cold-email': number;
    'selling-points': number;
    interview: number;
    'job-search': number;
    'sales-script': number;
    'objection-handler': number;
    'pitch-perfect': number;
  };
  lastUpdated: Date;
}

/**
 * Track usage for a tool/feature
 */
export async function trackUsage(
  userId: string,
  toolType: UsageRecord['toolType'],
  success: boolean = true,
  tokensUsed?: number
): Promise<void> {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const userRef = doc(db, 'users', userId);
    const monthlyStatsRef = doc(db, 'usage_stats', `${userId}_${currentMonth}`);

    // Update user's total usage count
    await updateDoc(userRef, {
      usageCount: increment(1),
      lastUsedAt: Timestamp.now()
    });

    // Check if monthly stats document exists
    const monthlyStatsSnap = await getDoc(monthlyStatsRef);
    
    if (!monthlyStatsSnap.exists()) {
      // Create new monthly stats document
      await setDoc(monthlyStatsRef, {
        userId,
        month: currentMonth,
        totalUsage: 1,
        [`toolUsage.${toolType}`]: 1,
        tokensUsed: tokensUsed || 0,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        lastUpdated: Timestamp.now(),
        createdAt: Timestamp.now()
      });
    } else {
      // Update existing monthly stats
      await updateDoc(monthlyStatsRef, {
        totalUsage: increment(1),
        [`toolUsage.${toolType}`]: increment(1),
        tokensUsed: increment(tokensUsed || 0),
        successCount: increment(success ? 1 : 0),
        failureCount: increment(success ? 0 : 1),
        lastUpdated: Timestamp.now()
      });
    }

    console.log(`[Usage] Tracked ${toolType} usage for user ${userId}`);
  } catch (error) {
    console.error('[Usage] Failed to track usage:', error);
    // Don't throw - usage tracking shouldn't break the app
  }
}

/**
 * Get user's monthly usage stats
 */
export async function getMonthlyUsageStats(userId: string, month?: string): Promise<UsageStats | null> {
  try {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const monthlyStatsRef = doc(db, 'usage_stats', `${userId}_${targetMonth}`);
    const monthlyStatsSnap = await getDoc(monthlyStatsRef);

    if (!monthlyStatsSnap.exists()) {
      return {
        totalUsage: 0,
        monthlyUsage: 0,
        toolUsage: {
          resume: 0,
          'cover-letter': 0,
          post: 0,
          hashtag: 0,
          'cold-email': 0,
          'selling-points': 0,
          interview: 0,
          'job-search': 0,
          'sales-script': 0,
          'objection-handler': 0,
          'pitch-perfect': 0
        },
        lastUpdated: new Date()
      };
    }

    const data = monthlyStatsSnap.data();
    return {
      totalUsage: data.totalUsage || 0,
      monthlyUsage: data.totalUsage || 0,
      toolUsage: data.toolUsage || {
        resume: 0,
        'cover-letter': 0,
        post: 0,
        hashtag: 0,
        'cold-email': 0,
        'selling-points': 0,
        interview: 0,
        'job-search': 0,
        'sales-script': 0,
        'objection-handler': 0,
        'pitch-perfect': 0
      },
      lastUpdated: data.lastUpdated?.toDate() || new Date()
    };
  } catch (error) {
    console.error('[Usage] Failed to get usage stats:', error);
    return null;
  }
}

/**
 * Get total usage across all time
 */
export async function getTotalUsage(userId: string): Promise<number> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return 0;
    }

    const data = userSnap.data();
    return data.usageCount || 0;
  } catch (error) {
    console.error('[Usage] Failed to get total usage:', error);
    return 0;
  }
}

/**
 * Reset monthly usage (for testing or admin purposes)
 */
export async function resetMonthlyUsage(userId: string, month?: string): Promise<void> {
  try {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const monthlyStatsRef = doc(db, 'usage_stats', `${userId}_${targetMonth}`);
    
    await setDoc(monthlyStatsRef, {
      userId,
      month: targetMonth,
      totalUsage: 0,
      toolUsage: {
        resume: 0,
        'cover-letter': 0,
        post: 0,
        hashtag: 0,
        'cold-email': 0,
        'selling-points': 0,
        interview: 0,
        'job-search': 0,
        'sales-script': 0,
        'objection-handler': 0,
        'pitch-perfect': 0
      },
      tokensUsed: 0,
      successCount: 0,
      failureCount: 0,
      lastUpdated: Timestamp.now(),
      createdAt: Timestamp.now()
    });

    console.log(`[Usage] Reset monthly usage for user ${userId}`);
  } catch (error) {
    console.error('[Usage] Failed to reset usage:', error);
    throw error;
  }
}
