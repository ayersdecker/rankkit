import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import { getUserDocuments } from '../../services/firestore';
import {
  Briefcase,
  FileText,
  Folder,
  Lightbulb,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Smartphone,
  Target,
  TrendingUp
} from 'lucide-react';
import { MonoIcon } from '../Shared/MonoIcon';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);
  const isAuthed = !!currentUser;

  useEffect(() => {
    let isMounted = true;

    async function fetchDocumentCount() {
      if (!currentUser) {
        if (isMounted) {
          setDocumentCount(0);
        }
        return;
      }

      try {
        const docs = await getUserDocuments(currentUser.uid);
        if (isMounted) {
          setDocumentCount(docs.length);
        }
      } catch (error) {
        console.error('Failed to load document count:', error);
        if (isMounted) {
          setDocumentCount(0);
        }
      }
    }

    fetchDocumentCount();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  function getAccountAgeLabel() {
    if (!currentUser?.createdAt) {
      return 'New';
    }

    const createdAt = (currentUser.createdAt instanceof Date)
      ? currentUser.createdAt
      : (typeof (currentUser.createdAt as any)?.toDate === 'function')
        ? (currentUser.createdAt as any).toDate()
        : new Date(currentUser.createdAt as any);

    if (Number.isNaN(createdAt.getTime())) {
      return 'New';
    }

    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - createdAt.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${Math.max(diffDays, 1)} day${diffDays === 1 ? '' : 's'}`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`;
    }

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears === 1 ? '' : 's'}`;
  }

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
            <MonoIcon icon={Menu} size={18} className="mono-icon" />
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
          <p>AI-powered optimization platform for career advancement, workplace communication, and social media engagement</p>
        </div>

        {!isAuthed && (
          <div className="guest-cta">
            <div>
              <h3>Explore RankKit as a guest</h3>
              <p>Browse our AI-powered career, workplace, and social media tools. Sign in to save work and run unlimited optimizations.</p>
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
              <div className="action-icon">
                <MonoIcon icon={Briefcase} size={40} className="mono-icon light" />
              </div>
              <h4>Career Tools</h4>
              <p>Resume optimization, cover letters, interview prep, and job search</p>
              <span className="tools-count">4 Tools Available</span>
            </div>

            <div className="action-card featured" onClick={() => navigate('/workplace-tools')}>
              <div className="action-icon">
                <MonoIcon icon={Target} size={40} className="mono-icon light" />
              </div>
              <h4>Workplace Tools</h4>
              <p>Cold emails, sales scripts, selling points, and persuasion tactics</p>
              <span className="tools-count">6 Tools Available</span>
            </div>

            <div className="action-card featured" onClick={() => navigate('/social-media-tools')}>
              <div className="action-icon">
                <MonoIcon icon={Smartphone} size={40} className="mono-icon light" />
              </div>
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
              <div className="action-icon">
                <MonoIcon icon={FileText} size={36} className="mono-icon" />
              </div>
              <h4>Resume Optimizer</h4>
              <p>Optimize your resume for ATS systems</p>
            </div>

            <div className="action-card" onClick={() => navigate('/cover-letter')}>
              <div className="action-icon">
                <MonoIcon icon={Mail} size={36} className="mono-icon" />
              </div>
              <h4>Cover Letter Writer</h4>
              <p>Generate tailored cover letters</p>
            </div>

            <div className="action-card" onClick={() => navigate('/interview-prep')}>
              <div className="action-icon">
                <MonoIcon icon={MessageCircle} size={36} className="mono-icon" />
              </div>
              <h4>Interview Prep</h4>
              <p>Get ready for your next interview</p>
            </div>

            <div className="action-card" onClick={() => navigate('/post-optimizer')}>
              <div className="action-icon">
                <MonoIcon icon={Smartphone} size={36} className="mono-icon" />
              </div>
              <h4>Post Optimizer</h4>
              <p>Maximize social media engagement</p>
            </div>

            <div className="action-card" onClick={() => navigate('/job-search')}>
              <div className="action-icon">
                <MonoIcon icon={Search} size={36} className="mono-icon" />
              </div>
              <h4>Job Search Assistant</h4>
              <p>Find the best places to apply</p>
            </div>

            <div className="action-card" onClick={() => navigate('/documents')}>
              <div className="action-icon">
                <MonoIcon icon={Folder} size={36} className="mono-icon" />
              </div>
              <h4>View Documents</h4>
              <p>Browse your document library</p>
            </div>
          </div>
        </div>

        <div className="features-overview">
          <h3>What You Can Do</h3>
          <div className="features-grid">
            <div className="feature">
              <h4>
                <MonoIcon icon={FileText} size={18} className="mono-icon inline" />
                Resume Optimization
              </h4>
              <p>Optimize resumes to pass ATS systems and match job descriptions</p>
            </div>
            
            <div className="feature">
              <h4>
                <MonoIcon icon={Mail} size={18} className="mono-icon inline" />
                Cover Letters
              </h4>
              <p>Generate personalized cover letters using your resume and bio</p>
            </div>
            
            <div className="feature">
              <h4>
                <MonoIcon icon={MessageCircle} size={18} className="mono-icon inline" />
                Interview Preparation
              </h4>
              <p>Get common questions, answers, and tips for your interviews</p>
            </div>
            
            <div className="feature">
              <h4>
                <MonoIcon icon={Mail} size={18} className="mono-icon inline" />
                Cold Emails
              </h4>
              <p>Create personalized outreach emails that get responses</p>
            </div>
            
            <div className="feature">
              <h4>
                <MonoIcon icon={Lightbulb} size={18} className="mono-icon inline" />
                Selling Points Analysis
              </h4>
              <p>Extract key selling points from any product or service</p>
            </div>
            
            <div className="feature">
              <h4>
                <MonoIcon icon={TrendingUp} size={18} className="mono-icon inline" />
                Social Media SEO
              </h4>
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
                <span className="stat-label">Documents</span>
                <span className="stat-value">{documentCount}</span>
              </div>
              <div className="usage-stat">
                <span className="stat-label">Account Age</span>
                <span className="stat-value">{getAccountAgeLabel()}</span>
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
