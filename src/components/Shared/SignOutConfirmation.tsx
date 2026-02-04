import React from 'react';
import './SignOutConfirmation.css';

interface SignOutConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function SignOutConfirmation({ onConfirm, onCancel }: SignOutConfirmationProps) {
  return (
    <div className="signout-overlay" onClick={onCancel}>
      <div className="signout-modal" onClick={e => e.stopPropagation()}>
        <div className="signout-icon">👋</div>
        
        <h2>Sign Out?</h2>
        
        <p className="signout-message">
          Are you sure you want to sign out?
        </p>
        
        <div className="signout-actions">
          <button className="signout-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="signout-confirm" onClick={onConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
