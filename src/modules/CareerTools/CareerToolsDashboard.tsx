import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import './CareerToolsDashboard.css';

export default function CareerToolsDashboard() {
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
    }
  ];

  return (
    <div className="career-tools-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/career-tools')} className="nav-link active">Career</button>
          <button onClick={() => navigate('/workplace-tools')} className="nav-link">Workplace</button>
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

      <div className="career-tools-content">
        <div className="tools-header">
          <h2>Career Tools Dashboard</h2>
          <p>Everything you need to land your dream job</p>
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

          {!currentUser?.isPremium && (
            <div className="info-card upgrade-card">
              <h3>🚀 Upgrade to Premium</h3>
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
