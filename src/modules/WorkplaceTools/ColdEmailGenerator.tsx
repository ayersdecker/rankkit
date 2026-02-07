import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateColdEmail } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import '../CoverLetter/CoverLetterWriter.css';

export default function ColdEmailGenerator() {
  const [recipientInfo, setRecipientInfo] = useState('');
  const [yourCompany, setYourCompany] = useState('');
  const [yourValue, setYourValue] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [result, setResult] = useState<{
    subject: string;
    email: string;
    alternatives: string[];
    tips: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
    }
  }, [currentUser, navigate]);

  async function handleGenerate() {
    if (!recipientInfo || !yourCompany || !yourValue) {
      setError('Please fill in all required fields');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in');
      return;
    }

    try {
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to generate. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const generated = await generateColdEmail({
        recipientInfo,
        yourCompany,
        yourValue,
        callToAction: callToAction || 'Schedule a quick call',
        userId: currentUser.uid
      });

      await decrementFreeOptimization(currentUser.uid);
      await refreshUser();

      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate cold email');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    const sections = [
      { heading: 'Subject Line', content: result.subject },
      { heading: 'Email Body', content: result.email },
      { heading: 'Alternative Subject Lines', content: result.alternatives },
      { heading: 'Follow-up Tips', content: result.tips }
    ];
    const formatted = formatPlainTextDocument('Cold Email', sections);
    await saveDocument(formatted, 'cold-email', 'Cold Email');
  }

  function handleCopy() {
    if (result) {
      const fullEmail = `Subject: ${result.subject}\n\n${result.email}`;
      navigator.clipboard.writeText(fullEmail);
    }
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/workplace-tools')}>← Cold Email Generator</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Generate personalized cold outreach emails that get responses. Perfect for sales, partnerships, and business development.</p>
        </div>

        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Recipient Info *</h3>
            <textarea
              placeholder="Who are you emailing? (e.g., Marketing Director at TechCorp, interested in automation tools)"
              value={recipientInfo}
              onChange={(e) => setRecipientInfo(e.target.value)}
              rows={3}
            />

            <h3>Your Company/Offering *</h3>
            <textarea
              placeholder="What do you do? (e.g., We're an AI-powered CRM that helps sales teams close faster)"
              value={yourCompany}
              onChange={(e) => setYourCompany(e.target.value)}
              rows={3}
            />

            <h3>Value Proposition *</h3>
            <textarea
              placeholder="Why should they care? (e.g., Save 10 hours/week on admin work, increase close rate by 30%)"
              value={yourValue}
              onChange={(e) => setYourValue(e.target.value)}
              rows={3}
            />

            <h3>Call to Action (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Schedule a 15-min demo, Reply with your thoughts"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              className="text-input"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !recipientInfo || !yourCompany || !yourValue}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Cold Email'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="update-message success">✓ Saved to Documents!</div>}
          </div>

          <div className="output-section">
            {result ? (
              <>
                <div className="email-preview">
                  <h3>📧 Subject Line</h3>
                  <div className="subject-line">{result.subject}</div>
                  
                  <h3 style={{ marginTop: '1.5rem' }}>✉️ Email Body</h3>
                  <div className="optimized-output">{result.email}</div>

                  {result.alternatives.length > 0 && (
                    <>
                      <h3>🔄 Alternative Subject Lines</h3>
                      <ul className="suggestions-list">
                        {result.alternatives.map((alt, index) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {result.tips.length > 0 && (
                    <>
                      <h3>💡 Follow-up Tips</h3>
                      <ul className="suggestions-list">
                        {result.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="action-buttons">
                    <button className="secondary-button" onClick={handleSave} disabled={saving}>
                      {saving ? '💾 Saving...' : '💾 Save to Documents'}
                    </button>
                    <button className="secondary-button" onClick={handleCopy}>
                      📋 Copy Email
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Fill in the details and click "Generate Cold Email" to create a personalized outreach email.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Generating your cold email..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Cold Email Generator"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
