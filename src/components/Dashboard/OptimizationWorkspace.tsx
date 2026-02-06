import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getDocument,
  getUserDocuments,
  saveOptimizationVersion,
  getDocumentVersions,
  canUserOptimize,
  decrementFreeOptimization
} from '../../services/firestore';
import { optimizeContent } from '../../services/openai';
import { Document, OptimizationVersion, OptimizationType } from '../../types';
import { LoadingSpinner } from '../Shared/LoadingSpinner';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import './OptimizationWorkspace.css';

export default function OptimizationWorkspace() {
  // const { documentId } = useParams();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [versions, setVersions] = useState<OptimizationVersion[]>([]);
  const [optimizationType, setOptimizationType] = useState<OptimizationType>('ats');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVersions, setShowVersions] = useState(false);

  const { currentUser, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

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

  const loadDocuments = useCallback(async () => {
    if (!currentUser) return;
    try {
      const docs = await getUserDocuments(currentUser.uid);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setDocuments([]);
    }
  }, [currentUser]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Function for loading specific document - can be used with URL params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function loadDocument(id: string) {
    if (!currentUser) return;
    try {
      const doc = await getDocument(currentUser.uid, id);
      if (doc) {
        setSelectedDoc(doc);
        // Auto-set optimization type based on document type
        if (doc.type === 'resume') {
          setOptimizationType('ats');
        } else if (doc.type === 'post') {
          setOptimizationType('engagement');
        }
      }
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Failed to load document');
    }
  }

  async function loadVersions(id: string) {
    if (!currentUser) return;
    try {
      const vers = await getDocumentVersions(currentUser.uid, id);
      setVersions(vers);
    } catch (err) {
      console.error('Error loading versions:', err);
      setVersions([]);
    }
  }

  async function handleOptimize() {
    if (!selectedDoc || !currentUser) return;

    // Check if user can optimize
    const eligibility = await canUserOptimize(currentUser.uid);
    if (!eligibility.canOptimize) {
      setError(eligibility.reason || 'Unable to optimize. Please subscribe to continue.');
      return;
    }

    // Validate context requirements
    if (optimizationType === 'ats' && !context) {
      setError('Please paste the job posting for ATS optimization');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const optimizationResult = await optimizeContent({
        type: selectedDoc.type === 'resume' ? 'resume' : 'post',
        content: selectedDoc.content,
        context: context || optimizationType
      });

      setResult(optimizationResult);

      // Save version to Firestore
      await saveOptimizationVersion(
        selectedDoc.id,
        currentUser.uid,
        optimizationType,
        optimizationResult.optimized,
        optimizationResult.score,
        optimizationResult.suggestions,
        optimizationResult.metadata
      );

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      // Reload versions
      await loadVersions(selectedDoc.id);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize document');
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (!result) return;
    
    const blob = new Blob([result.optimized], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc?.name || 'document'}_optimized.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.optimized);
    alert('Copied to clipboard!');
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => handleNavClick('/dashboard')}>RankKit</h1>
        <div id="mobile-navigation" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
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
          <button onClick={() => handleNavClick('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => handleNavClick('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => handleNavClick('/workplace-tools')} className="nav-link">Workplace</button>
          <button onClick={() => handleNavClick('/social-media-tools')} className="nav-link">Social</button>
          <button onClick={() => handleNavClick('/documents')} className="nav-link active">Documents</button>
          <button onClick={() => setShowSignOutModal(true)} className="nav-link signout-link">Sign Out</button>
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
            </button>
            <span>{currentUser?.displayName || currentUser?.email}</span>
          </div>
        </div>
      </nav>

      <div className="workspace-container">
        <div className="workspace-sidebar">
          <h3>Select Document</h3>
          <div className="doc-selector">
            {documents.length === 0 ? (
              <div className="empty-docs">
                <p>No documents yet</p>
                <button onClick={() => navigate('/documents?action=upload')}>
                  Upload One
                </button>
              </div>
            ) : (
              documents.map(doc => (
                <div
                  key={doc.id}
                  className={`doc-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
                  onClick={() => {
                    navigate(`/optimize/${doc.id}`);
                  }}
                >
                  <div className="doc-item-icon">📄</div>
                  <div className="doc-item-info">
                    <div className="doc-item-name">{doc.name}</div>
                    <div className="doc-item-type">{doc.type}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedDoc && versions.length > 0 && (
            <>
              <div className="sidebar-divider" />
              <h3>Optimization History</h3>
              <button
                className="toggle-versions"
                onClick={() => setShowVersions(!showVersions)}
              >
                {showVersions ? 'Hide' : 'Show'} Versions ({versions.length})
              </button>
              {showVersions && (
                <div className="versions-list">
                  {versions.map(v => (
                    <div key={v.id} className="version-item">
                      <div className="version-type">{v.optimizationType}</div>
                      <div className="version-score">Score: {v.score}</div>
                      <div className="version-date">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="workspace-main">
          {!selectedDoc ? (
            <div className="workspace-empty">
              <h2>Select a document to optimize</h2>
              <p>Choose from your library or upload a new document</p>
            </div>
          ) : (
            <>
              <div className="workspace-header">
                <h2>{selectedDoc.name}</h2>
                <span className="doc-type-badge">{selectedDoc.type}</span>
              </div>

              <div className="optimization-controls">
                <div className="control-group">
                  <label>Optimization Type</label>
                  <select
                    value={optimizationType}
                    onChange={e => setOptimizationType(e.target.value as OptimizationType)}
                  >
                    {selectedDoc.type === 'resume' ? (
                      <>
                        <option value="ats">ATS Match (Resume → Job Posting)</option>
                        <option value="readability">Readability & Clarity</option>
                      </>
                    ) : (
                      <>
                        <option value="engagement">Engagement (Social SEO)</option>
                        <option value="seo">General SEO</option>
                        <option value="readability">Readability & Clarity</option>
                      </>
                    )}
                  </select>
                </div>

                {optimizationType === 'ats' && (
                  <div className="control-group full-width">
                    <label>Job Posting (paste full job description)</label>
                    <textarea
                      value={context}
                      onChange={e => setContext(e.target.value)}
                      placeholder="Paste the full job posting here..."
                      rows={6}
                    />
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <button
                  className="optimize-button"
                  onClick={handleOptimize}
                  disabled={loading || (optimizationType === 'ats' && !context)}
                >
                  {loading ? 'Optimizing...' : '⚡ Optimize Document'}
                </button>
              </div>

              <div className="workspace-panels">
                <div className="panel">
                  <h3>Original</h3>
                  <div className="content-box">
                    <pre>{selectedDoc.content}</pre>
                  </div>
                </div>

                <div className="panel">
                  <h3>Optimized</h3>
                  {result ? (
                    <>
                      <div className="result-header">
                        <div className="score-badge">
                          Score: {result.score}/100
                        </div>
                        <div className="result-actions">
                          <button onClick={handleCopy}>📋 Copy</button>
                          <button onClick={handleExport}>💾 Export</button>
                        </div>
                      </div>
                      <div className="content-box">
                        <pre>{result.optimized}</pre>
                      </div>
                      <div className="suggestions-section">
                        <h4>Key Improvements</h4>
                        <ul>
                          {result.suggestions.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      {result.metadata?.hashtags && (
                        <div className="hashtags-section">
                          <h4>Recommended Hashtags</h4>
                          <div className="hashtags">
                            {result.metadata.hashtags.map((tag: string, i: number) => (
                              <span key={i} className="hashtag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.metadata?.missing_keywords && (
                        <div className="keywords-section">
                          <h4>Missing Keywords</h4>
                          <div className="keywords">
                            {result.metadata.missing_keywords.map((kw: string, i: number) => (
                              <span key={i} className="keyword">{kw}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="content-box empty">
                      <p>Click "Optimize Document" to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Optimizing your document..." />}

      {showSignOutModal && (
        <SignOutConfirmation
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
}
