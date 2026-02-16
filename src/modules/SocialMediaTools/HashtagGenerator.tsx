import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  AtSign,
  Camera,
  CheckCircle2,
  Circle,
  Flame,
  Hash,
  Lightbulb,
  Music,
  Save,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Video
} from 'lucide-react';
import { generateHashtags } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall, hasPremiumAccess } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import { MonoIcon } from '../../components/Shared/MonoIcon';
import './HashtagGenerator.css';

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export default function HashtagGenerator() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [contentDescription, setContentDescription] = useState('');
  const [niche, setNiche] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{popular: string[], niche: string[], trending: string[]}>({
    popular: [],
    niche: [],
    trending: []
  });
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
    if (hashtags.length === 0) return;
    const sections = [
      { heading: `All Hashtags (${hashtags.length})`, content: hashtags.join(' ') },
      { heading: 'Popular Hashtags', content: categories.popular.join(' ') },
      { heading: 'Niche Hashtags', content: categories.niche.join(' ') },
      { heading: 'Trending Hashtags', content: categories.trending.join(' ') }
    ];
    const formatted = formatPlainTextDocument(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Hashtags`, sections);
    await saveDocument(formatted, 'hashtags', `${platform} Hashtags`);
  }

  async function handleGenerate() {
    if (!contentDescription) {
      setError('Please describe your content');
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

      const result = await generateHashtags({
        platform,
        contentDescription,
        niche,
        userId: currentUser.uid
      });

      setHashtags(result.hashtags);
      setCategories(result.categories);

      if (!hasPremiumAccess(currentUser)) {
        await decrementFreeOptimization(currentUser.uid);
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate hashtags');
    } finally {
      setLoading(false);
    }
  }

  function copyHashtags(category?: 'all' | 'popular' | 'niche' | 'trending') {
    let textToCopy = '';
    
    if (!category || category === 'all') {
      textToCopy = hashtags.join(' ');
    } else {
      textToCopy = categories[category].join(' ');
    }
    
    navigator.clipboard.writeText(textToCopy);
  }

  return (
    <div className="hashtag-generator-container">
      <nav className="hashtag-nav">
        <h1 onClick={() => navigate('/social-media-tools')}>← Hashtag Generator</h1>
        <div className="nav-right">
          <span className="user-badge">
            {currentUser?.isPremium ? (
              <>
                <MonoIcon icon={Star} size={14} className="mono-icon inline" />
                Premium
              </>
            ) : (
              <>
                <MonoIcon icon={Circle} size={12} className="mono-icon inline" />
                Free
              </>
            )}
          </span>
          <span className="optimizations-badge">
            {currentUser?.isPremium 
              ? '∞ generations' 
              : `${currentUser?.freeOptimizationsRemaining || 0} free left`}
          </span>
        </div>
      </nav>

      <div className="hashtag-content">
        <div className="hashtag-grid">
          <div className="input-section">
            <h3>Platform</h3>
            <div className="platform-selector">
              {(['instagram', 'tiktok', 'youtube', 'twitter'] as Platform[]).map((p) => (
                <button
                  key={p}
                  className={`platform-button ${platform === p ? 'active' : ''}`}
                  onClick={() => setPlatform(p)}
                >
                  {p === 'instagram' && (
                    <MonoIcon icon={Camera} size={16} className="mono-icon inline" />
                  )}
                  {p === 'tiktok' && (
                    <MonoIcon icon={Music} size={16} className="mono-icon inline" />
                  )}
                  {p === 'youtube' && (
                    <MonoIcon icon={Video} size={16} className="mono-icon inline" />
                  )}
                  {p === 'twitter' && (
                    <MonoIcon icon={AtSign} size={16} className="mono-icon inline" />
                  )}
                  {' '}
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <h3>Content Description</h3>
            <textarea
              placeholder="Describe your content... (e.g., 'Healthy breakfast smoothie bowl recipe with berries')"
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              rows={6}
            />

            <h3>Niche (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., fitness, fashion, tech, food"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !contentDescription}
              className="generate-button"
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <MonoIcon icon={Hash} size={16} className="mono-icon inline" />
                  Generate Hashtags
                </>
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && (
              <div className="update-message success">
                <MonoIcon icon={CheckCircle2} size={16} className="mono-icon inline" />
                Saved to Documents!
              </div>
            )}

            <div className="info-box">
              <h4>
                <MonoIcon icon={Lightbulb} size={16} className="mono-icon inline" />
                Tips for Best Results
              </h4>
              <ul>
                <li>Be specific about your content topic</li>
                <li>Mention the niche to get targeted hashtags</li>
                <li>Instagram: Use 20-30 hashtags</li>
                <li>TikTok: Use 3-5 trending hashtags</li>
                <li>YouTube: Use 15-20 in description</li>
                <li>Twitter: Keep it to 1-2 hashtags</li>
              </ul>
            </div>
          </div>

          <div className="output-section">
            {hashtags.length > 0 ? (
              <>
                <div className="hashtag-results">
                  <div className="result-header">
                    <h3>
                      <MonoIcon icon={Target} size={18} className="mono-icon inline" />
                      All Hashtags ({hashtags.length})
                    </h3>
                    <button className="copy-button" onClick={() => copyHashtags('all')}>
                      Copy All
                    </button>
                  </div>
                  <div className="hashtag-cloud">
                    {hashtags.map((tag, idx) => (
                      <span key={idx} className="hashtag-pill">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="hashtag-categories">
                  <div className="category-section">
                    <div className="category-header">
                      <h4>
                        <MonoIcon icon={Flame} size={16} className="mono-icon inline" />
                        Popular
                      </h4>
                      <button className="copy-button-sm" onClick={() => copyHashtags('popular')}>
                        Copy
                      </button>
                    </div>
                    <div className="hashtag-list">
                      {categories.popular.map((tag, idx) => (
                        <span key={idx} className="hashtag-pill popular">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="category-section">
                    <div className="category-header">
                      <h4>
                        <MonoIcon icon={Target} size={16} className="mono-icon inline" />
                        Niche
                      </h4>
                      <button className="copy-button-sm" onClick={() => copyHashtags('niche')}>
                        Copy
                      </button>
                    </div>
                    <div className="hashtag-list">
                      {categories.niche.map((tag, idx) => (
                        <span key={idx} className="hashtag-pill niche">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="category-section">
                    <div className="category-header">
                      <h4>
                        <MonoIcon icon={TrendingUp} size={16} className="mono-icon inline" />
                        Trending
                      </h4>
                      <button className="copy-button-sm" onClick={() => copyHashtags('trending')}>
                        Copy
                      </button>
                    </div>
                    <div className="hashtag-list">
                      {categories.trending.map((tag, idx) => (
                        <span key={idx} className="hashtag-pill trending">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="usage-tips">
                  <h4>
                    <MonoIcon icon={Smartphone} size={16} className="mono-icon inline" />
                    Platform-Specific Tips
                  </h4>
                  <p>
                    <strong>Instagram:</strong> Mix popular and niche hashtags. Place in first comment or caption.<br/>
                    <strong>TikTok:</strong> Focus on trending hashtags. Update regularly.<br/>
                    <strong>YouTube:</strong> Add to video description, not title.<br/>
                    <strong>Twitter:</strong> Use sparingly (1-2 max) in tweets.
                  </p>
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
                <span className="empty-icon">
                  <MonoIcon icon={Hash} size={24} className="mono-icon" />
                </span>
                <p>Describe your content and click "Generate Hashtags" to get relevant hashtags for your post.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Generating hashtags..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Hashtag Generator"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
