import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/documents')} className="nav-link">Documents</button>
          <button onClick={() => navigate('/optimize')} className="nav-link">Optimize</button>
          <button onClick={() => navigate('/profile')} className="nav-link">Profile</button>
        </div>
        <div className="nav-right">
          <span>{currentUser?.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="hero-section">
          <h2>Welcome to RankKit</h2>
          <p>AI-powered document optimization for resumes and social content</p>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/documents?action=upload')}>
              <div className="action-icon">📤</div>
              <h4>Upload Document</h4>
              <p>Add a new resume or post to your library</p>
            </div>

            <div className="action-card" onClick={() => navigate('/optimize')}>
              <div className="action-icon">⚡</div>
              <h4>Optimize</h4>
              <p>Run AI optimization on your documents</p>
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
              <h4>📄 Document Management</h4>
              <p>Upload, organize, and manage all your documents in one place</p>
            </div>
            
            <div className="feature">
              <h4>🎯 ATS Optimization</h4>
              <p>Optimize resumes to pass Applicant Tracking Systems</p>
            </div>
            
            <div className="feature">
              <h4>📱 Social SEO</h4>
              <p>Maximize engagement on Instagram, TikTok, YouTube, Twitter</p>
            </div>
            
            <div className="feature">
              <h4>📊 Version Control</h4>
              <p>Track all optimization versions and improvements</p>
            </div>
            
            <div className="feature">
              <h4>💾 Export Anywhere</h4>
              <p>Download optimized documents in multiple formats</p>
            </div>
            
            <div className="feature">
              <h4>📈 Analytics</h4>
              <p>See scores and suggestions for every optimization</p>
            </div>
          </div>
        </div>

        <div className="usage-summary">
          <h3>Your Usage</h3>
          <div className="usage-card">
            <div className="usage-stat">
              <span className="stat-label">Optimizations Used</span>
              <span className="stat-value">{currentUser?.usageCount || 0} / {currentUser?.isPremium ? '∞' : '3'}</span>
            </div>
            <div className="usage-stat">
              <span className="stat-label">Plan</span>
              <span className="stat-value">{currentUser?.isPremium ? 'Premium' : 'Free'}</span>
            </div>
            {!currentUser?.isPremium && (
              <button className="upgrade-button" onClick={() => navigate('/profile?tab=billing')}>
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
