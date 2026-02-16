import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle2, Copy, Save } from 'lucide-react';
import { generatePitchPerfect } from '../../services/openai';
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

type PitchResult = {
  pitch: string;
  keyPoints: string[];
  variants: string[];
  tagline: string;
};

export default function PitchPerfect() {
  const [productService, setProductService] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [differentiator, setDifferentiator] = useState('');
  const [tone, setTone] = useState('Bold, confident');
  const [length, setLength] = useState('30 seconds');
  const [result, setResult] = useState<PitchResult | null>(null);
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
    if (!productService || !targetAudience) {
      setError('Please describe your product and target audience');
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

      const generated = await generatePitchPerfect({
        productService,
        targetAudience,
        differentiator,
        tone,
        length,
        userId: currentUser.uid
      });

      await decrementFreeOptimization(currentUser.uid);
      await refreshUser();

      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate pitch');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    const sections = [
      { heading: 'Elevator Pitch', content: result.pitch },
      { heading: 'Tagline', content: result.tagline },
      { heading: 'Key Points', content: result.keyPoints },
      { heading: 'Alternate Versions', content: result.variants }
    ];
    const formatted = formatPlainTextDocument('Pitch Perfect', sections);
    await saveDocument(formatted, 'pitch-perfect', 'Pitch Perfect');
  }

  function handleCopy() {
    if (!result) return;
    const summary = [
      'Pitch Perfect',
      '',
      result.pitch,
      '',
      `Tagline: ${result.tagline}`,
      '',
      'Key Points:',
      ...result.keyPoints.map((point) => `- ${point}`),
      '',
      'Alternate Versions:',
      ...result.variants.map((variant) => `- ${variant}`)
    ].join('\n');

    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/workplace-tools')}>← Pitch Perfect</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Create a sharp elevator pitch with a crisp tagline and multiple delivery options.</p>
        </div>

        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Product / Service *</h3>
            <textarea
              placeholder="What do you offer? Include your main value promise."
              value={productService}
              onChange={(e) => setProductService(e.target.value)}
              rows={5}
            />

            <h3>Target Audience *</h3>
            <input
              type="text"
              placeholder="Who is it for?"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-input"
            />

            <h3>Key Differentiator (Optional)</h3>
            <textarea
              placeholder="What makes you different or better?"
              value={differentiator}
              onChange={(e) => setDifferentiator(e.target.value)}
              rows={3}
            />

            <h3>Pitch Length</h3>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="text-input"
            >
              <option>15 seconds</option>
              <option>30 seconds</option>
              <option>60 seconds</option>
            </select>

            <h3>Tone (Optional)</h3>
            <input
              type="text"
              placeholder="Bold, confident"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="text-input"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !productService || !targetAudience}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Pitch'}
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
                <h3>Elevator Pitch</h3>
                <div className="optimized-output">{result.pitch}</div>

                {result.tagline && (
                  <>
                    <h3>Tagline</h3>
                    <div className="optimized-output">{result.tagline}</div>
                  </>
                )}

                {result.keyPoints.length > 0 && (
                  <>
                    <h3>Key Points</h3>
                    <ul className="suggestions-list">
                      {result.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </>
                )}

                {result.variants.length > 0 && (
                  <>
                    <h3>Alternate Versions</h3>
                    <ul className="suggestions-list">
                      {result.variants.map((variant, index) => (
                        <li key={index}>{variant}</li>
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
                    Copy Pitch
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Provide the essentials and generate a memorable pitch.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Crafting your pitch..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Pitch Perfect"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
