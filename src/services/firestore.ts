import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Document, OptimizationVersion } from '../types';

// Documents
export async function createDocument(
  userId: string,
  name: string,
  content: string,
  type: 'resume' | 'post' | 'other',
  originalFileName?: string,
  fileType?: string
): Promise<string> {
  const docData = {
    userId,
    name,
    content,
    type,
    originalFileName,
    fileType,
    tags: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, 'documents'), docData);
  return docRef.id;
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  const q = query(
    collection(db, 'documents'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate()
  } as Document));
}

export async function getDocument(documentId: string): Promise<Document | null> {
  const docRef = doc(db, 'documents', documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate(),
    updatedAt: docSnap.data().updatedAt.toDate()
  } as Document;
}

export async function updateDocument(
  documentId: string,
  updates: Partial<Document>
): Promise<void> {
  const docRef = doc(db, 'documents', documentId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function deleteDocument(documentId: string): Promise<void> {
  await deleteDoc(doc(db, 'documents', documentId));
}

// Optimization Versions
export async function saveOptimizationVersion(
  documentId: string,
  userId: string,
  optimizationType: string,
  optimizedContent: string,
  score: number,
  suggestions: string[],
  metadata?: any
): Promise<string> {
  // Get current version count
  const versions = await getDocumentVersions(documentId);
  const version = versions.length + 1;

  const versionData = {
    documentId,
    userId,
    version,
    optimizationType,
    optimizedContent,
    score,
    suggestions,
    metadata,
    createdAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, 'optimizationVersions'), versionData);
  return docRef.id;
}

export async function getDocumentVersions(documentId: string): Promise<OptimizationVersion[]> {
  const q = query(
    collection(db, 'optimizationVersions'),
    where('documentId', '==', documentId),
    orderBy('version', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  } as OptimizationVersion));
}

export async function getOptimizationVersion(versionId: string): Promise<OptimizationVersion | null> {
  const docRef = doc(db, 'optimizationVersions', versionId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate()
  } as OptimizationVersion;
}

// Increment user usage count
export async function incrementUsageCount(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentCount = userSnap.data().usageCount || 0;
    await updateDoc(userRef, {
      usageCount: currentCount + 1
    });
  }
}
