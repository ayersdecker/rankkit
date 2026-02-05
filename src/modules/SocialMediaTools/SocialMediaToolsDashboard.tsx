import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import './SocialMediaToolsDashboard.css';

export default function SocialMediaToolsDashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
    setShowSignOutModal(false);
  }

  const tools = [
    {
      id: 'post-optimizer',
      title: 'Post Optimizer',
      icon: '📱',
      description: 'Optimize content for Instagram, TikTok, YouTube, and Twitter',
      path: '/post-optimizer',
      color: '#E91E63',
      comingSoon: false
    },
    {
      id: 'hashtag-generator',
      title: 'Hashtag Generator',
      icon: '#️⃣',
      description: 'Generate trending and relevant hashtags for your content',
      path: '/hashtag-generator',
      color: '#9C27B0',
      comingSoon: false
    },
    {
      id: 'caption-analyzer',
      title: 'Caption Analyzer',
      icon: '🔍',
      description: 'Analyze caption performance and get improvement suggestions',
      path: '/caption-analyzer',
      color: '#3F51B5',
      comingSoon: true
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar',
      icon: '📅',
      description: 'Plan and schedule your social media content strategy',
      path: '/content-calendar',
      color: '#00BCD4',
      comingSoon: true
    },
    {
      id: 'trend-finder',
      title: 'Trend Finder',
      icon: '🔥',
      description: 'Discover trending topics and viral content ideas',
      path: '/trend-finder',
      color: '#FF5722',
      comingSoon: true
    },
    {
      id: 'competitor-analysis',
      title: 'Competitor Analysis',
      icon: '📊',
      description: 'Analyze competitors and learn from their best content',
      path: '/competitor-analysis',
      color: '#4CAF50',
      comingSoon: true
    }
  ];

  return (
    <div className="social-media-tools-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => navigate('/workplace-tools')} className="nav-link">Workplace</button>
          <button onClick={() => navigate('/social-media-tools')} className="nav-link active">Social</button>
          <button onClick={() => navigate('/documents')} className="nav-link">Documents</button>
          <button onClick={() => navigate('/profile')} className="nav-link">Profile</button>
        </div>
        <div className="nav-right">
          <div className="user-info">
            <div className="user-avatar-small">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" />
              ) : (
                <span>{currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}</span>
              )}
            </div>
            <span>{currentUser?.displayName || currentUser?.email}</span>
          </div>
          <button onClick={() => setShowSignOutModal(true)}>Sign Out</button>
        </div>
      </nav>

      <div className="social-media-tools-content">
        <div className="tools-header">
          <h2>Social Media Tools Dashboard</h2>
          <p>Grow your audience and maximize engagement across all platforms</p>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className={`tool-card ${tool.comingSoon ? 'coming-soon' : ''}`}
              onClick={() => !tool.comingSoon && navigate(tool.path)}
              style={{ borderTopColor: tool.color, cursor: tool.comingSoon ? 'not-allowed' : 'pointer' }}
            >
              {tool.comingSoon && (
                <div className="construction-badge">
                  🚧 Under Construction
                </div>
              )}
              <div className="tool-icon" style={{ background: `${tool.color}15`, opacity: tool.comingSoon ? 0.5 : 1 }}>
                <span style={{ fontSize: '2.5rem' }}>{tool.icon}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <button 
                className="tool-button" 
                style={{ background: tool.comingSoon ? '#999' : tool.color }}
                disabled={tool.comingSoon}
              >
                {tool.comingSoon ? 'Coming Soon' : 'Open Tool →'}
              </button>
            </div>
          ))}
        </div>

        <div className="tools-info">
          <div className="info-card">
            <h3>🎯 Perfect For</h3>
            <ul>
              <li>Content creators and influencers</li>
              <li>Social media managers</li>
              <li>Brand marketers</li>
              <li>Small business owners</li>
              <li>Anyone building an audience</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🚀 Content Strategy</h3>
            <p>
              <strong>1.</strong> Use <strong>Trend Finder</strong> to discover hot topics<br/>
              <strong>2.</strong> Create content with <strong>Post Optimizer</strong><br/>
              <strong>3.</strong> Generate hashtags with <strong>Hashtag Generator</strong><br/>
              <strong>4.</strong> Schedule posts in <strong>Content Calendar</strong><br/>
              <strong>5.</strong> Learn from competitors with <strong>Competitor Analysis</strong>
            </p>
          </div>

          {!currentUser?.isPremium && (
            <div className="info-card upgrade-card">
              <h3>🔥 Go Pro</h3>
              <p>
                Unlimited optimizations, hashtag sets, and advanced analytics. 
                Perfect for serious content creators who post daily.
              </p>
              <button 
                className="upgrade-button"
                onClick={() => navigate('/profile?tab=billing')}
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>

      {showSignOutModal && (
        <SignOutConfirmation
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
}
