import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] Auth state changed. User:', firebaseUser?.email || 'null');
      if (firebaseUser) {
        try {
          console.log('[Auth] Loading user data...');
          const user = await loadUserData(firebaseUser);
          console.log('[Auth] ✓ User data loaded:', user.email);
          setCurrentUser(user);
        } catch (error) {
          console.error('[Auth] ✗ Error loading user data:', error);
          setCurrentUser(null);
        }
      } else {
        console.log('[Auth] No user logged in');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function loadUserData(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Create new user document
      const newUser: Partial<User> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        isPremium: false,
        usageCount: 0,
        createdAt: new Date()
      };
      
      // Only add displayName if it exists (not undefined)
      if (firebaseUser.displayName) {
        newUser.displayName = firebaseUser.displayName;
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser as User;
    }
  }

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    console.log('[Auth] signInWithGoogle called');
    const provider = new GoogleAuthProvider();
    console.log('[Auth] Opening Google Sign-In popup...');
    try {
      await signInWithPopup(auth, provider);
      console.log('[Auth] Popup sign-in successful');
    } catch (error) {
      console.error('[Auth] Error during signInWithPopup:', error);
      throw error;
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
