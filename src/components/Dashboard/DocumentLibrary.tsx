import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getUserDocuments,
  createDocument,
  deleteDocument,
  uploadDocumentFile,
  getAuthenticatedFileBlob
} from '../../services/firestore';
import { extractTextFromFile, validateFile, formatFileSize, getFileIcon, validateDocumentPages } from '../../utils/fileUtils';
import { exportAsPDF, exportAsWord, formatExportFileName, isExportable } from '../../utils/documentExport';
import { Document } from '../../types';
import { hasPremiumAccess } from '../../utils/premiumUtils';
import { DeleteDocumentConfirmation } from '../Shared/DeleteDocumentConfirmation';
import { SignOutConfirmation } from '../Shared/SignOutConfirmation';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Clipboard,
  Download,
  File,
  FileText,
  Hash,
  Lightbulb,
  Mail,
  Menu,
  Package,
  Paperclip,
  Phone,
  Search,
  Shield,
  Sparkles,
  Star,
  Smartphone,
  Target,
  Upload
} from 'lucide-react';
import { MonoIcon } from '../Shared/MonoIcon';
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
    'selling-points': 'Selling Points',
    'objection-handler': 'Objection Handler',
    'pitch-perfect': 'Pitch Perfect',
    'other': 'Other'
  };
  return labels[type] || type;
};

const getDocTypeIcon = (type: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    'resume': FileText,
    'cover-letter': Mail,
    'post': Smartphone,
    'cold-email': Mail,
    'sales-script': Phone,
    'interview-prep': FileText,
    'job-search': Search,
    'hashtags': Hash,
    'selling-points': Lightbulb,
    'objection-handler': Shield,
    'pitch-perfect': Target,
    'other': File
  };
  return icons[type] || File;
};

