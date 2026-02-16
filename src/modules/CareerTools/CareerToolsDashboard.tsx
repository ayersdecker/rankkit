import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import './CareerToolsDashboard.css';

export default function CareerToolsDashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const isAuthed = !!currentUser;

  function handleNavClick(path: string) {
    navigate(path);
    setIsMenuOpen(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
    setShowSignOutModal(false);
    setIsMenuOpen(false);
  }

  const tools = [
    {
      id: 'resume',
      title: 'Resume Optimizer',
      icon: '📝',
      description: 'Optimize your resume for ATS systems and specific job postings',
      path: '/resume-optimizer',
      color: '#4CAF50'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Writer',
      icon: '✉️',
      description: 'Generate personalized cover letters from your resume and bio',
      path: '/cover-letter',
      color: '#2196F3'
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      icon: '💼',
      description: 'Get common questions, answers, and tips for your interviews',
      path: '/interview-prep',
      color: '#FF9800'
    },
    {
      id: 'job-search',
      title: 'Job Search Assistant',
      icon: '🔍',
      description: 'Find the best platforms, strategies, and keywords for your search',
      path: '/job-search',
      color: '#9C27B0'
    },
    {
      id: 'post-optimizer',
      title: 'Job Post Optimizer',
      icon: '✨',
      description: 'Sharpen job posts and announcements for higher visibility',
      path: '/post-optimizer',
      color: '#00BCD4'
    },
    {
      id: 'networking-message',
      title: 'Networking Message Builder',
      icon: '🤝',
      description: 'Create warm outreach messages for introductions and LinkedIn DMs',
      path: '/networking-message',
      color: '#FF7043',
      comingSoon: true
    }
  ];

  return (
    <div className="career-tools-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => handleNavClick('/dashboard')}>RankKit</h1>
        <div id="mobile-navigation" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {isAuthed && (
            <button onClick={() => handleNavClick('/profile')} className="nav-link profile-nav-link">
              <div className="profile-nav-avatar">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" />
                ) : (
                  <span>{currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}</span>
                )}
              </div>
              <div className="profile-nav-text">
                <span className="profile-nav-label">Account</span>
                <span className="profile-nav-name">{currentUser?.displayName || 'Profile'}</span>
                <span className="profile-nav-email">{currentUser?.email}</span>
              </div>
            </button>
          )}
          <button onClick={() => handleNavClick('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => handleNavClick('/career-tools')} className="nav-link active">Career</button>
          <button onClick={() => handleNavClick('/workplace-tools')} className="nav-link">Workplace</button>
          <button onClick={() => handleNavClick('/social-media-tools')} className="nav-link">Social</button>
          <button onClick={() => handleNavClick('/documents')} className="nav-link">Documents</button>
          {isAuthed && (
            <button onClick={() => setShowSignOutModal(true)} className="nav-link signout-link">Sign Out</button>
          )}
        </div>
        <div className="nav-right">
          <button
            className="nav-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            ☰
          </button>
          {isAuthed ? (
            <div className="user-info">
              <button
                className="profile-button"
                onClick={() => handleNavClick('/profile')}
                aria-label="Open profile"
              >
                <div className="user-avatar-small">
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" />
                  ) : (
                    <span>{currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="profile-button-text">{currentUser?.displayName || currentUser?.email}</span>
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <button className="nav-auth secondary" onClick={() => handleNavClick('/login')}>Sign In</button>
              <button className="nav-auth" onClick={() => handleNavClick('/signup')}>Get Started</button>
            </div>
          )}
        </div>
      </nav>

      <div className="career-tools-content">
        <div className="tools-header">
          <h2>Career Tools Dashboard</h2>
          <p>Everything you need to land your dream job</p>
        </div>

        {!isAuthed && (
          <div className="guest-cta">
            <div>
              <h3>Explore the career toolkit</h3>
              <p>Browse tools and workflows. Sign in to run optimizations and save results.</p>
            </div>
            <div className="guest-cta-actions">
              <button onClick={() => navigate('/signup')}>Create free account</button>
              <button className="ghost" onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </div>
        )}

        <div className="tools-grid">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className={`tool-card ${tool.comingSoon ? 'coming-soon' : ''}`}
              onClick={() => !tool.comingSoon && navigate(tool.path)}
              style={{ borderTopColor: tool.color, cursor: tool.comingSoon ? 'not-allowed' : 'pointer' }}
            >
              {tool.comingSoon && (
                <div className="construction-badge">Coming Soon</div>
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
            <h3>💡 How It Works</h3>
            <ol>
              <li>Choose a tool from the dashboard above</li>
              <li>Enter your information and job details</li>
              <li>Get AI-powered optimization or generation</li>
              <li>Download, copy, or refine your results</li>
            </ol>
          </div>

          <div className="info-card">
            <h3>✨ Pro Tip</h3>
            <p>
              Start with the <strong>Resume Optimizer</strong> to perfect your resume, 
              then use the <strong>Cover Letter Writer</strong> to create matching letters. 
              Finally, prepare with <strong>Interview Prep</strong> and find opportunities 
              with <strong>Job Search Assistant</strong>.
            </p>
          </div>

          {currentUser && !currentUser.isPremium && (
            <div className="info-card upgrade-card">
              <h3>⭐ Upgrade to Premium</h3>
              <p>
                Get unlimited access to all career tools, priority support, 
                and early access to new features.
              </p>
              <button 
                className="upgrade-button"
                onClick={() => navigate('/profile?tab=billing')}
              >
                View Plans
              </button>
            </div>
          )}        </div>
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
