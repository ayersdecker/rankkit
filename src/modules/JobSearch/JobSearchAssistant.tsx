import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateJobSearchStrategy } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import './JobSearchAssistant.css';

export default function JobSearchAssistant() {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('entry');
  const [location, setLocation] = useState('');
  const [searchData, setSearchData] = useState<{
    platforms: string[];
    searchStrategies: string[];
    keywords: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
      return;
    }
  }, [currentUser, navigate]);

  async function handleGenerate() {
    if (!jobTitle || !skills) {
      setError('Please provide job title and skills');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to get job search assistance');
      return;
    }

    try {
      // Check if user can optimize
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to generate. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);

      const result = await generateJobSearchStrategy({
        jobTitle: jobTitle,
        skills: skillsArray,
        experience: experience,
        location: location || undefined
      });

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      setSearchData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate job search strategy');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyKeywords() {
    if (searchData) {
      navigator.clipboard.writeText(searchData.keywords.join(', '));
    }
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/dashboard')}>← Job Search Assistant</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Get personalized job search guidance including best platforms, search strategies, and effective keywords for your target role.</p>
        </div>

        <div className="job-search-layout">
          <div className="input-section">
            <h3>Target Job Title</h3>
            <input
              type="text"
              placeholder="e.g., Software Engineer, Marketing Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="text-input"
            />

            <h3>Your Skills</h3>
            <textarea
              placeholder="Enter your key skills separated by commas (e.g., JavaScript, React, Node.js)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={4}
            />

            <h3>Experience Level</h3>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="select-input"
            >
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6-10 years)</option>
              <option value="lead">Lead/Principal (10+ years)</option>
            </select>

            <h3>Preferred Location (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., San Francisco, Remote, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-input"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !jobTitle || !skills}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Get Job Search Strategy'}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="output-section job-search-output">
            {searchData ? (
              <>
                <div className="search-section">
                  <h3>🌐 Recommended Job Platforms</h3>
                  <div className="platforms-grid">
                    {searchData.platforms.map((platform, index) => (
                      <div key={index} className="platform-card">
                        {platform}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="search-section">
                  <h3>🎯 Search Strategies</h3>
                  <ul className="strategies-list">
                    {searchData.searchStrategies.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>

                <div className="search-section">
                  <h3>🔑 Keywords & Search Terms</h3>
                  <div className="keywords-container">
                    {searchData.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <button 
                    className="secondary-button copy-keywords-btn" 
                    onClick={handleCopyKeywords}
                  >
                    📋 Copy All Keywords
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Fill in your job search criteria and click "Get Job Search Strategy" to receive personalized recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          toolName="Job Search Assistant"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
