import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './SocialMediaToolsDashboard.css';

export default function SocialMediaToolsDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'post-optimizer',
      title: 'Post Optimizer',
      icon: '📱',
      description: 'Optimize content for Instagram, TikTok, YouTube, and Twitter',
      path: '/post-optimizer',
      color: '#E91E63'
    },
    {
      id: 'hashtag-generator',
      title: 'Hashtag Generator',
      icon: '#️⃣',
      description: 'Generate trending and relevant hashtags for your content',
      path: '/hashtag-generator',
      color: '#9C27B0'
    },
    {
      id: 'caption-analyzer',
      title: 'Caption Analyzer',
      icon: '🔍',
      description: 'Analyze caption performance and get improvement suggestions',
      path: '/caption-analyzer',
      color: '#3F51B5'
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar',
      icon: '📅',
      description: 'Plan and schedule your social media content strategy',
      path: '/content-calendar',
      color: '#00BCD4'
    },
    {
      id: 'trend-finder',
      title: 'Trend Finder',
      icon: '🔥',
      description: 'Discover trending topics and viral content ideas',
      path: '/trend-finder',
      color: '#FF5722'
    },
    {
      id: 'competitor-analysis',
      title: 'Competitor Analysis',
      icon: '📊',
      description: 'Analyze competitors and learn from their best content',
      path: '/competitor-analysis',
      color: '#4CAF50'
    }
  ];

  return (
    <div className="social-media-tools-container">
      <nav className="social-media-tools-nav">
        <h1 onClick={() => navigate('/dashboard')}>← Social Media Tools</h1>
        <div className="nav-right">
          <span className="user-badge">
            {currentUser?.isPremium ? '⭐ Premium' : '🆓 Free'}
          </span>
          <span className="optimizations-badge">
            {currentUser?.isPremium 
              ? '∞ optimizations' 
              : `${currentUser?.freeOptimizationsRemaining || 0} free left`}
          </span>
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
              className="tool-card"
              onClick={() => navigate(tool.path)}
              style={{ borderTopColor: tool.color }}
            >
              <div className="tool-icon" style={{ background: `${tool.color}15` }}>
                <span style={{ fontSize: '2.5rem' }}>{tool.icon}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <button className="tool-button" style={{ background: tool.color }}>
                Open Tool →
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
    </div>
  );
}
