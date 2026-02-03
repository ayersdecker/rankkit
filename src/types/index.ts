export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  usageCount: number;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'post' | 'other';
  content: string;
  originalFileName?: string;
  fileType?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OptimizationVersion {
  id: string;
  documentId: string;
  userId: string;
  version: number;
  optimizationType: 'ats' | 'seo' | 'engagement' | 'readability';
  optimizedContent: string;
  score: number;
  suggestions: string[];
  metadata?: any;
  createdAt: Date;
}

export interface ResumeOptimization {
  id: string;
  userId: string;
  documentId: string;
  jobPosting: string;
  optimizedContent: string;
  matchScore: number;
  suggestions: string[];
  missingKeywords: string[];
  createdAt: Date;
}

export interface PostOptimization {
  id: string;
  userId: string;
  documentId: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  optimizedContent: string;
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

export type OptimizationType = 'ats' | 'seo' | 'engagement' | 'readability';
export type DocumentType = 'resume' | 'post' | 'other';
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';
