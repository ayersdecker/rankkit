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

export function getFirebaseConfigurationErrors(config = firebaseConfig): string[] {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
  const variableNames = {
    apiKey: 'REACT_APP_FIREBASE_API_KEY',
    authDomain: 'REACT_APP_FIREBASE_AUTH_DOMAIN',
    projectId: 'REACT_APP_FIREBASE_PROJECT_ID',
    appId: 'REACT_APP_FIREBASE_APP_ID'
  };
  return requiredFields.filter(field => {
    const value = config[field]?.trim();
    return !value || /^your[_-]/i.test(value) || (field === 'apiKey' && value.includes(':'));
  }).map(field => variableNames[field]);
}

const isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const fallbackFunctionUrl = firebaseConfig.projectId
  ? `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/openaiChatProxy`
  : '/api/openai/chat';

export const OPENAI_PROXY_URL =
  process.env.REACT_APP_OPENAI_PROXY_URL ||
  (isLocalDev ? '/api/openai/chat' : fallbackFunctionUrl);

// Whitelist for testing - these emails have unlimited access
export const WHITELISTED_EMAILS = [
  'eclipse12895@gmail.com',
  'ayersdecker@gmail.com'
];

export function isWhitelistedEmail(email?: string): boolean {
  if (!email) return false;
  return WHITELISTED_EMAILS.includes(email.toLowerCase());
}
