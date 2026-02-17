import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { MonoIcon } from '../Shared/MonoIcon';
import './Auth.css';

export default function VerifyEmail() {
  const { currentUser, checkEmailVerification, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checkCount, setCheckCount] = useState(0);

  // Redirect if already verified
  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleCheckVerification = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await checkEmailVerification();
      
      if (currentUser?.emailVerified) {
        setMessage('Email verified! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      } else {
        setCheckCount(prev => prev + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check verification');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.emailVerified, checkEmailVerification, navigate]);

  // Auto-check every 3 seconds for first 30 seconds
  useEffect(() => {
    if (checkCount < 10) {
      const timer = setTimeout(() => {
        handleCheckVerification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checkCount, handleCheckVerification]);

  async function handleResendEmail() {
    try {
      setResendLoading(true);
      setError('');
      setMessage('');
      await resendVerificationEmail();
      setMessage('Verification email sent! Check your inbox.');
      setCheckCount(0); // Reset auto-check timer
    } catch (err: any) {
      setError(err.message || 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card verify-email-card">
        <div className="verify-icon">
          <MonoIcon icon={Mail} size={32} className="mono-icon" />
        </div>
        <h1>Confirm Your Email</h1>
        <p className="verify-subtitle">
          We've sent a verification link to <strong>{currentUser?.email}</strong>
        </p>

        {message && (
          <div className="success-message">
            <MonoIcon icon={CheckCircle2} size={16} className="mono-icon inline" />
            {message}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <div className="verify-content">
          <ol>
            <li>Check your inbox for an email from Firebase</li>
            <li>Click the verification link in the email</li>
            <li>Come back and we'll automatically detect your verification</li>
          </ol>
        </div>

        <button
          onClick={handleCheckVerification}
          disabled={loading}
          className="primary-button"
        >
          {loading ? 'Checking...' : 'I\'ve verified my email'}
        </button>

        <div className="verify-divider">or</div>

        <button
          onClick={handleResendEmail}
          disabled={resendLoading}
          className="secondary-button"
        >
          {resendLoading ? 'Sending...' : 'Resend verification email'}
        </button>

        <p className="verify-note">
          The verification link will appear within 5 minutes. Check your spam folder if you don't see it.
        </p>
      </div>
    </div>
  );
}
