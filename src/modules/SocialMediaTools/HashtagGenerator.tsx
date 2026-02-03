import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateHashtags } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { shouldShowPaywall, hasPremiumAccess } from '../../utils/premiumUtils';
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

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
    }
  }, [currentUser, navigate]);

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
        niche
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
            {currentUser?.isPremium ? '⭐ Premium' : '🆓 Free'}
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
                  {p === 'instagram' && '📷'}
                  {p === 'tiktok' && '🎵'}
                  {p === 'youtube' && '📹'}
                  {p === 'twitter' && '🐦'}
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
              {loading ? 'Generating...' : '# Generate Hashtags'}
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className="info-box">
              <h4>💡 Tips for Best Results</h4>
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
                    <h3>🎯 All Hashtags ({hashtags.length})</h3>
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
                      <h4>🔥 Popular</h4>
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
                      <h4>🎯 Niche</h4>
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
                      <h4>📈 Trending</h4>
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
                  <h4>📱 Platform-Specific Tips</h4>
                  <p>
                    <strong>Instagram:</strong> Mix popular and niche hashtags. Place in first comment or caption.<br/>
                    <strong>TikTok:</strong> Focus on trending hashtags. Update regularly.<br/>
                    <strong>YouTube:</strong> Add to video description, not title.<br/>
                    <strong>Twitter:</strong> Use sparingly (1-2 max) in tweets.
                  </p>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">#️⃣</span>
                <p>Describe your content and click "Generate Hashtags" to get relevant hashtags for your post.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          toolName="Hashtag Generator"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
