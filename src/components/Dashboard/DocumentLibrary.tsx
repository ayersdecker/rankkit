import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getUserDocuments,
  createDocument,
  deleteDocument,
  uploadDocumentFile
} from '../../services/firestore';
import { extractTextFromFile, validateFile, formatFileSize, getFileIcon, validateDocumentPages } from '../../utils/fileUtils';
import { Document } from '../../types';
import { hasPremiumAccess } from '../../utils/premiumUtils';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import './DocumentLibrary.css';

// Helper functions for document type display
const getDocTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'resume': 'Resume',
    'cover-letter': 'Cover Letter',
    'post': 'Social Post',
    'cold-email': 'Cold Email',
    'sales-script': 'Sales Script',
    'interview-prep': 'Interview Prep',
    'job-search': 'Job Search',
    'hashtags': 'Hashtags',
    'other': 'Other'
  };
  return labels[type] || type;
};

const getDocTypeEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    'resume': '📝',
    'cover-letter': '✉️',
    'post': '📱',
    'cold-email': '📧',
    'sales-script': '📞',
    'interview-prep': '💼',
    'job-search': '🔍',
    'hashtags': '#️⃣',
    'other': '📄'
  };
  return emojis[type] || '📄';
};

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'career' | 'workplace' | 'social' | 'other'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
    setShowSignOutModal(false);
  }

  const loadDocuments = useCallback(async () => {
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
  }, [currentUser]);

  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setUploadModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function handleDelete(docId: string) {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    if (!currentUser) return;
    
    try {
      await deleteDocument(currentUser.uid, docId);
      await loadDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  }

  const filteredDocs = documents.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'career') return ['resume', 'cover-letter', 'interview-prep', 'job-search'].includes(doc.type);
    if (filter === 'workplace') return ['cold-email', 'sales-script'].includes(doc.type);
    if (filter === 'social') return ['post', 'hashtags'].includes(doc.type);
    if (filter === 'other') return doc.type === 'other';
    return false;
  });

  // Calculate document type statistics
  const getDocTypeStats = () => {
    const stats = {
      'resume': 0,
      'cover-letter': 0,
      'post': 0,
      'cold-email': 0,
      'sales-script': 0,
      'interview-prep': 0,
      'job-search': 0,
      'hashtags': 0,
      'other': 0
    };
    documents.forEach(doc => {
      if (stats.hasOwnProperty(doc.type)) {
        stats[doc.type as keyof typeof stats]++;
      }
    });
    return stats;
  };

  const docTypeStats = getDocTypeStats();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/career-tools')} className="nav-link">Career</button>
          <button onClick={() => navigate('/workplace-tools')} className="nav-link">Workplace</button>
          <button onClick={() => navigate('/social-media-tools')} className="nav-link">Social</button>
          <button onClick={() => navigate('/documents')} className="nav-link active">Documents</button>
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

      <div className="dashboard-content">
        <div className="library-header">
          <h2>Document Library</h2>
          <button className="primary-button" onClick={() => setUploadModalOpen(true)}>
            📤 Upload Document
          </button>
        </div>

        <div className="storage-stats">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <div className="stat-value">{documents.length}</div>
              <div className="stat-label">Total Documents</div>
            </div>
          </div>
          <div className="stat-card breakdown-card">
            <div className="stat-info">
              <div className="stat-label">Document Types</div>
              <div className="doc-type-chart">
                {Object.entries(docTypeStats).map(([type, count]) => {
                  if (count === 0) return null;
                  const percentage = (count / documents.length) * 100;
                  return (
                    <div key={type} className="doc-type-row">
                      <div className="doc-type-info">
                        <span className="doc-type-emoji">{getDocTypeEmoji(type)}</span>
                        <span className="doc-type-name">{getDocTypeLabel(type)}</span>
                      </div>
                      <div className="doc-type-bar-container">
                        <div 
                          className="doc-type-bar" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="doc-type-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">{currentUser?.isPremium ? '⭐' : '📦'}</div>
            <div className="stat-info">
              <div className="stat-value">{currentUser?.isPremium ? 'Premium' : 'Free'}</div>
              <div className="stat-label">Account Type</div>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({documents.length})
          </button>
          <button
            className={`filter-button ${filter === 'career' ? 'active' : ''}`}
            onClick={() => setFilter('career')}
          >
            Career ({['resume', 'cover-letter', 'interview-prep', 'job-search'].reduce((acc, type) => acc + (docTypeStats[type as keyof typeof docTypeStats] || 0), 0)})
          </button>
          <button
            className={`filter-button ${filter === 'workplace' ? 'active' : ''}`}
            onClick={() => setFilter('workplace')}
          >
            Workplace ({['cold-email', 'sales-script'].reduce((acc, type) => acc + (docTypeStats[type as keyof typeof docTypeStats] || 0), 0)})
          </button>
          <button
            className={`filter-button ${filter === 'social' ? 'active' : ''}`}
            onClick={() => setFilter('social')}
          >
            Social ({['post', 'hashtags'].reduce((acc, type) => acc + (docTypeStats[type as keyof typeof docTypeStats] || 0), 0)})
          </button>
          <button
            className={`filter-button ${filter === 'other' ? 'active' : ''}`}
            onClick={() => setFilter('other')}
          >
            Other ({docTypeStats.other || 0})
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No documents yet</h3>
            <p>Upload your first document to get started</p>
            <button className="primary-button" onClick={() => setUploadModalOpen(true)}>
              Upload Document
            </button>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="doc-icon">{getDocTypeEmoji(doc.type)}</div>
                <h3>{doc.name}</h3>
                <div className="doc-meta">
                  <span className="doc-type">{getDocTypeLabel(doc.type)}</span>
                  {doc.aiGenerated && (
                    <span className="doc-badge">✨ AI Generated</span>
                  )}
                  <span className="doc-date">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="doc-preview">{doc.content.substring(0, 120)}...</p>
                <div className="doc-actions">
                  <button onClick={() => setSelectedDoc(doc)}>View</button>
                  <button onClick={() => handleDelete(doc.id)} className="danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onSuccess={() => {
            setUploadModalOpen(false);
            loadDocuments();
          }}
        />
      )}

      {selectedDoc && (
        <DocumentViewModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {showSignOutModal && (
        <SignOutConfirmation
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'resume' | 'cover-letter' | 'post' | 'cold-email' | 'sales-script' | 'interview-prep' | 'job-search' | 'hashtags' | 'other'>('resume');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'file' | 'paste'>('file');

  const { currentUser } = useAuth();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
    setError('');
    setExtracting(true);

    try {
      const text = await extractTextFromFile(selectedFile);
      setContent(text);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from file');
      setContent('');
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!content || content.trim().length === 0) {
      setError('Please provide document content');
      return;
    }

    if (!currentUser) return;

    try {
      setUploading(true);
      setError('');
      
      // Check document count limit
      const existingDocs = await getUserDocuments(currentUser.uid);
      const maxDocs = hasPremiumAccess(currentUser) ? 30 : 1;
      
      if (existingDocs.length >= maxDocs) {
        setError(`Document limit reached (${maxDocs} documents). ${!hasPremiumAccess(currentUser) ? 'Upgrade to Premium for up to 30 documents.' : ''}`);
        setUploading(false);
        return;
      }
      
      // Validate resume page count (only for resumes)
      if (type === 'resume') {
        const pageValidation = validateDocumentPages(content, 3);
        if (!pageValidation.valid) {
          setError(pageValidation.error!);
          setUploading(false);
          return;
        }
      }

      // Auto-generate name if not provided
      const documentName = name.trim() || generateDocumentName(type);
      
      // Upload file to storage if a file was selected
      let fileUrl: string | undefined;
      if (file) {
        try {
          fileUrl = await uploadDocumentFile(currentUser.uid, file);
          console.log('[Upload] File uploaded to storage:', fileUrl);
        } catch (uploadErr: any) {
          console.error('[Upload] File upload failed:', uploadErr);
          setError('Failed to upload file. Saving text content only.');
          // Continue with document creation even if file upload fails
        }
      }
      
      await createDocument(
        currentUser.uid,
        documentName,
        content,
        type,
        file?.name,
        file?.type,
        false, // aiGenerated
        fileUrl
      );
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  }

  function generateDocumentName(docType: string): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const typeNames: Record<string, string> = {
      'resume': 'Resume',
      'cover-letter': 'Cover Letter',
      'post': 'Social Post',
      'cold-email': 'Cold Email',
      'sales-script': 'Sales Script',
      'interview-prep': 'Interview Prep',
      'job-search': 'Job Search',
      'hashtags': 'Hashtags',
      'other': 'Document'
    };
    
    return `${typeNames[docType] || 'Document'} - ${dateStr} ${timeStr}`;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Document</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'file' ? 'active' : ''}`}
            onClick={() => setMode('file')}
          >
            Upload File
          </button>
          <button
            className={`mode-button ${mode === 'paste' ? 'active' : ''}`}
            onClick={() => setMode('paste')}
          >
            Paste Text
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'file' ? (
            <div className="form-group">
              <label>Choose File</label>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={extracting}
              />
              {extracting && (
                <div className="file-info extracting">
                  ⏳ Extracting text from file...
                </div>
              )}
              {file && !extracting && (
                <div className="file-info">
                  {getFileIcon(file.type)} {file.name} ({formatFileSize(file.size)})
                </div>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label>Paste Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your document content here..."
                rows={10}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Document Name <span className="optional-label">(Optional)</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Leave blank to auto-generate"
            />
          </div>

          <div className="form-group">
            <label>Document Type</label>
            <select value={type} onChange={e => setType(e.target.value as any)}>
              <optgroup label="Career Tools">
                <option value="resume">Resume</option>
                <option value="cover-letter">Cover Letter</option>
                <option value="interview-prep">Interview Prep</option>
                <option value="job-search">Job Search</option>
              </optgroup>
              <optgroup label="Workplace Tools">
                <option value="cold-email">Cold Email</option>
                <option value="sales-script">Sales Script</option>
              </optgroup>
              <optgroup label="Social Media Tools">
                <option value="post">Social Post</option>
                <option value="hashtags">Hashtags</option>
              </optgroup>
              <option value="other">Other</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={uploading || extracting}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={uploading || extracting || !content}>
              {uploading ? 'Uploading...' : extracting ? 'Extracting...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Document View Modal Component
function DocumentViewModal({
  document,
  onClose
}: {
  document: Document;
  onClose: () => void;
}) {
  const [viewMode, setViewMode] = useState<'original' | 'text'>(document.fileUrl ? 'original' : 'text');
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{document.name}</h2>
            <div className="doc-meta">
              <span className="doc-type">{getDocTypeLabel(document.type)}</span>
              <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
              {document.originalFileName && (
                <span>📎 {document.originalFileName}</span>
              )}
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {document.fileUrl && (
          <div className="view-mode-selector">
            <button
              className={`mode-button ${viewMode === 'original' ? 'active' : ''}`}
              onClick={() => setViewMode('original')}
            >
              📄 Original File
            </button>
            <button
              className={`mode-button ${viewMode === 'text' ? 'active' : ''}`}
              onClick={() => setViewMode('text')}
            >
              📝 Text Content
            </button>
          </div>
        )}

        <div className="document-content">
          {viewMode === 'original' && document.fileUrl ? (
            <div className="file-viewer">
              {document.fileType?.includes('pdf') ? (
                <iframe
                  src={document.fileUrl}
                  title={document.name}
                  className="pdf-viewer"
                />
              ) : (
                <div className="file-download">
                  <div className="file-icon-large">{getDocTypeEmoji(document.type)}</div>
                  <p>Cannot preview this file type in browser</p>
                  <a 
                    href={document.fileUrl} 
                    download={document.originalFileName || document.name}
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📥 Download {document.originalFileName || 'File'}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <pre>{document.content}</pre>
          )}
        </div>

        <div className="modal-actions">
          {document.fileUrl && (
            <a 
              href={document.fileUrl} 
              download={document.originalFileName || document.name}
              className="download-link-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download
            </a>
          )}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
