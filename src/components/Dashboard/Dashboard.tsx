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
        <h1>RankKit</h1>
        <div className="nav-right">
          <span>{currentUser?.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Welcome to RankKit</h2>
        <p>Choose a tool to get started:</p>

        <div className="tools-grid">
          <div className="tool-card" onClick={() => navigate('/resume')}>
            <div className="tool-icon">📄</div>
            <h3>ResumeRank</h3>
            <p>Optimize your resume for ATS and job postings</p>
            <span className="tool-price">$25/month</span>
          </div>

          <div className="tool-card" onClick={() => navigate('/post')}>
            <div className="tool-icon">📱</div>
            <h3>PostRank</h3>
            <p>Optimize social media posts for engagement</p>
            <span className="tool-price">$20/month</span>
          </div>

          <div className="tool-card bundle">
            <div className="tool-icon">🎁</div>
            <h3>RankKit Bundle</h3>
            <p>Both tools + save $10/month</p>
            <span className="tool-price">
              <strike>$45</strike> $35/month
            </span>
          </div>
        </div>

        <div className="usage-info">
          <h3>Your Usage</h3>
          <p>Free tier: {currentUser?.usageCount || 0} / 3 optimizations used</p>
          {currentUser?.isPremium ? (
            <span className="premium-badge">Premium Member</span>
          ) : (
            <button className="upgrade-button">Upgrade to Premium</button>
          )}
        </div>
      </div>
    </div>
  );
}
