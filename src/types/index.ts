export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isPremium: boolean;
  usageCount: number;
  freeOptimizationsRemaining: number;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'cover-letter' | 'post' | 'cold-email' | 'sales-script' | 'interview-prep' | 'job-search' | 'hashtags' | 'other';
  content: string;
  originalFileName?: string;
  fileType?: string;
  fileUrl?: string;
  tags?: string[];
  aiGenerated?: boolean;
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

export interface CoverLetter {
  id: string;
  userId: string;
  resumeContent: string;
  jobDescription: string;
  bio?: string;
  generatedLetter: string;
  createdAt: Date;
}

export interface InterviewPrep {
  id: string;
  userId: string;
  jobDescription: string;
  resumeContent?: string;
  commonQuestions: string[];
  suggestedAnswers: { question: string; answer: string }[];
  questionsToAsk: string[];
  tips: string[];
  createdAt: Date;
}

export interface JobSearchSuggestion {
  id: string;
  userId: string;
  jobTitle: string;
  skills: string[];
  experience: string;
  location?: string;
  platforms: string[];
  searchStrategies: string[];
  keywords: string[];
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
export type DocumentType = 'resume' | 'cover-letter' | 'post' | 'cold-email' | 'sales-script' | 'interview-prep' | 'job-search' | 'hashtags' | 'other';
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';
