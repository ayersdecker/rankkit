import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Link,
  Menu,
  Sparkles,
  Star,
  UserRound
} from 'lucide-react';
import { SignOutConfirmation } from '../../components/Shared/SignOutConfirmation';
import { MonoIcon } from '../../components/Shared/MonoIcon';
import { shouldShowCategoryUpgradeBanner } from '../../utils/subscriptionVisibility';
import './JobApplicationToolkit.css';

type QuickLink = {
  id: string;
  label: string;
  url: string;
  action: 'copy' | 'open';
};

type CopyBlock = {
  id: string;
  title: string;
  content: string;
};

export default function JobApplicationToolkit() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});
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

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  }

  function handleDownload(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function toggleBlock(id: string) {
    setExpandedBlocks((current) => ({
      ...current,
      [id]: !current[id]
    }));
  }

  const quickLinks: QuickLink[] = [
    { id: 'linkedin', label: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/', action: 'copy' },
    { id: 'github', label: 'GitHub Portfolio', url: 'https://github.com/', action: 'copy' },
    { id: 'portfolio', label: 'Personal Portfolio', url: 'https://example.com', action: 'copy' },
    { id: 'indeed', label: 'Indeed', url: 'https://www.indeed.com/', action: 'open' },
    { id: 'glassdoor', label: 'Glassdoor', url: 'https://www.glassdoor.com/', action: 'open' },
    { id: 'wellfound', label: 'Wellfound', url: 'https://wellfound.com/jobs', action: 'open' }
  ];

  const copyBlocks: CopyBlock[] = [
    {
      id: 'headline',
      title: 'LinkedIn Headline',
      content: 'Results-driven professional focused on building practical solutions, improving operations, and delivering measurable impact.'
    },
    {
      id: 'pitch',
      title: '30-Second Intro',
      content: 'I help teams execute quickly and effectively by turning complex goals into clear, high-impact deliverables. I bring strong communication, ownership, and a bias toward shipping value.'
    },
    {
      id: 'follow-up',
      title: 'Post-Application Follow-Up',
      content: 'Hi [Hiring Manager], I recently applied for the [Role] position and wanted to share my continued interest. I believe my experience in [skill area] aligns well with your team\'s needs. Happy to provide any additional details. Thank you for your time.'
    },
    {
      id: 'referral',
      title: 'Referral Ask',
      content: 'Hi [Name], I hope you\'re doing well. I\'m applying for [Role] at [Company], and I noticed you\'re on the team. If you\'re open to it, would you consider referring me? I can send my resume and a short fit summary. Thanks for considering it.'
    }
  ];

  const checklist = [
    'Tailor resume keywords to each job description',
    'Apply to 10-15 focused roles weekly',
    'Send follow-up messages within 3 business days'
  ];

  const exportedPacket = [
    'Job Application Starter Packet',
    '',
    ...copyBlocks.map((block) => `${block.title}:\n${block.content}\n`),
    'Weekly Checklist:',
    ...checklist.map((item, index) => `${index + 1}. ${item}`)
  ].join('\n');

  return (
    <div className="career-tools-container job-app-toolkit-container">
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

      <div className="career-tools-content job-app-toolkit-content">
        <div className="tools-header job-toolkit-header">
          <h2>Job Application Toolkit</h2>
          <p>Quick links, copy-ready content, and a practical game plan for your next application cycle.</p>
        </div>

        <div className="tools-info job-toolkit-grid">
          <section className="info-card toolkit-card">
            <h3>
              <MonoIcon icon={Link} size={18} className="mono-icon inline" />
              Quick Links
            </h3>
            <div className="quick-links-grid">
              {quickLinks.map((item) => (
                <div key={item.id} className="quick-link-card">
                  <span className="quick-link-label">{item.label}</span>
                  <div className="quick-link-actions">
                    {item.action === 'copy' ? (
                      <button onClick={() => handleCopy(item.url, `link-${item.id}`)}>
                        <MonoIcon icon={copiedId === `link-${item.id}` ? Check : Copy} size={14} className="mono-icon inline" />
                        {copiedId === `link-${item.id}` ? 'Copied' : 'Copy'}
                      </button>
                    ) : (
                      <a href={item.url} target="_blank" rel="noreferrer" className="quick-link-open">Open →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="info-card toolkit-card">
            <h3>
              <MonoIcon icon={Copy} size={18} className="mono-icon inline" />
              Copy + Download Blocks
            </h3>
            <div className="copy-block-list">
              {copyBlocks.map((block) => (
                <article key={block.id} className="copy-block-item">
                  <button className="block-toggle" onClick={() => toggleBlock(block.id)}>
                    <h4>{block.title}</h4>
                    <MonoIcon icon={expandedBlocks[block.id] ? ChevronUp : ChevronDown} size={16} className="mono-icon inline" />
                  </button>
                  {expandedBlocks[block.id] && (
                    <>
                      <p>{block.content}</p>
                      <div className="copy-block-actions">
                        <button onClick={() => handleCopy(block.content, block.id)}>
                          <MonoIcon icon={copiedId === block.id ? Check : Copy} size={16} className="mono-icon inline" />
                          {copiedId === block.id ? 'Copied' : 'Copy'}
                        </button>
                        <button className="ghost" onClick={() => handleDownload(`${block.id}.txt`, block.content)}>
                          <MonoIcon icon={Download} size={16} className="mono-icon inline" />
                          Download
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
            <div className="packet-actions">
              <button onClick={() => handleCopy(exportedPacket, 'all-packet')}>
                <MonoIcon icon={copiedId === 'all-packet' ? Check : Copy} size={16} className="mono-icon inline" />
                {copiedId === 'all-packet' ? 'Copied Starter Packet' : 'Copy Starter Packet'}
              </button>
              <button className="ghost" onClick={() => handleDownload('job-application-starter-packet.txt', exportedPacket)}>
                <MonoIcon icon={Download} size={16} className="mono-icon inline" />
                Download Starter Packet
              </button>
            </div>
          </section>

          <section className="info-card toolkit-card">
            <h3>
              <MonoIcon icon={Sparkles} size={18} className="mono-icon inline" />
              Brainstormed Plan
            </h3>
            <div className="plan-box">
              <h4>
                <MonoIcon icon={Briefcase} size={16} className="mono-icon inline" />
                Weekly Application Sprint
              </h4>
              <ul>
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="plan-box">
              <h4>
                <MonoIcon icon={UserRound} size={16} className="mono-icon inline" />
                Networking Focus
              </h4>
              <p>
                Reach out to 2-3 relevant professionals weekly and track replies.
              </p>
            </div>
          </section>
        </div>

        {shouldShowCategoryUpgradeBanner(currentUser, 'career') && (
          <div className="info-card upgrade-card toolkit-upgrade-card">
            <h3>
              <MonoIcon icon={Star} size={18} className="mono-icon inline" />
              Unlock Full Workflow
            </h3>
            <p>Get unlimited optimization runs across Resume, Cover Letter, and Interview tools.</p>
            <button className="upgrade-button" onClick={() => navigate('/profile?tab=billing')}>
              View Plans
            </button>
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