import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
  overlay?: boolean;
}

export function LoadingSpinner({
  size = 'medium',
  message,
  fullPage = false,
  overlay = false
}: LoadingSpinnerProps) {
  const content = (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-popup">
          {content}
        </div>
      </div>
    );
  }

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        {content}
      </div>
    );
  }

  return content;
}
