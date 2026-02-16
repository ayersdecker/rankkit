import { BookOpen, GraduationCap, Save, Search, Sparkles, Star, Target } from 'lucide-react';
import { NotificationConfig } from '../components/Shared/PromotionalNotification';

// Define your promotional notifications here
// The system will randomly pick one to show
export const promotionalNotifications: NotificationConfig[] = [
  {
    id: 'premium-upgrade',
    type: 'subscribe',
    title: 'Unlock Premium Features',
    message: 'Get unlimited AI optimizations and access to all 16+ tools with Premium!',
    linkText: 'Upgrade Now',
    linkUrl: '/profile?tab=billing',
    icon: Star
  },
  {
    id: 'hint-document-library',
    type: 'hint',
    title: 'Pro Tip',
    message: 'Did you know? You can save up to 30 documents in your library for quick access!',
    linkText: 'View Library',
    linkUrl: '/documents',
    icon: BookOpen
  },
  {
    id: 'hint-multiple-tools',
    type: 'hint',
    title: 'Quick Tip',
    message: 'Try combining the Resume Optimizer with the Cover Letter Writer for best results!',
    linkText: 'Explore Tools',
    linkUrl: '/career-tools',
    icon: Target
  },
  {
    id: 'promo-interview-prep',
    type: 'promotion',
    title: 'New Feature',
    message: 'Ace your next interview with our AI-powered Interview Prep tool!',
    linkText: 'Try It Now',
    linkUrl: '/interview-prep',
    icon: GraduationCap
  },
  {
    id: 'hint-job-search',
    type: 'info',
    title: 'Did You Know?',
    message: 'Our Job Search Assistant can help you find opportunities tailored to your profile.',
    linkText: 'Start Searching',
    linkUrl: '/job-search',
    icon: Search
  },
  {
    id: 'promo-social-media',
    type: 'promotion',
    title: 'Boost Your Presence',
    message: 'Generate perfect hashtags and optimize your social media content!',
    linkText: 'Check It Out',
    linkUrl: '/social-media-tools',
    icon: Sparkles
  },
  {
    id: 'hint-save-progress',
    type: 'hint',
    title: 'Remember',
    message: 'Your optimizations are automatically saved to your document library!',
    linkText: 'View Saved Docs',
    linkUrl: '/documents',
    icon: Save
  }
];
