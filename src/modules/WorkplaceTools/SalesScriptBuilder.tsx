import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateSalesScript } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import '../ResumeRank/ResumeOptimizer.css';
import '../CoverLetter/CoverLetterWriter.css';
import './SellingPointsFinder.css';

type ScriptResult = {
  script: string;
  keyPoints: string[];
  objectionHandles: string[];
  tips: string[];
};

export default function SalesScriptBuilder() {
  const [scriptType, setScriptType] = useState('Discovery Call');
  const [productService, setProductService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goals, setGoals] = useState('');
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
    }
  }, [currentUser, navigate]);

  async function handleGenerate() {
    if (!productService) {
      setError('Please describe your product or service');
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

      const generated = await generateSalesScript({
        scriptType,
        productService,
        targetAudience,
        goals,
        userId: currentUser.uid
      });

      await decrementFreeOptimization(currentUser.uid);
      await refreshUser();

      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate sales script');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    const sections = [
      { heading: `Sales Script (${scriptType})`, content: result.script },
      { heading: 'Key Talking Points', content: result.keyPoints },
      { heading: 'Objection Handling', content: result.objectionHandles },
      { heading: 'Execution Tips', content: result.tips }
    ];
    const formatted = formatPlainTextDocument(`Sales Script - ${scriptType}`, sections);
    await saveDocument(formatted, 'sales-script', `Sales Script ${scriptType}`);
  }

  function handleCopy() {
    if (!result) return;
    const summary = [
      `Sales Script (${scriptType})`,
      '',
      result.script,
      '',
      'Key Points:',
      ...result.keyPoints.map((point) => `- ${point}`),
      '',
      'Objection Handles:',
      ...result.objectionHandles.map((handle) => `- ${handle}`),
      '',
      'Tips:',
      ...result.tips.map((tip) => `- ${tip}`)
    ].join('\n');

    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/workplace-tools')}>← Sales Script Builder</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Generate a full sales script with talking points, objection handling, and execution tips.</p>
        </div>

        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Script Type</h3>
            <select
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value)}
              className="text-input"
            >
              <option>Discovery Call</option>
              <option>Cold Call</option>
              <option>Product Demo</option>
              <option>Follow-up Call</option>
              <option>Voicemail</option>
              <option>In-person Pitch</option>
            </select>

            <h3>Product / Service *</h3>
            <textarea
              placeholder="What are you selling? Include core value and differentiators."
              value={productService}
              onChange={(e) => setProductService(e.target.value)}
              rows={6}
            />

            <h3>Target Audience (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., HR leaders at mid-size SaaS companies"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-input"
            />

            <h3>Goals (Optional)</h3>
            <textarea
              placeholder="What should the call accomplish?"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !productService}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Sales Script'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="update-message success">✓ Saved to Documents!</div>}
          </div>

          <div className="output-section">
            {result ? (
              <>
                <h3>Script</h3>
                <div className="optimized-output">{result.script}</div>

                {result.keyPoints.length > 0 && (
                  <>
                    <h3>Key Talking Points</h3>
                    <ul className="suggestions-list">
                      {result.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.objectionHandles.length > 0 && (
                  <>
                    <h3>Objection Handling</h3>
                    <ul className="suggestions-list">
                      {result.objectionHandles.map((handle, index) => (
                        <li key={index}>{handle}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.tips.length > 0 && (
                  <>
                    <h3>Execution Tips</h3>
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
                    📋 Copy Script
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Enter your product details and generate a sales script tailored to your pitch.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Building your sales script..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Sales Script Builder"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
