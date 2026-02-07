import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createDocument } from '../services/firestore';
import { formatDocumentName } from './documentFormatting';
import type { DocumentType } from '../types';

export function useSaveDocument() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function saveDocument(
    content: string,
    type: DocumentType,
    namePrefix: string
  ): Promise<boolean> {
    if (!currentUser) {
      setSaveError('You must be logged in to save');
      return false;
    }

    if (!content || content.trim().length === 0) {
      setSaveError('No content to save');
      return false;
    }

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const docName = formatDocumentName(namePrefix);

      await createDocument(
        currentUser.uid,
        docName,
        content,
        type,
        undefined,
        undefined,
        true // aiGenerated
      );

      setSaveSuccess(true);
      
      // Navigate to documents page after a brief delay to show success message
      setTimeout(() => {
        navigate('/documents');
      }, 800);
      
      return true;
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to save document';
      setSaveError(errorMsg);
      console.error('[useSaveDocument] Save failed:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }

  function clearMessages() {
    setSaveError('');
    setSaveSuccess(false);
  }

  return {
    saveDocument,
    saving,
    saveError,
    saveSuccess,
    clearMessages
  };
}
