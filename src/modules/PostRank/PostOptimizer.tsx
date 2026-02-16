import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AtSign, Camera, CheckCircle2, Copy, Music, Save, Video } from 'lucide-react';
import { optimizeContent } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import { MonoIcon } from '../../components/Shared/MonoIcon';
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
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
    }
  }, [currentUser, navigate]);

  async function handleSave() {
    if (!optimizedPost) return;
    const sections = [
      { heading: 'Optimized Post', content: optimizedPost },
      { heading: 'Recommended Hashtags', content: hashtags.join(' ') },
      { heading: 'Key Improvements', content: suggestions },
      { heading: 'Engagement Score', content: `${engagementScore}/100` }
    ];
    const formatted = formatPlainTextDocument(`Optimized ${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`, sections);
    await saveDocument(formatted, 'post', `${platform} Post`);
  }

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
      }, currentUser.uid);

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
        <h1 onClick={() => navigate('/social-media-tools')}>← PostRank</h1>
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
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && (
              <div className="update-message success">
                <MonoIcon icon={CheckCircle2} size={16} className="mono-icon inline" />
                Saved to Documents!
              </div>
            )}
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

                <div className="action-buttons">
                  <button className="secondary-button" onClick={handleSave} disabled={saving}>
                    <MonoIcon icon={Save} size={16} className="mono-icon inline" />
                    {saving ? 'Saving...' : 'Save to Documents'}
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigator.clipboard.writeText(optimizedPost + '\n\n' + hashtags.join(' '))}
                  >
                    <MonoIcon icon={Copy} size={16} className="mono-icon inline" />
                    Copy to Clipboard
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Select a platform, paste your post, then click "Optimize Post" to see your optimized version here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Optimizing your post..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Post Optimizer"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
