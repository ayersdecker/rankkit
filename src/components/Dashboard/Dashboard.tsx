import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import './Dashboard.css';

export default function Dashboard() {
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

  return (
    <div className="dashboard-container">
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

      <div className="dashboard-content">
        <div className="hero-section">
          <h2>Welcome to <span className="brand-name">RankKit</span></h2>
          <p>AI-powered document optimization for resumes and social content</p>
        </div>

        {!isAuthed && (
          <div className="guest-cta">
            <div>
              <h3>Explore RankKit as a guest</h3>
              <p>Browse the tools and see what is possible. Sign in to save work and run optimizations.</p>
            </div>
            <div className="guest-cta-actions">
              <button onClick={() => navigate('/signup')}>Create free account</button>
              <button className="ghost" onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h3>Tool Dashboards</h3>
          <div className="actions-grid main-dashboards">
            <div className="action-card featured" onClick={() => navigate('/career-tools')}>
              <div className="action-icon">💼</div>
              <h4>Career Tools</h4>
              <p>Resume optimization, cover letters, interview prep, and job search</p>
              <span className="tools-count">4 Tools Available</span>
            </div>

            <div className="action-card featured" onClick={() => navigate('/workplace-tools')}>
              <div className="action-icon">🎯</div>
              <h4>Workplace Tools</h4>
              <p>Cold emails, sales scripts, selling points, and persuasion tactics</p>
              <span className="tools-count">6 Tools Available</span>
            </div>

            <div className="action-card featured" onClick={() => navigate('/social-media-tools')}>
              <div className="action-icon">📱</div>
              <h4>Social Media Tools</h4>
              <p>Optimize content for Instagram, TikTok, YouTube, and Twitter</p>
              <span className="tools-count">6 Tools Available</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Access</h3>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/resume-optimizer')}>
              <div className="action-icon">📝</div>
              <h4>Resume Optimizer</h4>
              <p>Optimize your resume for ATS systems</p>
            </div>

            <div className="action-card" onClick={() => navigate('/cover-letter')}>
              <div className="action-icon">✉️</div>
              <h4>Cover Letter Writer</h4>
              <p>Generate tailored cover letters</p>
            </div>

            <div className="action-card" onClick={() => navigate('/interview-prep')}>
              <div className="action-icon">💼</div>
              <h4>Interview Prep</h4>
              <p>Get ready for your next interview</p>
            </div>

            <div className="action-card" onClick={() => navigate('/post-optimizer')}>
              <div className="action-icon">📱</div>
              <h4>Post Optimizer</h4>
              <p>Maximize social media engagement</p>
            </div>

            <div className="action-card" onClick={() => navigate('/job-search')}>
              <div className="action-icon">🔍</div>
              <h4>Job Search Assistant</h4>
              <p>Find the best places to apply</p>
            </div>

            <div className="action-card" onClick={() => navigate('/documents')}>
              <div className="action-icon">📁</div>
              <h4>View Documents</h4>
              <p>Browse your document library</p>
            </div>
          </div>
        </div>

        <div className="features-overview">
          <h3>What You Can Do</h3>
          <div className="features-grid">
            <div className="feature">
              <h4>📄 Resume Optimization</h4>
              <p>Optimize resumes to pass ATS systems and match job descriptions</p>
            </div>
            
            <div className="feature">
              <h4>✉️ Cover Letters</h4>
              <p>Generate personalized cover letters using your resume and bio</p>
            </div>
            
            <div className="feature">
              <h4>💼 Interview Preparation</h4>
              <p>Get common questions, answers, and tips for your interviews</p>
            </div>
            
            <div className="feature">
              <h4>� Cold Emails</h4>
              <p>Create personalized outreach emails that get responses</p>
            </div>
            
            <div className="feature">
              <h4>💡 Selling Points Analysis</h4>
              <p>Extract key selling points from any product or service</p>
            </div>
            
            <div className="feature">
              <h4>📱 Social Media SEO</h4>
              <p>Maximize engagement on Instagram, TikTok, YouTube, Twitter</p>
            </div>
          </div>
        </div>

        {isAuthed ? (
          <div className="usage-summary">
            <h3>Your Usage</h3>
            <div className="usage-card">
              <div className="usage-stat">
                <span className="stat-label">Optimizations Used</span>
                <span className="stat-value">{currentUser?.usageCount || 0}</span>
              </div>
              <div className="usage-stat">
                <span className="stat-label">Free Optimizations Remaining</span>
                <span className="stat-value">
                  {currentUser?.isPremium ? '∞' : (currentUser?.freeOptimizationsRemaining || 0)}
                </span>
              </div>
              <div className="usage-stat">
                <span className="stat-label">Plan</span>
                <span className="stat-value">{currentUser?.isPremium ? 'Premium' : 'Free'}</span>
              </div>
              {currentUser && !currentUser.isPremium && (
                <div className="upgrade-card">
                  <div className="upgrade-card-text">
                    <span className="upgrade-eyebrow">Unlock more power</span>
                    <p>Go premium for unlimited optimizations and priority features.</p>
                  </div>
                  <button className="upgrade-button" onClick={() => navigate('/profile?tab=billing')}>
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="usage-summary">
            <h3>Your Usage</h3>
            <div className="usage-card guest-usage">
              <p>Sign in to track optimizations, save documents, and unlock premium features.</p>
              <button onClick={() => navigate('/signup')}>Create free account</button>
            </div>
          </div>
        )}
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
