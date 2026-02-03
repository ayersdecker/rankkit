export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  usageCount: number;
  createdAt: Date;
}

export interface ResumeOptimization {
  id: string;
  userId: string;
  originalResume: string;
  jobPosting: string;
  optimizedResume: string;
  matchScore: number;
  suggestions: string[];
  missingKeywords: string[];
  createdAt: Date;
}

export interface PostOptimization {
  id: string;
  userId: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  originalPost: string;
  optimizedPost: string;
  engagementScore: number;
  suggestions: string[];
  hashtags: string[];
  alternatives: string[];
  createdAt: Date;
}

export interface Subscription {
  userId: string;
  plan: 'free' | 'resume' | 'post' | 'bundle';
  status: 'active' | 'canceled' | 'expired';
  startDate: Date;
  endDate?: Date;
  stripeSubscriptionId?: string;
}
