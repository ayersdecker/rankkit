import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import './WorkplaceToolsDashboard.css';

export default function WorkplaceToolsDashboard() {
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
      id: 'cold-email',
      title: 'Cold Email Generator',
      icon: '📧',
      description: 'Create personalized cold outreach emails that get responses',
      path: '/cold-email',
      color: '#FF6B6B',
      comingSoon: false
    },
    {
      id: 'sales-script',
      title: 'Sales Script Builder',
      icon: '📞',
      description: 'Generate effective sales scripts for calls, demos, and pitches',
      path: '/sales-script',
      color: '#4ECDC4',
      comingSoon: false
    },
    {
      id: 'selling-points',
      title: 'Selling Points Finder',
      icon: '💡',
      description: 'Analyze products/services and extract key selling points from links',
      path: '/selling-points',
      color: '#95E1D3',
      comingSoon: false
    },
    {
      id: 'objection-handler',
      title: 'Objection Handler',
      icon: '🛡️',
      description: 'Get responses to common sales objections and push-backs',
      path: '/objection-handler',
      color: '#F38181',
      comingSoon: false
    },
    {
      id: 'pitch-perfect',
      title: 'Pitch Perfect',
      icon: '🎯',
      description: 'Create compelling elevator pitches and value propositions',
      path: '/pitch-perfect',
      color: '#AA96DA',
      comingSoon: false
    },
    {
      id: 'meeting-prep',
      title: 'Meeting Prep Assistant',
      icon: '📋',
      description: 'Prepare for sales meetings with research and talking points',
      path: '/meeting-prep',
      color: '#FCBAD3',
      comingSoon: true
    }
  ];

  return (
    <div className="workplace-tools-container">
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
          <button onClick={() => handleNavClick('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => handleNavClick('/workplace-tools')} className="nav-link active">Workplace</button>
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

      <div className="workplace-tools-content">
        <div className="tools-header">
          <h2>Workplace Tools Dashboard</h2>
          <p>Your professional communication and sales persuasion toolkit</p>
        </div>

        {!isAuthed && (
          <div className="guest-cta">
            <div>
              <h3>Explore the workplace toolkit</h3>
              <p>Preview the tools. Sign in to generate outreach and save assets.</p>
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
            <h3>💼 Perfect For</h3>
            <ul>
              <li>Sales professionals and business development</li>
              <li>Entrepreneurs and startup founders</li>
              <li>Marketing and growth teams</li>
              <li>Consultants and freelancers</li>
              <li>Anyone doing cold outreach</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>✨ Pro Workflow</h3>
            <p>
              <strong>1.</strong> Use <strong>Selling Points Finder</strong> to analyze your product<br/>
              <strong>2.</strong> Create a <strong>Pitch Perfect</strong> elevator pitch<br/>
              <strong>3.</strong> Generate <strong>Cold Emails</strong> for outreach<br/>
              <strong>4.</strong> Build <strong>Sales Scripts</strong> for follow-ups<br/>
              <strong>5.</strong> Prepare responses with <strong>Objection Handler</strong>
            </p>
          </div>

          {currentUser && !currentUser.isPremium && (
            <div className="info-card upgrade-card">
              <h3>🔥 Go Pro</h3>
              <p>
                Unlimited access to all workplace tools. Perfect for sales teams 
                and professionals who need consistent, high-quality messaging.
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
