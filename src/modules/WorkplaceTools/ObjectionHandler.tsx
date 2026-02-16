import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle2, Copy, Save, Shield } from 'lucide-react';
import { generateObjectionHandler } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import { MonoIcon } from '../../components/Shared/MonoIcon';
import '../ResumeRank/ResumeOptimizer.css';
import '../CoverLetter/CoverLetterWriter.css';
import './SellingPointsFinder.css';

type ObjectionResponse = {
  objection: string;
  response: string;
  followUp: string;
  reframe: string;
};

type ObjectionResult = {
  responses: ObjectionResponse[];
  principles: string[];
  pitfalls: string[];
};

export default function ObjectionHandler() {
  const [productService, setProductService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objections, setObjections] = useState('');
  const [tone, setTone] = useState('Confident, consultative');
  const [result, setResult] = useState<ObjectionResult | null>(null);
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
    if (!productService || !objections) {
      setError('Please add your product/service and at least one objection');
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

      const generated = await generateObjectionHandler({
        productService,
        targetAudience,
        objections,
        tone,
        userId: currentUser.uid
      });

      await decrementFreeOptimization(currentUser.uid);
      await refreshUser();

      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate objection responses');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    const sections = [
      ...result.responses.map((item) => ({
        heading: `Objection: ${item.objection}`,
        content: `Response: ${item.response}\n\nReframe: ${item.reframe}\n\nFollow-up: ${item.followUp}`
      })),
      { heading: 'Guiding Principles', content: result.principles },
      { heading: 'Avoid These Pitfalls', content: result.pitfalls }
    ];
    const formatted = formatPlainTextDocument('Objection Handling Playbook', sections);
    await saveDocument(formatted, 'objection-handler', 'Objection Handler');
  }

  function handleCopy() {
    if (!result) return;
    const summary = [
      'Objection Handling Playbook',
      '',
      ...result.responses.flatMap((item) => [
        `Objection: ${item.objection}`,
        `Response: ${item.response}`,
        `Reframe: ${item.reframe}`,
        `Follow-up: ${item.followUp}`,
        ''
      ]),
      'Principles:',
      ...result.principles.map((tip) => `- ${tip}`),
      '',
      'Pitfalls:',
      ...result.pitfalls.map((tip) => `- ${tip}`)
    ].join('\n');

    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/workplace-tools')}>← Objection Handler</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Turn common objections into confident responses, reframes, and follow-up questions.</p>
        </div>

        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Product / Service *</h3>
            <textarea
              placeholder="Describe what you're selling and who it helps."
              value={productService}
              onChange={(e) => setProductService(e.target.value)}
              rows={5}
            />

            <h3>Target Audience (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Retail operations leaders, founders"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-input"
            />

            <h3>Common Objections *</h3>
            <textarea
              placeholder="List objections, one per line (e.g., It's too expensive, We already have a vendor)"
              value={objections}
              onChange={(e) => setObjections(e.target.value)}
              rows={6}
            />

            <h3>Tone (Optional)</h3>
            <input
              type="text"
              placeholder="Confident, consultative"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="text-input"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !productService || !objections}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Responses'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && (
              <div className="update-message success">
                <MonoIcon icon={CheckCircle2} size={16} className="mono-icon inline" />
                Saved to Documents!
              </div>
            )}
          </div>

          <div className="output-section">
            {result ? (
              <>
                {result.responses.map((item, index) => (
                  <div key={index} className="analysis-section">
                    <h3>
                      <MonoIcon icon={Shield} size={18} className="mono-icon inline" />
                      {item.objection}
                    </h3>
                    <ul className="points-list">
                      <li><strong>Response:</strong> {item.response}</li>
                      <li><strong>Reframe:</strong> {item.reframe}</li>
                      <li><strong>Follow-up:</strong> {item.followUp}</li>
                    </ul>
                  </div>
                ))}

                {result.principles.length > 0 && (
                  <>
                    <h3>Guiding Principles</h3>
                    <ul className="suggestions-list">
                      {result.principles.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.pitfalls.length > 0 && (
                  <>
                    <h3>Avoid These Pitfalls</h3>
                    <ul className="suggestions-list">
                      {result.pitfalls.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="action-buttons">
                  <button className="secondary-button" onClick={handleSave} disabled={saving}>
                    <MonoIcon icon={Save} size={16} className="mono-icon inline" />
                    {saving ? 'Saving...' : 'Save to Documents'}
                  </button>
                  <button className="secondary-button" onClick={handleCopy}>
                    <MonoIcon icon={Copy} size={16} className="mono-icon inline" />
                    Copy Playbook
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Add a few objections to generate confident responses and reframes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Building objection responses..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Objection Handler"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
