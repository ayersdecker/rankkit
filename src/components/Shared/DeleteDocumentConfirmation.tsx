import React from 'react';
import './DeleteDocumentConfirmation.css';

interface DeleteDocumentConfirmationProps {
  documentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  errorMessage?: string;
}

export function DeleteDocumentConfirmation({
  documentName,
  onConfirm,
  onCancel,
  isDeleting,
  errorMessage
}: DeleteDocumentConfirmationProps) {
  return (
    <div className="delete-doc-overlay" onClick={onCancel}>
      <div className="delete-doc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-doc-icon">🗑️</div>
        <h2>Delete Document</h2>
        <p className="delete-doc-message">
          This will permanently delete <strong>{documentName}</strong>.
        </p>
        {errorMessage && <div className="delete-doc-error">{errorMessage}</div>}
        <div className="delete-doc-actions">
          <button className="delete-doc-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="delete-doc-confirm" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
