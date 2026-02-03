import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { optimizeContent } from '../../services/openai';
import { useNavigate } from 'react-router-dom';
import './ResumeOptimizer.css';

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleOptimize() {
    if (!resume || !jobPosting) {
      setError('Please provide both resume and job posting');
      return;
    }

    // Check usage limit
    if (!currentUser?.isPremium && (currentUser?.usageCount || 0) >= 3) {
      setError('Free tier limit reached. Upgrade to continue.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const result = await optimizeContent({
        type: 'resume',
        content: resume,
        context: jobPosting
      });

      setOptimizedResume(result.optimized);
      setMatchScore(result.score);
      setSuggestions(result.suggestions);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize resume');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/dashboard')}>← ResumeRank</h1>
      </nav>

      <div className="optimizer-content">
        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Job Posting</h3>
            <textarea
              placeholder="Paste the full job posting here..."
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
              rows={10}
            />

            <h3>Your Resume</h3>
            <textarea
              placeholder="Paste your current resume here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={15}
            />

            <button
              onClick={handleOptimize}
              disabled={loading || !resume || !jobPosting}
              className="optimize-button"
            >
              {loading ? 'Optimizing...' : 'Optimize Resume'}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="output-section">
            {optimizedResume ? (
              <>
                <div className="score-card">
                  <h3>ATS Match Score</h3>
                  <div className="score-circle">
                    <span className="score-number">{matchScore}</span>
                    <span className="score-label">/100</span>
                  </div>
                </div>

                <h3>Optimized Resume</h3>
                <div className="optimized-output">
                  {optimizedResume}
                </div>

                <h3>Key Improvements</h3>
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>

                <button className="download-button">Download as PDF</button>
              </>
            ) : (
              <div className="empty-state">
                <p>Paste your resume and job posting, then click "Optimize Resume" to see your optimized version here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
