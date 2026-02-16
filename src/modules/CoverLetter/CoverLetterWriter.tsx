import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle2, Copy, Download, Save } from 'lucide-react';
import { generateCoverLetter } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization, getUserDocuments } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { Document } from '../../types';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { MonoIcon } from '../../components/Shared/MonoIcon';
import './CoverLetterWriter.css';

export default function CoverLetterWriter() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [bio, setBio] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
      return;
    }
    
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

  async function handleGenerate() {
    if (!selectedDocId || !jobDescription) {
      setError('Please select a resume and provide a job description');
      return;
    }

    const selectedDoc = documents.find(d => d.id === selectedDocId);
    if (!selectedDoc) {
      setError('Selected document not found');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to generate a cover letter');
      return;
    }

    try {
      // Check if user can optimize
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to generate. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const result = await generateCoverLetter({
        resumeContent: selectedDoc.content,
        jobDescription: jobDescription,
        bio: bio || currentUser.bio || undefined,
        userId: currentUser.uid
      });

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      setCoverLetter(result.letter);
      setSuggestions(result.suggestions);
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    await saveDocument(coverLetter, 'cover-letter', 'Cover Letter');
  }

  function handleCopy() {
    navigator.clipboard.writeText(coverLetter);
  }

  function handleDownload() {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/career-tools')}>← Cover Letter Writer</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Generate a professional cover letter tailored to your resume and the job description. Optionally add a bio for more personalization.</p>
        </div>

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

            <h3>Job Description</h3>
            <textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />

            <h3>Your Bio (Optional)</h3>
            <textarea
              placeholder={currentUser?.bio || "Tell us about yourself, your passion, career goals, or any additional context..."}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedDocId || !jobDescription}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && (
              <div className="update-message success">
                <MonoIcon icon={CheckCircle2} size={16} className="mono-icon inline" />
                Saved to Documents!
              </div>
            )}
          </div>

          <div className="output-section">
            {coverLetter ? (
              <>
                <h3>Your Cover Letter</h3>
                <div className="optimized-output cover-letter-output">
                  {coverLetter}
                </div>

                {suggestions.length > 0 && (
                  <>
                    <h3>Tips & Suggestions</h3>
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="action-buttons">
                  <button className="secondary-button" onClick={handleSave} disabled={saving}>
                    <MonoIcon icon={Save} size={16} className="mono-icon inline" />
                    {saving ? 'Saving...' : 'Save to Documents'}
                  </button>
                  <button className="secondary-button" onClick={handleCopy}>
                    <MonoIcon icon={Copy} size={16} className="mono-icon inline" />
                    Copy to Clipboard
                  </button>
                  <button className="download-button" onClick={handleDownload}>
                    <MonoIcon icon={Download} size={16} className="mono-icon inline" />
                    Download as TXT
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Fill in your information and click "Generate Cover Letter" to create a personalized cover letter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Generating your cover letter..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Cover Letter Writer"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
