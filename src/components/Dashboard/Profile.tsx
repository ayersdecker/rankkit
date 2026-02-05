import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import { getUserDocuments } from '../../services/firestore';
import { Document } from '../../types';
import './Profile.css';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account');
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
    setShowSignOutModal(false);
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

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="avatar-image" />
              ) : (
                currentUser?.displayName?.[0] || currentUser?.email?.[0].toUpperCase()
              )}
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

          <button className="signout-button" onClick={() => setShowSignOutModal(true)}>
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

      {showSignOutModal && (
        <SignOutConfirmation
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
}

function AccountSettings() {
  const { currentUser, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Sync local state with currentUser when it changes
  useEffect(() => {
    setDisplayName(currentUser?.displayName || '');
  }, [currentUser?.displayName]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      setUpdateMessage('Display name cannot be empty');
      return;
    }

    setIsUpdating(true);
    setUpdateMessage('');

    try {
      await updateProfile(displayName.trim());
      setUpdateMessage('✓ Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('✗ Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  }

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
          <input 
            type="text" 
            placeholder="Your name" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        {updateMessage && (
          <div className={`update-message ${updateMessage.includes('✓') ? 'success' : 'error'}`}>
            {updateMessage}
          </div>
        )}
        <button 
          className="primary-button" 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
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
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const docs = await getUserDocuments(currentUser.uid);
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, [currentUser]);

  // Calculate storage stats
  const calculateStorageBytes = () => {
    return documents.reduce((total, doc) => {
      // Calculate size based on content length (UTF-8 encoding, roughly 2 bytes per char)
      return total + (doc.content.length * 2);
    }, 0);
  };

  const formatStorageSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalStorageBytes = calculateStorageBytes();
  const storageLimit = currentUser?.isPremium ? 100 : 10; // MB
  const storageLimitText = currentUser?.isPremium ? '100 MB' : '10 MB';

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
        </div>
      </div>

      <div className="setting-card">
        <h3>Storage & Limits</h3>
        {loading ? (
          <div className="stat-row">
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <div className="stat-row">
              <span>Total Documents</span>
              <strong>{documents.length}</strong>
            </div>
            <div className="stat-row">
              <span>Storage Used</span>
              <strong>{formatStorageSize(totalStorageBytes)} / {storageLimitText}</strong>
            </div>
            <div className="stat-row">
              <span>Account Type</span>
              <strong>{currentUser?.isPremium ? 'Premium' : 'Free'}</strong>
            </div>
          </>
        )}
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
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');

  const plans = [
    {
      id: 'career',
      name: 'Career Tools',
      price: 7.99,
      features: [
        'Unlimited resume optimizations',
        'Unlimited cover letter generation',
        'Interview preparation guides',
        'Job search strategies',
        'ATS score checking',
        'Up to 30 saved documents',
      ],
      category: 'career',
    },
    {
      id: 'work',
      name: 'Workplace Tools',
      price: 12.99,
      features: [
        'Cold email generator',
        'Sales script builder',
        'Selling points finder',
        'Professional writing tools',
        'Up to 30 saved documents',
      ],
      category: 'work',
    },
    {
      id: 'social',
      name: 'Social Media Tools',
      price: 12.99,
      features: [
        'Unlimited post optimizations',
        'Multi-platform support',
        'Hashtag recommendations',
        'Engagement analytics',
        'Content scheduling insights',
        'Up to 30 saved documents',
      ],
      category: 'social',
    },
    {
      id: 'pro-bundle',
      name: 'Pro Bundle',
      price: 19.99,
      savings: 'Save $5.99/month',
      features: [
        '✨ All Workplace Tools',
        '✨ All Social Media Tools',
        'Priority support',
        'Advanced analytics',
        'Up to 30 saved documents',
      ],
      isPopular: true,
    },
    {
      id: 'ultimate-bundle',
      name: 'Ultimate Bundle',
      price: 24.99,
      savings: 'Save $8.98/month',
      features: [
        '🚀 All Career Tools',
        '🚀 All Workplace Tools', 
        '🚀 All Social Media Tools',
        'Priority support',
        'Early access to new tools',
        'Advanced analytics',
        'Unlimited everything',
        'Up to 30 saved documents',
      ],
      isBestValue: true,
    },
  ];

  return (
    <div className="settings-section">
      <h2>Billing & Plans</h2>
      
      <div className="setting-card beta-banner">
        <div className="beta-badge">🎉 Beta Launch Special</div>
        <h3>All Features Free During Beta!</h3>
        <p>
          Thank you for being an early user! While we're in beta, all premium features 
          are completely free. Choose your plan below to be ready when we officially launch.
        </p>
      </div>

      <div className="setting-card">
        <h3>Current Plan</h3>
        <div className="plan-current">
          <div className="plan-badge">
            {currentUser?.subscriptionPlan === 'ultimate-bundle' ? 'Ultimate Bundle' :
             currentUser?.subscriptionPlan === 'pro-bundle' ? 'Pro Bundle' :
             currentUser?.subscriptionPlan === 'career' ? 'Career Tools' :
             currentUser?.subscriptionPlan === 'work' ? 'Workplace Tools' :
             currentUser?.subscriptionPlan === 'social' ? 'Social Media Tools' :
             'Free (Beta Access)'}
          </div>
          <p>Full access to all features during beta period</p>
        </div>
      </div>

      <div className="plans-grid-profile">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card-profile ${
              plan.isBestValue ? 'best-value' : ''
            } ${plan.isPopular ? 'popular' : ''} ${
              selectedPlan === plan.id ? 'selected' : ''
            }`}
          >
            {plan.isBestValue && <div className="plan-badge-top">Best Value</div>}
            {plan.isPopular && !plan.isBestValue && <div className="plan-badge-top">Popular</div>}
            
            <h3>{plan.name}</h3>
            
            <div className="plan-price">
              ${plan.price}<span>/month</span>
            </div>
            
            {plan.savings && (
              <div className="plan-savings">{plan.savings}</div>
            )}
            
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            
            <button 
              className={`primary-button ${
                currentUser?.subscriptionPlan === plan.id ? 'active' : ''
              }`}
              disabled={currentUser?.subscriptionPlan === plan.id}
            >
              {currentUser?.subscriptionPlan === plan.id ? 'Current Plan' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>

      <div className="billing-faq">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-item">
          <h4>When will billing start?</h4>
          <p>Billing will begin after the beta period ends. We'll notify all users well in advance.</p>
        </div>
        <div className="faq-item">
          <h4>Can I change my plan later?</h4>
          <p>Yes! You can upgrade or downgrade your plan at any time.</p>
        </div>
        <div className="faq-item">
          <h4>What payment methods do you accept?</h4>
          <p>We accept all major credit cards through Stripe's secure payment processing.</p>
        </div>
      </div>
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
