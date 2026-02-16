import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
  sendEmailVerification,
  reload as firebaseReload
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { deleteUserData } from '../services/firestore';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, bio?: string, socialLinks?: {
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    portfolioUrl?: string;
    twitterUrl?: string;
  }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  canChangePassword: boolean;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkEmailVerification: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
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
      const userData = userDoc.data() as User;
      // Merge photoURL from Firebase Auth if it exists and isn't in Firestore
      if (firebaseUser.photoURL && !userData.photoURL) {
        const updatedUser = { ...userData, photoURL: firebaseUser.photoURL, emailVerified: firebaseUser.emailVerified };
        await updateDoc(doc(db, 'users', firebaseUser.uid), { photoURL: firebaseUser.photoURL, emailVerified: firebaseUser.emailVerified });
        return updatedUser;
      }
      return { ...userData, emailVerified: firebaseUser.emailVerified };
    } else {
      // Create new user document
      const newUser: Partial<User> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        emailVerified: firebaseUser.emailVerified,
        isPremium: false,
        usageCount: 0,
        freeOptimizationsRemaining: 1,
        createdAt: new Date()
      };
      
      // Only add displayName if it exists (not undefined)
      if (firebaseUser.displayName) {
        newUser.displayName = firebaseUser.displayName;
      }
      
      // Only add photoURL if it exists (not undefined)
      if (firebaseUser.photoURL) {
        newUser.photoURL = firebaseUser.photoURL;
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser as User;
    }
  }

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email
    if (result.user) {
      await sendEmailVerification(result.user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
    }
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

  async function updateProfile(displayName: string, bio?: string, socialLinks?: {
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    portfolioUrl?: string;
    twitterUrl?: string;
  }) {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }

    // Update Firebase Auth profile
    await firebaseUpdateProfile(auth.currentUser, { displayName });

    // Update Firestore user document
    const updateData: any = {
      displayName,
      bio: bio || ''
    };

    // Add social links if provided
    if (socialLinks) {
      if (socialLinks.linkedinUrl !== undefined) updateData.linkedinUrl = socialLinks.linkedinUrl;
      if (socialLinks.githubUrl !== undefined) updateData.githubUrl = socialLinks.githubUrl;
      if (socialLinks.websiteUrl !== undefined) updateData.websiteUrl = socialLinks.websiteUrl;
      if (socialLinks.portfolioUrl !== undefined) updateData.portfolioUrl = socialLinks.portfolioUrl;
      if (socialLinks.twitterUrl !== undefined) updateData.twitterUrl = socialLinks.twitterUrl;
    }

    await updateDoc(doc(db, 'users', auth.currentUser.uid), updateData);

    // Refresh the user data in context
    await refreshUser();
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user logged in');
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  }

  async function deleteAccount() {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }

    const userId = auth.currentUser.uid;
    try {
      await deleteUserData(userId);
      await firebaseDeleteUser(auth.currentUser);
    } catch (error) {
      console.error('[Auth] Delete account failed:', error);
      throw error;
    }
  }

  const canChangePassword = !!auth.currentUser?.providerData.some(
    (provider) => provider.providerId === 'password'
  );

  async function refreshUser() {
    if (auth.currentUser) {
      const user = await loadUserData(auth.currentUser);
      setCurrentUser(user);
    }
  }

  async function checkEmailVerification() {
    if (auth.currentUser) {
      // Reload to get latest email verification status
      await firebaseReload(auth.currentUser);
      await refreshUser();
    }
  }

  async function resendVerificationEmail() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
    }
  }

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    changePassword,
    canChangePassword,
    deleteAccount,
    refreshUser,
    checkEmailVerification,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
