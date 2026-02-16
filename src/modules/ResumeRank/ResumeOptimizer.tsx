import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { optimizeContent } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization, getUserDocuments } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { Document } from '../../types';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { useSaveDocument } from '../../utils/useSaveDocument';
import './ResumeOptimizer.css';

export default function ResumeOptimizer() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    async function loadDocuments() {
      if (currentUser) {
        try {
          const docs = await getUserDocuments(currentUser.uid, 'resume');
          setDocuments(docs);
        } catch (err) {
          console.error('Failed to load documents:', err);
        }
      }
    }
    loadDocuments();
  }, [currentUser]);

  async function handleOptimize() {
    if (!selectedDocId) {
      setError('Please select a resume');
      return;
    }

    const selectedDoc = documents.find(d => d.id === selectedDocId);
    if (!selectedDoc) {
      setError('Selected document not found');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to optimize');
      return;
    }

    try {
      // Check if user can optimize
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to optimize. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const result = await optimizeContent({
        type: 'resume',
        content: selectedDoc.content,
        context: jobPosting || 'General resume optimization without specific job posting',
        userSocialLinks: {
          linkedinUrl: currentUser.linkedinUrl,
          githubUrl: currentUser.githubUrl,
          websiteUrl: currentUser.websiteUrl,
          portfolioUrl: currentUser.portfolioUrl,
          twitterUrl: currentUser.twitterUrl
        }
      }, currentUser.uid);

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      setOptimizedResume(result.optimized);
      setMatchScore(result.score);
      setSuggestions(result.suggestions);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize resume');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveToDocuments() {
    if (!optimizedResume || !currentUser) {
      setError(!currentUser ? 'You must be logged in to save.' : 'No optimized resume to save.');
      return;
    }
    
    const originalDoc = documents.find(d => d.id === selectedDocId);
    const docName = `${originalDoc?.name || 'Resume'} (Optimized)`;
    
    await saveDocument(optimizedResume, 'resume', docName);
  }

  function handlePrint() {
    if (!optimizedResume) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Optimized Resume</title>
          <style>
            body {
              font-family: 'Calibri', 'Arial', sans-serif;
              line-height: 1.6;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
              color: #1a1a1a;
              font-size: 11pt;
            }
            h1 {
              font-size: 22pt;
              margin-bottom: 4pt;
              border-bottom: 2pt solid #2c5282;
              padding-bottom: 6pt;
              color: #1a1a1a;
              font-weight: 700;
            }
            h2 {
              font-size: 13pt;
              margin-top: 18pt;
              margin-bottom: 8pt;
              color: #2c5282;
              text-transform: uppercase;
              border-bottom: 1pt solid #cbd5e0;
              padding-bottom: 3pt;
              font-weight: 600;
            }
            h3 {
              font-size: 11pt;
              margin-top: 12pt;
              margin-bottom: 3pt;
              font-weight: bold;
              color: #2d3748;
            }
            p, li {
              margin: 4pt 0;
              line-height: 1.5;
            }
            ul {
              margin: 6pt 0;
              padding-left: 20pt;
            }
            em {
              font-style: italic;
              color: #4a5568;
            }
            strong {
              font-weight: 600;
            }
            @media print {
              body { margin: 0; padding: 0.4in; }
            }
          </style>
        </head>
        <body>
          ${optimizedResume.split('\n').map(line => {
            if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
            if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
            if (line.startsWith('### ')) return `<h3>${line.substring(4).replace('|', ' | ')}</h3>`;
            if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
              return `<p><em>${line.substring(1, line.length - 1)}</em></p>`;
            }
            if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
            if (line.startsWith('**') && line.includes(':**')) {
              const parts = line.split(':**');
              return `<p><strong>${parts[0].substring(2)}</strong>${parts[1]}</p>`;
            }
            if (line.trim() === '') return '<br>';
            return `<p>${line}</p>`;
          }).join('')}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/career-tools')}>← ResumeRank</h1>
      </nav>

      <div className="optimizer-content">
        <div className="optimizer-grid">
          <div className="input-section">
            <h3>Select Resume</h3>
            {documents.length === 0 ? (
              <div className="no-documents">
                <p>No resumes found. <button onClick={() => navigate('/documents?action=upload')} className="link-button">Upload a resume</button> first.</p>
              </div>
            ) : (
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="document-selector"
              >
                <option value="">Choose a resume...</option>
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {new Date(doc.updatedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            )}

            <h3>Job Posting (Optional)</h3>
            <textarea
              placeholder="Paste a job posting here to optimize your resume for a specific role, or leave blank for general optimization..."
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
              rows={12}
            />

            <button
              onClick={handleOptimize}
              disabled={loading || !selectedDocId}
              className="optimize-button"
            >
              {loading ? 'Optimizing...' : 'Optimize Resume'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="update-message success">✓ Saved to Documents!</div>}

            {optimizedResume && (
              <>
                <h3>Key Improvements</h3>
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </>
            )}

          </div>

          <div className="output-section">
            {optimizedResume ? (
              <>
                <div className="score-card">
                  <h3>ATS Match Score</h3>
                  <div className="score-circle">
                    <span className="score-number">{matchScore}</span>
                    <span className="score-label">/100</span>
                  </div>
                </div>

                <h3>Optimized Resume</h3>
                <div className="optimized-output" dangerouslySetInnerHTML={{
                  __html: optimizedResume.split('\n').map(line => {
                    // Convert markdown to HTML for clean display
                    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3>${line.substring(4).replace('|', ' | ')}</h3>`;
                    if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
                      return `<p style="font-style: italic; color: #4a5568;">${line.substring(1, line.length - 1)}</p>`;
                    }
                    if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
                    if (line.startsWith('**') && line.includes(':**')) {
                      const parts = line.split(':**');
                      return `<p><strong>${parts[0].substring(2)}</strong>${parts[1]}</p>`;
                    }
                    if (line.trim() === '') return '<br>';
                    return `<p>${line}</p>`;
                  }).join('')
                }}></div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <button className="download-button" onClick={handleSaveToDocuments} disabled={saving}>
                    {saving ? '💾 Saving...' : '💾 Save to Documents'}
                  </button>
                  <button className="download-button" onClick={handlePrint}>
                    🖨️ Print / Save as PDF
                  </button>
                </div>

              </>
            ) : (
              <div className="empty-state">
                <p>Paste your resume and job posting, then click "Optimize Resume" to see your optimized version here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Working on your request..." />}
    </div>
  );
}
