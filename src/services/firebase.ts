import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('[Firebase] Error setting persistence:', error);
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
