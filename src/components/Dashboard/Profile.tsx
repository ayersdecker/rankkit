import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account');
  
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
          <button onClick={() => navigate('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => navigate('/workplace-tools')} className="nav-link">Workplace</button>
          <button onClick={() => navigate('/social-media-tools')} className="nav-link">Social</button>
          <button onClick={() => navigate('/documents')} className="nav-link">Documents</button>
          <button onClick={() => navigate('/profile')} className="nav-link active">Profile</button>
        </div>
        <div className="nav-right">
          <span>{currentUser?.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()}
            </div>
            <h2>{currentUser?.displayName || 'User'}</h2>
            <p>{currentUser?.email}</p>
          </div>

          <div className="profile-menu">
            <button
              className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              👤 Account Settings
            </button>
            <button
              className={`menu-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              📁 Document Management
            </button>
            <button
              className={`menu-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              💳 Billing & Plans
            </button>
            <button
              className={`menu-item ${activeTab === 'usage' ? 'active' : ''}`}
              onClick={() => setActiveTab('usage')}
            >
              📊 Usage Stats
            </button>
          </div>

          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'documents' && <DocumentManagement />}
          {activeTab === 'billing' && <BillingPlans />}
          {activeTab === 'usage' && <UsageStats />}
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  const { currentUser } = useAuth();

  return (
    <div className="settings-section">
      <h2>Account Settings</h2>
      
      <div className="setting-card">
        <h3>Profile Information</h3>
        <div className="setting-field">
          <label>Email</label>
          <input type="email" value={currentUser?.email} disabled />
        </div>
        <div className="setting-field">
          <label>Display Name</label>
          <input type="text" placeholder="Your name" />
        </div>
        <button className="primary-button">Update Profile</button>
      </div>

      <div className="setting-card">
        <h3>Password</h3>
        <div className="setting-field">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="setting-field">
          <label>New Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="setting-field">
          <label>Confirm New Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button className="primary-button">Change Password</button>
      </div>

      <div className="setting-card danger">
        <h3>Danger Zone</h3>
        <p>Delete your account and all associated data permanently.</p>
        <button className="danger-button">Delete Account</button>
      </div>
    </div>
  );
}

function DocumentManagement() {
  const navigate = useNavigate();

  return (
    <div className="settings-section">
      <h2>Document Management</h2>
      
      <div className="setting-card">
        <h3>Quick Actions</h3>
        <div className="quick-action-grid">
          <button onClick={() => navigate('/documents?action=upload')}>
            <span>📤</span>
            Upload New Document
          </button>
          <button onClick={() => navigate('/documents')}>
            <span>📁</span>
            View All Documents
          </button>
          <button onClick={() => navigate('/optimize')}>
            <span>⚡</span>
            Optimize Document
          </button>
        </div>
      </div>

      <div className="setting-card">
        <h3>Storage & Limits</h3>
        <div className="stat-row">
          <span>Total Documents</span>
          <strong>12</strong>
        </div>
        <div className="stat-row">
          <span>Optimization Versions</span>
          <strong>34</strong>
        </div>
        <div className="stat-row">
          <span>Storage Used</span>
          <strong>2.4 MB / Unlimited</strong>
        </div>
      </div>

      <div className="setting-card">
        <h3>Document Settings</h3>
        <div className="setting-toggle">
          <label>
            <input type="checkbox" defaultChecked />
            <span>Auto-save optimization versions</span>
          </label>
        </div>
        <div className="setting-toggle">
          <label>
            <input type="checkbox" />
            <span>Keep original formatting when exporting</span>
          </label>
        </div>
        <div className="setting-toggle">
          <label>
            <input type="checkbox" defaultChecked />
            <span>Show version history in document view</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function BillingPlans() {
  const { currentUser } = useAuth();

  return (
    <div className="settings-section">
      <h2>Billing & Plans</h2>
      
      <div className="setting-card">
        <h3>Current Plan</h3>
        <div className="plan-current">
          <div className="plan-badge">{currentUser?.isPremium ? 'Premium' : 'Free'}</div>
          <p>{currentUser?.isPremium ? 'Unlimited optimizations' : '1 free optimization on signup'}</p>
        </div>
      </div>

      {!currentUser?.isPremium && (
        <div className="plans-grid">
          <div className="plan-card">
            <h3>Career Starter</h3>
            <div className="plan-price">$29<span>/month</span></div>
            <ul className="plan-features">
              <li>Unlimited resume optimizations</li>
              <li>Unlimited cover letter generation</li>
              <li>Interview preparation guides</li>
              <li>Job search strategies</li>
              <li>ATS score checking</li>
            </ul>
            <button className="primary-button">Subscribe</button>
          </div>

          <div className="plan-card">
            <h3>Content Creator</h3>
            <div className="plan-price">$24<span>/month</span></div>
            <ul className="plan-features">
              <li>Unlimited post optimizations</li>
              <li>Multi-platform support</li>
              <li>Hashtag recommendations</li>
              <li>Engagement analytics</li>
            </ul>
            <button className="primary-button">Subscribe</button>
          </div>

          <div className="plan-card featured">
            <div className="plan-badge-top">Best Value</div>
            <h3>RankKit Pro</h3>
            <div className="plan-price">$39<span>/month</span></div>
            <div className="plan-savings">Save $14/month</div>
            <ul className="plan-features">
              <li>All Career Starter features</li>
              <li>All Content Creator features</li>
              <li>Priority support</li>
              <li>Early access to new tools</li>
              <li>Unlimited everything</li>
            </ul>
            <button className="primary-button featured">Subscribe</button>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageStats() {
  const { currentUser } = useAuth();

  return (
    <div className="settings-section">
      <h2>Usage Statistics</h2>
      
      <div className="setting-card">
        <h3>This Month</h3>
        <div className="usage-stat">
          <div className="stat-label">Total Optimizations Used</div>
          <div className="stat-value">{currentUser?.usageCount || 0}</div>
        </div>
        <div className="usage-stat">
          <div className="stat-label">Free Optimizations Remaining</div>
          <div className="stat-value">
            {currentUser?.isPremium ? '∞' : (currentUser?.freeOptimizationsRemaining || 0)}
          </div>
          {!currentUser?.isPremium && (
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${((currentUser?.freeOptimizationsRemaining || 0) / 1) * 100}%`
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="setting-card">
        <h3>Activity</h3>
        <div className="stat-row">
          <span>Total Documents</span>
          <strong>12</strong>
        </div>
        <div className="stat-row">
          <span>Total Optimizations</span>
          <strong>45</strong>
        </div>
        <div className="stat-row">
          <span>Average Score</span>
          <strong>82/100</strong>
        </div>
        <div className="stat-row">
          <span>Member Since</span>
          <strong>{new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</strong>
        </div>
      </div>
    </div>
  );
}
