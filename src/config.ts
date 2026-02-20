// Firebase Configuration
// Configuration is loaded from environment variables

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const OPENAI_PROXY_URL = process.env.REACT_APP_OPENAI_PROXY_URL || '/api/openai/chat';

// Whitelist for testing - these emails have unlimited access
export const WHITELISTED_EMAILS = [
  'eclipse12895@gmail.com',
  'ayersdecker@gmail.com'
];

export function isWhitelistedEmail(email?: string): boolean {
  if (!email) return false;
  return WHITELISTED_EMAILS.includes(email.toLowerCase());
}
