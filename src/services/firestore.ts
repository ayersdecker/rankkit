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
  // orderBy, // Reserved for future use
  Timestamp,
  writeBatch,
  // limit as firestoreLimit // Reserved for future use
} from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject, getBlob } from 'firebase/storage';
import { db, storage } from './firebase';
import { Document, OptimizationVersion } from '../types';
import { isWhitelistedEmail } from '../config';

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
    throw new FirestoreError(`Document name too long (${name.length} chars, max 200)`, 'NAME_TOO_LONG');
  }

  if (!content || content.trim().length === 0) {
    throw new FirestoreError('Document content cannot be empty', 'INVALID_CONTENT');
  }

  // Firestore document size limit is 1MB, but we'll use a conservative limit
  if (content.length > 1000000) {
    throw new FirestoreError(`Document content too large (${content.length} chars, max 1MB)`, 'CONTENT_TOO_LARGE');
  }
}

/**
 * Uploads a file to Firebase Storage
 * Returns the storage path (not URL) to avoid CORS issues
 */
export async function uploadDocumentFile(
  userId: string,
  file: File,
  documentId?: string
): Promise<string> {
  try {
    // Create a unique file path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `users/${userId}/documents/${documentId || timestamp}_${sanitizedFileName}`;
    
    const storageRef = ref(storage, storagePath);
    
    console.log('[Storage] Uploading file:', {
      path: storagePath,
      size: file.size,
      type: file.type
    });
    
    // Upload the file
    await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    
    // Return the storage path (not URL) to avoid CORS issues
    // We'll use getAuthenticatedFileBlob() when we need to access the file
    console.log('[Storage] File uploaded successfully to path:', storagePath);
    return storagePath;
  } catch (error: any) {
    console.error('[Storage] Upload error:', error);
    throw new FirestoreError('Failed to upload file', 'UPLOAD_ERROR', error);
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param pathOrUrl - Storage path or URL
 */
export async function deleteDocumentFile(pathOrUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, pathOrUrl);
    await deleteObject(storageRef);
    console.log('[Storage] File deleted successfully');
  } catch (error: any) {
    console.error('[Storage] Delete error:', error);
    // Don't throw error if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw new FirestoreError('Failed to delete file', 'DELETE_ERROR', error);
    }
  }
}

/**
 * Gets an authenticated blob URL for viewing files
 * This bypasses CORS issues by downloading the file with auth and creating a local blob URL
 * @param pathOrUrl - Storage path (e.g., 'users/xxx/documents/file.pdf') or full URL
 */
export async function getAuthenticatedFileBlob(pathOrUrl: string): Promise<string> {
  try {
    // Get storage reference from path or URL
    const storageRef = ref(storage, pathOrUrl);
    
    // Download the file as a blob using authenticated request
    const blob = await getBlob(storageRef);
    
    // Create a local object URL
    const objectUrl = URL.createObjectURL(blob);
    
    console.log('[Storage] Created authenticated blob URL from path:', pathOrUrl);
    return objectUrl;
  } catch (error: any) {
    console.error('[Storage] Blob creation error:', error);
    throw new FirestoreError('Failed to load file', 'BLOB_ERROR', error);
  }
}

/**
 * Creates a new document
 * @param fileUrl - Storage path (e.g., 'users/xxx/documents/file.pdf'), NOT a full URL
 */