const getPreviewText = (content: string) => {
  return content
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'career' | 'workplace' | 'social' | 'other'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [pendingDeleteDoc, setPendingDeleteDoc] = useState<Document | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  function handleDeleteRequest(doc: Document) {
    setDeleteError('');
    setPendingDeleteDoc(doc);
  }

  async function handleConfirmDelete() {
    if (!currentUser || !pendingDeleteDoc) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteDocument(currentUser.uid, pendingDeleteDoc.id);
      await loadDocuments();
      setPendingDeleteDoc(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setDeleteError('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredDocs = documents.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'career') return ['resume', 'cover-letter', 'interview-prep', 'job-search'].includes(doc.type);
    if (filter === 'workplace') return ['cold-email', 'sales-script', 'selling-points', 'objection-handler', 'pitch-perfect'].includes(doc.type);
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
      'selling-points': 0,
      'objection-handler': 0,
      'pitch-perfect': 0,
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
    <div className="dashboard-container documents-page">
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
            <MonoIcon icon={Menu} size={18} className="mono-icon" />
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
              <span className="profile-button-text">{currentUser?.displayName || currentUser?.email}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="library-header">
          <h2>Document Library</h2>
          <button className="primary-button" onClick={() => setUploadModalOpen(true)}>
            <MonoIcon icon={Upload} size={16} className="mono-icon inline" />
            Upload Document
          </button>
        </div>

        <div className="storage-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <MonoIcon icon={FileText} size={20} className="mono-icon" />
            </div>
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
                        <span className="doc-type-emoji">
                          <MonoIcon icon={getDocTypeIcon(type)} size={16} className="mono-icon" />
                        </span>
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
            <div className="stat-icon">
              <MonoIcon icon={currentUser?.isPremium ? Star : Package} size={20} className="mono-icon" />
            </div>
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
            Workplace ({['cold-email', 'sales-script', 'selling-points', 'objection-handler', 'pitch-perfect'].reduce((acc, type) => acc + (docTypeStats[type as keyof typeof docTypeStats] || 0), 0)})
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
            <div className="empty-icon">
              <MonoIcon icon={File} size={28} className="mono-icon" />
            </div>
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
                {(() => {
                  const previewText = getPreviewText(doc.content);
                  const previewLimit = 120;
                  const preview = previewText.length > previewLimit
                    ? `${previewText.slice(0, previewLimit)}...`
                    : previewText || 'No preview available yet.';
                  return (
                    <>
                <div className="doc-icon">
                  <MonoIcon icon={getDocTypeIcon(doc.type)} size={20} className="mono-icon" />
                </div>
                <h3>{doc.name}</h3>
                <div className="doc-meta">
                  <span className="doc-type">{getDocTypeLabel(doc.type)}</span>
                  {doc.aiGenerated && (
                    <span className="doc-badge">
                      <MonoIcon icon={Sparkles} size={14} className="mono-icon inline" />
                      AI Generated
                    </span>
                  )}
                  <span className="doc-date">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="doc-preview">{preview}</p>
                <div className="doc-actions">
                  <button onClick={() => setSelectedDoc(doc)}>View</button>
                  <button onClick={() => handleDeleteRequest(doc)} className="danger">Delete</button>
                </div>
                    </>
                  );
                })()}
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

      {pendingDeleteDoc && (
        <DeleteDocumentConfirmation
          documentName={pendingDeleteDoc.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) {
              setPendingDeleteDoc(null);
              setDeleteError('');
            }
          }}
          isDeleting={isDeleting}
          errorMessage={deleteError}
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
      'selling-points': 'Selling Points',
      'objection-handler': 'Objection Handler',
      'pitch-perfect': 'Pitch Perfect',
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
                  <MonoIcon icon={Clipboard} size={16} className="mono-icon inline" />
                  Extracting text from file...
                </div>
              )}
              {file && !extracting && (
                <div className="file-info">
                  <MonoIcon icon={getFileIcon(file.type)} size={16} className="mono-icon inline" />
                  {file.name} ({formatFileSize(file.size)})
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
                <option value="selling-points">Selling Points</option>
                <option value="objection-handler">Objection Handler</option>
                <option value="pitch-perfect">Pitch Perfect</option>
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

// Helper function to parse and format markdown-style content
function formatDocumentContent(content: string) {
  const lines = content.split('\n');
  const formattedLines: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Empty line
    if (!trimmed) {
      formattedLines.push(<div key={index} className="content-spacer" />);
      return;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      
      switch (level) {
        case 1:
          formattedLines.push(<h1 key={index} className="content-heading">{text}</h1>);
          break;
        case 2:
          formattedLines.push(<h2 key={index} className="content-heading">{text}</h2>);
          break;
        case 3:
          formattedLines.push(<h3 key={index} className="content-heading">{text}</h3>);
          break;
        case 4:
          formattedLines.push(<h4 key={index} className="content-heading">{text}</h4>);
          break;
        case 5:
          formattedLines.push(<h5 key={index} className="content-heading">{text}</h5>);
          break;
        default:
          formattedLines.push(<h6 key={index} className="content-heading">{text}</h6>);
      }
      return;
    }

    // Bullet points (-, *, •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      const text = bulletMatch[1];
      formattedLines.push(
        <div key={index} className="content-bullet">
          <span className="bullet-point">•</span>
          <span className="bullet-text">{processBoldItalic(text)}</span>
        </div>
      );
      return;
    }

    // Regular text with possible bold/italic
    formattedLines.push(
      <p key={index} className="content-paragraph">
        {processBoldItalic(trimmed)}
      </p>
    );
  });

  return formattedLines;
}

// Helper to process bold and italic markdown
function processBoldItalic(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Bold with ** or __
    const boldMatch = remaining.match(/^(.*?)(\*\*|__)(.+?)(\*\*|__)/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(<span key={`text-${key++}`}>{boldMatch[1]}</span>);
      parts.push(<strong key={`bold-${key++}`}>{boldMatch[3]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic with single * or _
    const italicMatch = remaining.match(/^(.*?)([*_])(.+?)\2/);
    if (italicMatch) {
      if (italicMatch[1]) parts.push(<span key={`text-${key++}`}>{italicMatch[1]}</span>);
      parts.push(<em key={`italic-${key++}`}>{italicMatch[3]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // No more matches, add remaining text
    parts.push(<span key={`text-${key++}`}>{remaining}</span>);
    break;
  }

  return parts.length > 0 ? parts : text;
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
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState('');

  // Load authenticated blob URL when viewing original file
  useEffect(() => {
    let objectUrl: string | null = null;
    
    async function loadFile() {
      if (document.fileUrl && viewMode === 'original') {
        try {
          setLoadingFile(true);
          setFileError('');
          const url = await getAuthenticatedFileBlob(document.fileUrl);
          objectUrl = url;
          setBlobUrl(url);
        } catch (error) {
          console.error('Failed to load file:', error);
          setFileError('Failed to load file. Please try again or view text content instead.');
        } finally {
          setLoadingFile(false);
        }
      }
    }

    loadFile();

    // Cleanup: revoke object URL when component unmounts or file changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [document.fileUrl, viewMode]);

  const handleExportPDF = async () => {
    if (!isExportable(document.content)) {
      setExportError('Document content is empty or invalid');
      return;
    }

    try {
      setExporting(true);
      setExportError('');
      const fileName = formatExportFileName(document.name);
      await exportAsPDF(document.content, fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      setExportError('Failed to export as PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleExportWord = async () => {
    if (!isExportable(document.content)) {
      setExportError('Document content is empty or invalid');
      return;
    }

    try {
      setExporting(true);
      setExportError('');
      const fileName = formatExportFileName(document.name);
      await exportAsWord(document.content, fileName);
    } catch (error) {
      console.error('Word export failed:', error);
      setExportError('Failed to export as Word');
    } finally {
      setExporting(false);
    }
  };
  
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
                <span>
                  <MonoIcon icon={Paperclip} size={14} className="mono-icon inline" />
                  {document.originalFileName}
                </span>
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
              <MonoIcon icon={File} size={16} className="mono-icon inline" />
              Original File
            </button>
            <button
              className={`mode-button ${viewMode === 'text' ? 'active' : ''}`}
              onClick={() => setViewMode('text')}
            >
              <MonoIcon icon={FileText} size={16} className="mono-icon inline" />
              Text Content
            </button>
          </div>
        )}

        <div className="document-content">
          {viewMode === 'original' && document.fileUrl ? (
            <div className="file-viewer">
              {loadingFile ? (
                <div className="file-loading">
                  <div className="spinner"></div>
                  <p>Loading file...</p>
                </div>
              ) : fileError ? (
                <div className="file-error">
                  <p>
                    <MonoIcon icon={AlertTriangle} size={16} className="mono-icon inline" />
                    {fileError}
                  </p>
                  <button 
                    onClick={() => setViewMode('text')}
                    className="switch-view-button"
                  >
                    View Text Content
                  </button>
                </div>
              ) : document.fileType?.includes('pdf') && blobUrl ? (
                <iframe
                  src={blobUrl}
                  title={document.name}
                  className="pdf-viewer"
                />
              ) : (
                <div className="file-download">
                  <div className="file-icon-large">
                    <MonoIcon icon={getDocTypeIcon(document.type)} size={32} className="mono-icon" />
                  </div>
                  <p>Cannot preview this file type in browser</p>
                  {blobUrl && (
                    <a 
                      href={blobUrl} 
                      download={document.originalFileName || document.name}
                      className="download-button"
                    >
                      <MonoIcon icon={Download} size={16} className="mono-icon inline" />
                      Download {document.originalFileName || 'File'}
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="formatted-content">
              {formatDocumentContent(document.content)}
            </div>
          )}
        </div>

        {exportError && (
          <div className="export-error">
            {exportError}
          </div>
        )}

        <div className="modal-actions">
          <div className="export-actions">
            <button 
              onClick={handleExportPDF}
              disabled={exporting}
              className="export-button pdf"
              title="Export as PDF"
            >
              <MonoIcon icon={File} size={16} className="mono-icon inline" />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button 
              onClick={handleExportWord}
              disabled={exporting}
              className="export-button word"
              title="Export as Word Document"
            >
              <MonoIcon icon={FileText} size={16} className="mono-icon inline" />
              {exporting ? 'Exporting...' : 'Export Word'}
            </button>
          </div>
          <div className="action-buttons">
            {document.fileUrl && blobUrl && (
              <a 
                href={blobUrl} 
                download={document.originalFileName || document.name}
                className="download-link-button"
              >
                <MonoIcon icon={Download} size={16} className="mono-icon inline" />
                Download Original
              </a>
            )}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
