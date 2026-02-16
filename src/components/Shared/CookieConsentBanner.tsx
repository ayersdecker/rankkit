import React, { useState } from 'react';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import './CookieConsentBanner.css';

export function CookieConsentBanner() {
  const {
    consent,
    showBanner,
    acceptAll,
    rejectNonEssential,
    updateConsent,
  } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (!showBanner || !consent) {
    return null;
  }

  return (
    <>
      <div className="cookie-consent-banner">
        <div className="cookie-banner-content">
          <div className="cookie-banner-text">
            <h3>Cookie & Privacy Settings</h3>
            <p>
              We use cookies to enhance your experience, analyze site usage, and remember your preferences. 
              Essential cookies are required for the service. You can choose to accept or reject non-essential cookies.
            </p>
          </div>

          <div className="cookie-banner-actions">
            <button
              className="cookie-button cookie-button-secondary"
              onClick={() => setShowDetails(true)}
            >
              Manage Preferences
            </button>
            <button
              className="cookie-button cookie-button-secondary"
              onClick={rejectNonEssential}
            >
              Reject Non-Essential
            </button>
            <button
              className="cookie-button cookie-button-primary"
              onClick={acceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <CookiePreferencesModal
          onClose={() => setShowDetails(false)}
          consent={consent}
          updateConsent={updateConsent}
        />
      )}
    </>
  );
}

interface CookiePreferencesModalProps {
  onClose: () => void;
  consent: any;
  updateConsent: (updates: any) => void;
}

function CookiePreferencesModal({
  onClose,
  consent,
  updateConsent,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState(consent);

  const handleToggle = (cookieType: string) => {
    if (cookieType !== 'essential') {
      setPreferences({
        ...preferences,
        [cookieType]: !preferences[cookieType],
      });
    }
  };

  const handleSave = () => {
    updateConsent(preferences);
    onClose();
  };

  return (
    <div className="cookie-modal-overlay" onClick={onClose}>
      <div className="cookie-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cookie-modal-header">
          <h2>Cookie Preferences</h2>
          <button
            className="cookie-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="cookie-modal-content">
          <p>
            We use different types of cookies to improve your experience. You can enable or disable each category below.
          </p>

          <div className="cookie-preference-item">
            <div className="cookie-preference-header">
              <h4>Essential Cookies</h4>
              <span className="cookie-badge">Required</span>
            </div>
            <p>
              Essential cookies are necessary for the service to function. They enable user authentication, session management, and security features.
            </p>
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.essential}
                disabled={true}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-label">Always Enabled</span>
            </label>
          </div>

          <div className="cookie-preference-item">
            <div className="cookie-preference-header">
              <h4>Analytics Cookies</h4>
              <span className="cookie-badge optional">Optional</span>
            </div>
            <p>
              Analytics cookies help us understand how you use RankKit so we can improve the service. This includes Google Analytics and similar services.
            </p>
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handleToggle('analytics')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-label">Enable Analytics</span>
            </label>
          </div>

          <div className="cookie-preference-item">
            <div className="cookie-preference-header">
              <h4>Performance Cookies</h4>
              <span className="cookie-badge optional">Optional</span>
            </div>
            <p>
              Performance cookies help us monitor the site's performance and stability. They track errors and performance metrics.
            </p>
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.performance}
                onChange={() => handleToggle('performance')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-label">Enable Performance Tracking</span>
            </label>
          </div>

          <div className="cookie-preference-item">
            <div className="cookie-preference-header">
              <h4>Preference Cookies</h4>
              <span className="cookie-badge optional">Optional</span>
            </div>
            <p>
              Preference cookies remember your settings and choices, such as language preferences and display settings.
            </p>
            <label className="cookie-toggle">
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={() => handleToggle('preferences')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-label">Enable Preferences</span>
            </label>
          </div>

          <div className="cookie-modal-info">
            <p>
              For more information, see our <a href="/cookie-policy">Cookie Policy</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="cookie-modal-footer">
          <button
            className="cookie-button cookie-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="cookie-button cookie-button-primary"
            onClick={handleSave}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
