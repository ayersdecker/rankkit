import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = 'medium',
  message,
  fullPage = false
}: LoadingSpinnerProps) {
  const content = (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        {content}
      </div>
    );
  }

  return content;
}
