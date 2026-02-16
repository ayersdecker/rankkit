import React, { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MonoIcon } from './MonoIcon';
import './DeleteAccountConfirmation.css';

interface DeleteAccountConfirmationProps {
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  errorMessage?: string;
}

export function DeleteAccountConfirmation({
  email,
  onConfirm,
  onCancel,
  isDeleting,
  errorMessage
}: DeleteAccountConfirmationProps) {
  const [confirmationText, setConfirmationText] = useState('');

  const isMatch = useMemo(() => {
    return confirmationText.trim().toLowerCase() === email.trim().toLowerCase();
  }, [confirmationText, email]);

  return (
    <div className="delete-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon">
          <MonoIcon icon={AlertTriangle} size={32} className="mono-icon" />
        </div>
        <h2>Delete Account</h2>
        <p className="delete-message">
          This action permanently deletes your account and data. Type your email to confirm.
        </p>
        <div className="delete-input-group">
          <label htmlFor="delete-confirmation">Email confirmation</label>
          <input
            id="delete-confirmation"
            type="email"
            placeholder={email}
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>
        {errorMessage && <div className="delete-error">{errorMessage}</div>}
        <div className="delete-actions">
          <button className="delete-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className="delete-confirm"
            onClick={onConfirm}
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
