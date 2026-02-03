import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { optimizeContent } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import '../ResumeRank/ResumeOptimizer.css';

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export default function PostOptimizer() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [originalPost, setOriginalPost] = useState('');
  const [optimizedPost, setOptimizedPost] = useState('');
  const [engagementScore, setEngagementScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
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

  async function handleOptimize() {
    if (!originalPost) {
      setError('Please provide a post to optimize');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to optimize');
      return;
    }

    try {
      // Check if user can optimize
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to optimize. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const result = await optimizeContent({
        type: 'post',
        content: originalPost,
        context: platform
      });

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      setOptimizedPost(result.optimized);
      setEngagementScore(result.score);
      setSuggestions(result.suggestions);
      setHashtags(result.metadata?.hashtags || []);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/dashboard')}>← PostRank</h1>
      </nav>

      <div className="optimizer-content">
        <div className="optimizer-grid">
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

            <h3>Your Post / Caption</h3>
            <textarea
              placeholder="Paste your post caption or title here..."
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
              rows={15}
            />

            <button
              onClick={handleOptimize}
              disabled={loading || !originalPost}
              className="optimize-button"
            >
              {loading ? 'Optimizing...' : 'Optimize Post'}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="output-section">
            {optimizedPost ? (
              <>
                <div className="score-card">
                  <h3>Engagement Score</h3>
                  <div className="score-circle">
                    <span className="score-number">{engagementScore}</span>
                    <span className="score-label">/100</span>
                  </div>
                </div>

                <h3>Optimized Post</h3>
                <div className="optimized-output">
                  {optimizedPost}
                </div>

                {hashtags.length > 0 && (
                  <>
                    <h3>Recommended Hashtags</h3>
                    <div className="hashtags-container">
                      {hashtags.map((tag, index) => (
                        <span key={index} className="hashtag">{tag}</span>
                      ))}
                    </div>
                  </>
                )}

                <h3>Key Improvements</h3>
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>

                <button
                  className="download-button"
                  onClick={() => navigator.clipboard.writeText(optimizedPost + '\n\n' + hashtags.join(' '))}
                >
                  Copy to Clipboard
                </button>
              </>
            ) : (
              <div className="empty-state">
                <p>Select a platform, paste your post, then click "Optimize Post" to see your optimized version here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          toolName="Post Optimizer"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
