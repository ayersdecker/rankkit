import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle2, Gem, Lightbulb, Save, Target, Zap } from 'lucide-react';
import { analyzeSellingPoints } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import { MonoIcon } from '../../components/Shared/MonoIcon';
import './SellingPointsFinder.css';

export default function SellingPointsFinder() {
  const [productUrl, setProductUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [analysis, setAnalysis] = useState<{
    sellingPoints: string[];
    uniqueValueProps: string[];
    competitiveAdvantages: string[];
    targetPainPoints: string[];
    messagingTips: string[];
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

  async function handleSave() {
    if (!analysis) return;
    const sections = [
      { heading: 'Key Selling Points', content: analysis.sellingPoints },
      { heading: 'Unique Value Propositions', content: analysis.uniqueValueProps },
      { heading: 'Competitive Advantages', content: analysis.competitiveAdvantages },
      { heading: 'Target Pain Points Addressed', content: analysis.targetPainPoints },
      { heading: 'Messaging Tips', content: analysis.messagingTips }
    ];
    const formatted = formatPlainTextDocument('Selling Points Analysis', sections);
    await saveDocument(formatted, 'selling-points', 'Selling Points');
  }

  async function handleAnalyze() {
    if (!productDescription && !productUrl) {
      setError('Please provide a product URL or description');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in');
      return;
    }

    try {
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to analyze. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const result = await analyzeSellingPoints({
        productUrl: productUrl || undefined,
        productDescription: productDescription,
        targetAudience: targetAudience || undefined,
        userId: currentUser.uid
      });

      await decrementFreeOptimization(currentUser.uid);
      await refreshUser();

      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze selling points');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/workplace-tools')}>← Selling Points Finder</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Paste a product URL or description to extract key selling points, competitive advantages, and messaging strategies.</p>
        </div>

        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Product URL (Optional)</h3>
            <input
              type="url"
              placeholder="https://example.com/product"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="text-input"
            />

            <h3>Product/Service Description</h3>
            <textarea
              placeholder="Describe what you're selling: features, benefits, how it works..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={10}
            />

            <h3>Target Audience (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., B2B SaaS companies, E-commerce brands, Small businesses"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="text-input"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || (!productDescription && !productUrl)}
              className="optimize-button"
            >
              {loading ? 'Analyzing...' : 'Find Selling Points'}
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
            {analysis ? (
              <>
                <div className="analysis-section">
                  <h3>
                    <MonoIcon icon={Target} size={18} className="mono-icon inline" />
                    Key Selling Points
                  </h3>
                  <ul className="points-list">
                    {analysis.sellingPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>
                    <MonoIcon icon={Gem} size={18} className="mono-icon inline" />
                    Unique Value Propositions
                  </h3>
                  <ul className="points-list">
                    {analysis.uniqueValueProps.map((prop, index) => (
                      <li key={index}>{prop}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>
                    <MonoIcon icon={Zap} size={18} className="mono-icon inline" />
                    Competitive Advantages
                  </h3>
                  <ul className="points-list">
                    {analysis.competitiveAdvantages.map((adv, index) => (
                      <li key={index}>{adv}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>
                    <MonoIcon icon={Target} size={18} className="mono-icon inline" />
                    Target Pain Points Addressed
                  </h3>
                  <ul className="points-list">
                    {analysis.targetPainPoints.map((pain, index) => (
                      <li key={index}>{pain}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>
                    <MonoIcon icon={Lightbulb} size={18} className="mono-icon inline" />
                    Messaging Tips
                  </h3>
                  <ul className="points-list">
                    {analysis.messagingTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="action-buttons">
                  <button className="secondary-button" onClick={handleSave} disabled={saving}>
                    <MonoIcon icon={Save} size={16} className="mono-icon inline" />
                    {saving ? 'Saving...' : 'Save to Documents'}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Provide your product details and click "Find Selling Points" to get a comprehensive analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Analyzing selling points..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Selling Points Finder"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
