import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import './WorkplaceToolsDashboard.css';

export default function WorkplaceToolsDashboard() {
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
      id: 'cold-email',
      title: 'Cold Email Generator',
      icon: '📧',
      description: 'Create personalized cold outreach emails that get responses',
      path: '/cold-email',
      color: '#FF6B6B'
    },
    {
      id: 'sales-script',
      title: 'Sales Script Builder',
      icon: '📞',
      description: 'Generate effective sales scripts for calls, demos, and pitches',
      path: '/sales-script',
      color: '#4ECDC4'
    },
    {
      id: 'selling-points',
      title: 'Selling Points Finder',
      icon: '💡',
      description: 'Analyze products/services and extract key selling points from links',
      path: '/selling-points',
      color: '#95E1D3'
    },
    {
      id: 'objection-handler',
      title: 'Objection Handler',
      icon: '🛡️',
      description: 'Get responses to common sales objections and push-backs',
      path: '/objection-handler',
      color: '#F38181'
    },
    {
      id: 'pitch-perfect',
      title: 'Pitch Perfect',
      icon: '🎯',
      description: 'Create compelling elevator pitches and value propositions',
      path: '/pitch-perfect',
      color: '#AA96DA'
    },
    {
      id: 'meeting-prep',
      title: 'Meeting Prep Assistant',
      icon: '📋',
      description: 'Prepare for sales meetings with research and talking points',
      path: '/meeting-prep',
      color: '#FCBAD3'
    }
  ];

  return (
    <div className="workplace-tools-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => navigate('/workplace-tools')} className="nav-link active">Workplace</button>
          <button onClick={() => navigate('/social-media-tools')} className="nav-link">Social</button>
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

      <div className="workplace-tools-content">
        <div className="tools-header">
          <h2>Workplace Tools Dashboard</h2>
          <p>Your professional communication and sales persuasion toolkit</p>
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
            <h3>🚀 Pro Workflow</h3>
            <p>
              <strong>1.</strong> Use <strong>Selling Points Finder</strong> to analyze your product<br/>
              <strong>2.</strong> Create a <strong>Pitch Perfect</strong> elevator pitch<br/>
              <strong>3.</strong> Generate <strong>Cold Emails</strong> for outreach<br/>
              <strong>4.</strong> Build <strong>Sales Scripts</strong> for follow-ups<br/>
              <strong>5.</strong> Prepare responses with <strong>Objection Handler</strong>
            </p>
          </div>

          {!currentUser?.isPremium && (
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
