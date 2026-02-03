import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './firebase';
import { Document, OptimizationVersion } from '../types';

export class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

/**
 * Validates document data
 */
function validateDocumentData(name: string, content: string): void {
  if (!name || name.trim().length === 0) {
    throw new FirestoreError('Document name cannot be empty', 'INVALID_NAME');
  }

  if (name.length > 200) {
    throw new FirestoreError('Document name too long (max 200 chars)', 'NAME_TOO_LONG');
  }

  if (!content || content.trim().length === 0) {
    throw new FirestoreError('Document content cannot be empty', 'INVALID_CONTENT');
  }

  if (content.length > 100000) {
    throw new FirestoreError('Document content too large (max 100KB)', 'CONTENT_TOO_LARGE');
  }
}

/**
 * Creates a new document
 */
export async function createDocument(
  userId: string,
  name: string,
  content: string,
  type: 'resume' | 'post' | 'other',
  originalFileName?: string,
  fileType?: string
): Promise<string> {
  try {
    validateDocumentData(name, content);

    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const docData = {
      userId,
      name: name.trim(),
      content: content.trim(),
      type,
      originalFileName,
      fileType,
      tags: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'documents'), docData);
    console.log(`[Firestore] Document created: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to create document',
      'CREATE_FAILED',
      error
    );
  }
}

/**
 * Gets all documents for a user with optional filtering
 */
export async function getUserDocuments(
  userId: string,
  type?: 'resume' | 'post' | 'other',
  limitCount?: number
): Promise<Document[]> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    let q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    if (limitCount) {
      q = query(q, firestoreLimit(limitCount));
    }

    const snapshot = await getDocs(q);
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Document));

    console.log(`[Firestore] Retrieved ${documents.length} documents for user ${userId}`);
    return documents;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to get user documents',
      'GET_FAILED',
      error
    );
  }
}

/**
 * Gets a single document by ID
 */
export async function getDocument(documentId: string): Promise<Document | null> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }

    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`[Firestore] Document not found: ${documentId}`);
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate()
    } as Document;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to get document',
      'GET_FAILED',
      error
    );
  }
}

/**
 * Updates a document
 */
export async function updateDocument(
  documentId: string,
  updates: Partial<Document>
): Promise<void> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }

    if (updates.name) {
      validateDocumentData(updates.name, 'placeholder');
    }

    if (updates.content) {
      validateDocumentData('placeholder', updates.content);
    }

    const docRef = doc(db, 'documents', documentId);
    
    // Remove undefined fields and add updatedAt
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(docRef, {
      ...cleanUpdates,
      updatedAt: Timestamp.now()
    });

    console.log(`[Firestore] Document updated: ${documentId}`);
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to update document',
      'UPDATE_FAILED',
      error
    );
  }
}

/**
 * Deletes a document and all its optimization versions
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }

    // Get all versions for this document
    const versions = await getDocumentVersions(documentId);
    
    // Use batch delete for better performance
    const batch = writeBatch(db);
    
    // Delete document
    batch.delete(doc(db, 'documents', documentId));
    
    // Delete all versions
    versions.forEach(version => {
      batch.delete(doc(db, 'optimizationVersions', version.id));
    });

    await batch.commit();
    console.log(`[Firestore] Document deleted: ${documentId} (${versions.length} versions)`);
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to delete document',
      'DELETE_FAILED',
      error
    );
  }
}

/**
 * Saves an optimization version
 */
export async function saveOptimizationVersion(
  documentId: string,
  userId: string,
  optimizationType: string,
  optimizedContent: string,
  score: number,
  suggestions: string[],
  metadata?: any
): Promise<string> {
  try {
    if (!documentId || !userId) {
      throw new FirestoreError('Document ID and User ID are required', 'INVALID_INPUT');
    }

    if (!optimizedContent || optimizedContent.trim().length === 0) {
      throw new FirestoreError('Optimized content cannot be empty', 'INVALID_CONTENT');
    }

    if (score < 0 || score > 100) {
      throw new FirestoreError('Score must be between 0 and 100', 'INVALID_SCORE');
    }

    // Get current version count
    const versions = await getDocumentVersions(documentId);
    const version = versions.length + 1;

    const versionData = {
      documentId,
      userId,
      version,
      optimizationType,
      optimizedContent: optimizedContent.trim(),
      score,
      suggestions: Array.isArray(suggestions) ? suggestions : [],
      metadata: metadata || {},
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'optimizationVersions'), versionData);
    console.log(`[Firestore] Version saved: ${docRef.id} (v${version})`);
    return docRef.id;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to save optimization version',
      'SAVE_VERSION_FAILED',
      error
    );
  }
}

/**
 * Gets all optimization versions for a document
 */
export async function getDocumentVersions(documentId: string): Promise<OptimizationVersion[]> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }

    const q = query(
      collection(db, 'optimizationVersions'),
      where('documentId', '==', documentId),
      orderBy('version', 'desc')
    );

    const snapshot = await getDocs(q);
    const versions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as OptimizationVersion));

    console.log(`[Firestore] Retrieved ${versions.length} versions for document ${documentId}`);
    return versions;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to get document versions',
      'GET_VERSIONS_FAILED',
      error
    );
  }
}

/**
 * Gets a specific optimization version
 */
export async function getOptimizationVersion(versionId: string): Promise<OptimizationVersion | null> {
  try {
    if (!versionId) {
      throw new FirestoreError('Version ID is required', 'INVALID_VERSION_ID');
    }

    const docRef = doc(db, 'optimizationVersions', versionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`[Firestore] Version not found: ${versionId}`);
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate()
    } as OptimizationVersion;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to get optimization version',
      'GET_VERSION_FAILED',
      error
    );
  }
}

/**
 * Increments user usage count atomically
 */
export async function incrementUsageCount(userId: string): Promise<number> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new FirestoreError('User not found', 'USER_NOT_FOUND');
    }

    const currentCount = userSnap.data().usageCount || 0;
    const newCount = currentCount + 1;

    await updateDoc(userRef, {
      usageCount: newCount
    });

    console.log(`[Firestore] Usage count incremented for user ${userId}: ${newCount}`);
    return newCount;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to increment usage count',
      'INCREMENT_FAILED',
      error
    );
  }
}

/**
 * Gets user statistics
 */
export async function getUserStats(userId: string): Promise<{
  documentCount: number;
  optimizationCount: number;
  averageScore: number;
}> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    // Get document count
    const docsQuery = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );
    const docsSnapshot = await getDocs(docsQuery);
    const documentCount = docsSnapshot.size;

    // Get optimization count and average score
    const versionsQuery = query(
      collection(db, 'optimizationVersions'),
      where('userId', '==', userId)
    );
    const versionsSnapshot = await getDocs(versionsQuery);
    const optimizationCount = versionsSnapshot.size;

    let totalScore = 0;
    versionsSnapshot.forEach(doc => {
      totalScore += doc.data().score || 0;
    });

    const averageScore = optimizationCount > 0 ? Math.round(totalScore / optimizationCount) : 0;

    console.log(`[Firestore] Stats for user ${userId}: ${documentCount} docs, ${optimizationCount} opts, avg ${averageScore}`);

    return {
      documentCount,
      optimizationCount,
      averageScore
    };
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to get user stats',
      'GET_STATS_FAILED',
      error
    );
  }
}