export async function createDocument(
  userId: string,
  name: string,
  content: string,
  type: 'resume' | 'cover-letter' | 'post' | 'cold-email' | 'sales-script' | 'interview-prep' | 'job-search' | 'hashtags' | 'selling-points' | 'objection-handler' | 'pitch-perfect' | 'other',
  originalFileName?: string,
  fileType?: string,
  aiGenerated?: boolean,
  fileUrl?: string
): Promise<string> {
  try {
    console.log('[Firestore] Validating document data:', {
      userId,
      nameLength: name.length,
      contentLength: content.length,
      type
    });
    
    validateDocumentData(name, content);

    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const docData: any = {
      userId,
      name: name.trim(),
      content: content.trim(),
      type,
      tags: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Only add optional fields if they have values (Firestore doesn't accept undefined)
    if (originalFileName) {
      docData.originalFileName = originalFileName;
    }
    if (fileType) {
      docData.fileType = fileType;
    }
    if (aiGenerated) {
      docData.aiGenerated = true;
    }
    if (fileUrl) {
      docData.fileUrl = fileUrl;
    }

    console.log('[Firestore] Creating document with data:', {
      userId,
      name: docData.name,
      contentLength: docData.content.length,
      type,
      hasOriginalFileName: !!originalFileName,
      hasFileType: !!fileType,
      hasFileUrl: !!fileUrl
    });

    const docRef = await addDoc(collection(db, 'users', userId, 'documents'), docData);
    console.log(`[Firestore] Document created: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    console.error('[Firestore] Create document error:', {
      error,
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    if (error instanceof FirestoreError) {
      throw error;
    }
    
    // Extract more details from Firebase error
    const errorMessage = error.message || 'Unknown error';
    const errorCode = error.code || 'CREATE_FAILED';
    
    // Check for permission errors
    if (errorCode === 'permission-denied' || errorMessage.includes('permission') || errorMessage.includes('Missing or insufficient permissions')) {
      throw new FirestoreError(
        'Permission denied: Please check your Firebase Firestore security rules. Documents collection may not allow writes.',
        'PERMISSION_DENIED',
        error
      );
    }
    
    throw new FirestoreError(
      `Failed to create document: ${errorMessage} (code: ${errorCode})`,
      errorCode,
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

    // Simple query without orderBy to avoid index requirement
    let q = query(
      collection(db, 'users', userId, 'documents')
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    const snapshot = await getDocs(q);
    
    // Handle empty collection
    if (snapshot.empty) {
      console.log(`[Firestore] No documents found for user ${userId}`);
      return [];
    }
    
    let documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Document));

    // Sort in memory by updatedAt (descending)
    documents.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // Apply limit after sorting if needed
    if (limitCount) {
      documents = documents.slice(0, limitCount);
    }

    console.log(`[Firestore] Retrieved ${documents.length} documents for user ${userId}`);
    return documents;
  } catch (error: any) {
    console.error('[Firestore] Error getting user documents:', error);
    
    // If it's an index error, return empty array instead of throwing
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('[Firestore] Index may need to be created. Returning empty array.');
      return [];
    }
    
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
export async function getDocument(userId: string, documentId: string): Promise<Document | null> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const docRef = doc(db, 'users', userId, 'documents', documentId);
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
  userId: string,
  documentId: string,
  updates: Partial<Document>
): Promise<void> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    if (updates.name) {
      validateDocumentData(updates.name, 'placeholder');
    }

    if (updates.content) {
      validateDocumentData('placeholder', updates.content);
    }

    const docRef = doc(db, 'users', userId, 'documents', documentId);
    
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
export async function deleteDocument(userId: string, documentId: string): Promise<void> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    // First get the document to check if it has a file URL
    const documentRef = doc(db, 'users', userId, 'documents', documentId);
    const docSnapshot = await getDoc(documentRef);
    
    let fileUrlToDelete: string | undefined;
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      fileUrlToDelete = docData.fileUrl;
    }

    // Get all versions for this document
    const versions = await getDocumentVersions(userId, documentId);
    
    // Use batch delete for better performance
    const batch = writeBatch(db);
    
    // Delete document
    batch.delete(documentRef);
    
    // Delete all versions
    versions.forEach(version => {
      batch.delete(doc(db, 'users', userId, 'optimizationVersions', version.id));
    });

    await batch.commit();
    
    // Delete the file from storage if it exists (after Firestore deletion)
    if (fileUrlToDelete) {
      try {
        await deleteDocumentFile(fileUrlToDelete);
      } catch (error) {
        console.error('[Firestore] Failed to delete file from storage:', error);
        // Don't throw error since document is already deleted
      }
    }
    
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
    const versions = await getDocumentVersions(userId, documentId);
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

    const docRef = await addDoc(collection(db, 'users', userId, 'optimizationVersions'), versionData);
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
export async function getDocumentVersions(userId: string, documentId: string): Promise<OptimizationVersion[]> {
  try {
    if (!documentId) {
      throw new FirestoreError('Document ID is required', 'INVALID_DOCUMENT_ID');
    }
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'users', userId, 'optimizationVersions'),
      where('documentId', '==', documentId)
    );

    const snapshot = await getDocs(q);
    
    // Handle empty collection
    if (snapshot.empty) {
      console.log(`[Firestore] No versions found for document ${documentId}`);
      return [];
    }
    
    let versions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as OptimizationVersion));

    // Sort in memory by version (descending)
    versions.sort((a, b) => b.version - a.version);

    console.log(`[Firestore] Retrieved ${versions.length} versions for document ${documentId}`);
    return versions;
  } catch (error: any) {
    console.error('[Firestore] Error getting document versions:', error);
    
    // If it's an index error, return empty array instead of throwing
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('[Firestore] Index may need to be created. Returning empty array.');
      return [];
    }
    
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
 * Checks if user can optimize (has premium or free optimizations remaining)
 */
export async function canUserOptimize(userId: string): Promise<{ canOptimize: boolean; reason?: string }> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new FirestoreError('User not found', 'USER_NOT_FOUND');
    }

    const userData = userSnap.data();
    
    // Whitelisted users can always optimize
    if (isWhitelistedEmail(userData.email)) {
      return { canOptimize: true };
    }
    
    // Premium users can always optimize
    if (userData.isPremium) {
      return { canOptimize: true };
    }

    // Non-premium users need free optimizations remaining
    const freeOptimizations = userData.freeOptimizationsRemaining || 0;
    if (freeOptimizations > 0) {
      return { canOptimize: true };
    }

    return { 
      canOptimize: false, 
      reason: 'No free optimizations remaining. Please subscribe to continue.' 
    };
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to check user optimization eligibility',
      'CHECK_FAILED',
      error
    );
  }
}

/**
 * Decrements free optimizations remaining for non-premium users
 */
export async function decrementFreeOptimization(userId: string): Promise<number> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new FirestoreError('User not found', 'USER_NOT_FOUND');
    }

    const userData = userSnap.data();
    
    // Don't decrement for whitelisted users
    if (isWhitelistedEmail(userData.email)) {
      return -1; // -1 indicates unlimited
    }
    
    // Don't decrement for premium users
    if (userData.isPremium) {
      return -1; // -1 indicates unlimited
    }

    const currentFree = userData.freeOptimizationsRemaining || 0;
    if (currentFree <= 0) {
      throw new FirestoreError('No free optimizations remaining', 'NO_FREE_OPTIMIZATIONS');
    }

    const newFree = currentFree - 1;

    await updateDoc(userRef, {
      freeOptimizationsRemaining: newFree,
      usageCount: (userData.usageCount || 0) + 1
    });

    console.log(`[Firestore] Free optimization used for user ${userId}. Remaining: ${newFree}`);
    return newFree;
  } catch (error: any) {
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to decrement free optimization',
      'DECREMENT_FAILED',
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
      collection(db, 'users', userId, 'documents')
    );
    const docsSnapshot = await getDocs(docsQuery);
    const documentCount = docsSnapshot.size;

    // Get optimization count and average score
    const versionsQuery = query(
      collection(db, 'users', userId, 'optimizationVersions')
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

async function batchDeleteDocs(docs: DocumentReference[]): Promise<void> {
  const batchSize = 400;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = docs.slice(i, i + batchSize);
    chunk.forEach((docRef) => batch.delete(docRef));
    await batch.commit();
  }
}

/**
 * Deletes all user data in Firestore and related storage files
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    if (!userId) {
      throw new FirestoreError('User ID is required', 'INVALID_USER_ID');
    }

    const documentsRef = collection(db, 'users', userId, 'documents');
    const optimizationsRef = collection(db, 'users', userId, 'optimizationVersions');
    const usageStatsQuery = query(
      collection(db, 'usage_stats'),
      where('userId', '==', userId)
    );

    const [documentsSnap, optimizationsSnap, usageStatsSnap] = await Promise.all([
      getDocs(documentsRef),
      getDocs(optimizationsRef),
      getDocs(usageStatsQuery)
    ]);

    const fileUrls: string[] = [];
    documentsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data?.fileUrl) {
        fileUrls.push(data.fileUrl as string);
      }
    });

    const documentRefs = documentsSnap.docs.map((docSnap) => docSnap.ref);
    const optimizationRefs = optimizationsSnap.docs.map((docSnap) => docSnap.ref);
    const usageRefs = usageStatsSnap.docs.map((docSnap) => docSnap.ref);

    await batchDeleteDocs([...documentRefs, ...optimizationRefs, ...usageRefs]);

    await deleteDoc(doc(db, 'users', userId));

    await Promise.all(
      fileUrls.map((fileUrl) => deleteDocumentFile(fileUrl).catch(() => undefined))
    );
  } catch (error: any) {
    console.error('[Firestore] Failed to delete user data:', error);
    if (error instanceof FirestoreError) {
      throw error;
    }
    throw new FirestoreError(
      'Failed to delete user data',
      'DELETE_USER_DATA_FAILED',
      error
    );
  }
}
/**
 * Bug Report Service
 */

export interface BugReport {
  id?: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  page: string;
  email: string;
  browserInfo: string;
}

/**
 * Submit a bug report to Firestore
 */
export async function submitBugReport(report: Omit<BugReport, 'id' | 'timestamp'>): Promise<string> {
  try {
    const bugReportsRef = collection(db, 'bugReports');
    const docRef = await addDoc(bugReportsRef, {
      ...report,
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    console.log('[Firestore] Bug report submitted:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('[Firestore] Failed to submit bug report:', error);
    throw new FirestoreError(
      'Failed to submit bug report',
      'SUBMIT_BUG_REPORT_FAILED',
      error
    );
  }
}

/**
 * Get all bug reports from Firestore
 */
export async function getAllBugReports(): Promise<BugReport[]> {
  try {
    const bugReportsRef = collection(db, 'bugReports');
    const snapshot = await getDocs(bugReportsRef);
    const reports: BugReport[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        severity: data.severity || 'medium',
        page: data.page || '',
        email: data.email || '',
        browserInfo: data.browserInfo || '',
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
    console.log('[Firestore] Retrieved', reports.length, 'bug reports');
    return reports;
  } catch (error: any) {
    console.error('[Firestore] Failed to get bug reports:', error);
    throw new FirestoreError(
      'Failed to retrieve bug reports',
      'GET_BUG_REPORTS_FAILED',
      error
    );
  }
}

/**
 * Delete a single bug report
 */
export async function deleteBugReport(reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, 'bugReports', reportId);
    await deleteDoc(reportRef);
    console.log('[Firestore] Bug report deleted:', reportId);
  } catch (error: any) {
    console.error('[Firestore] Failed to delete bug report:', error);
    throw new FirestoreError(
      'Failed to delete bug report',
      'DELETE_BUG_REPORT_FAILED',
      error
    );
  }
}

/**
 * Delete all bug reports (admin only)
 */
export async function deleteAllBugReports(): Promise<number> {
  try {
    const bugReportsRef = collection(db, 'bugReports');
    const snapshot = await getDocs(bugReportsRef);
    const batch = writeBatch(db);
    let count = 0;

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });

    await batch.commit();
    console.log('[Firestore] Deleted', count, 'bug reports');
    return count;
  } catch (error: any) {
    console.error('[Firestore] Failed to delete all bug reports:', error);
    throw new FirestoreError(
      'Failed to delete bug reports',
      'DELETE_ALL_BUG_REPORTS_FAILED',
      error
    );
  }
}