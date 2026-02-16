import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { submitBugReport } from '../../services/firestore';
import './BugReportModal.css';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    page: window.location.pathname,
    email: currentUser?.email || '',
    browserInfo: navigator.userAgent,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Submit to Firestore
      await submitBugReport({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        page: formData.page,
        email: formData.email,
        browserInfo: formData.browserInfo,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          title: '',
          description: '',
          severity: 'medium',
          page: window.location.pathname,
          email: currentUser?.email || '',
          browserInfo: navigator.userAgent,
        });
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting bug report:', err);
      setError(err.message || 'Failed to submit bug report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bug-report-overlay" onClick={onClose}>
      <div className="bug-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bug-report-header">
          <h2>Report a Bug</h2>
          <button
            className="bug-report-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="bug-report-success">
            <div className="success-icon">✓</div>
            <h3>Thank you!</h3>
            <p>Your bug report has been submitted. We appreciate your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bug-report-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Bug Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Brief description of the bug"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="What happened? What did you expect to happen?"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                maxLength={500}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="severity">Severity *</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  <option value="low">Low - Cosmetic issue</option>
                  <option value="medium">Medium - Feature not working</option>
                  <option value="high">High - App breaking/critical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email (optional)"
                />
              </div>
            </div>

            <div className="form-group form-info">
              <small>
                <strong>Automatically included:</strong> Current page ({formData.page})
                {formData.browserInfo && `, Browser info`}
              </small>
            </div>

            <div className="bug-report-actions">
              <button
                type="button"
                className="bug-report-button secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bug-report-button primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Bug Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
