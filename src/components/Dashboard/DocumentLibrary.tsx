import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getUserDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';
import { extractTextFromFile, validateFile, formatFileSize, getFileIcon } from '../../utils/fileUtils';
import { Document } from '../../types';
import './DocumentLibrary.css';

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'resume' | 'post'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setUploadModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadDocuments();
  }, [currentUser]);

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

  async function handleDelete(docId: string) {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await deleteDocument(docId);
      await loadDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  }

  const filteredDocs = documents.filter(doc => 
    filter === 'all' || doc.type === filter
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 onClick={() => navigate('/dashboard')}>RankKit</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Home</button>
          <button onClick={() => navigate('/documents')} className="nav-link active">Documents</button>
          <button onClick={() => navigate('/optimize')} className="nav-link">Optimize</button>
          <button onClick={() => navigate('/profile')} className="nav-link">Profile</button>
        </div>
        <div className="nav-right">
          <span>{currentUser?.email}</span>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="library-header">
          <h2>Document Library</h2>
          <button className="primary-button" onClick={() => setUploadModalOpen(true)}>
            📤 Upload Document
          </button>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({documents.length})
          </button>
          <button
            className={`filter-button ${filter === 'resume' ? 'active' : ''}`}
            onClick={() => setFilter('resume')}
          >
            Resumes ({documents.filter(d => d.type === 'resume').length})
          </button>
          <button
            className={`filter-button ${filter === 'post' ? 'active' : ''}`}
            onClick={() => setFilter('post')}
          >
            Posts ({documents.filter(d => d.type === 'post').length})
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
                <div className="doc-icon">{getFileIcon(doc.fileType || '')}</div>
                <h3>{doc.name}</h3>
                <div className="doc-meta">
                  <span className="doc-type">{doc.type}</span>
                  <span className="doc-date">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="doc-preview">{doc.content.substring(0, 120)}...</p>
                <div className="doc-actions">
                  <button onClick={() => setSelectedDoc(doc)}>View</button>
                  <button onClick={() => navigate(`/optimize/${doc.id}`)}>Optimize</button>
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
          onOptimize={() => navigate(`/optimize/${selectedDoc.id}`)}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'resume' | 'post' | 'other'>('resume');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
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

    try {
      const text = await extractTextFromFile(selectedFile);
      setContent(text);
    } catch (err) {
      setError('Failed to extract text from file');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !content) {
      setError('Please provide a name and content');
      return;
    }

    if (!currentUser) return;

    try {
      setUploading(true);
      setError('');
      
      await createDocument(
        currentUser.uid,
        name,
        content,
        type,
        file?.name,
        file?.type
      );
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
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
              />
              {file && (
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
                placeholder="Paste your resume or post content here..."
                rows={10}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
              required
            />
          </div>

          <div className="form-group">
            <label>Document Type</label>
            <select value={type} onChange={e => setType(e.target.value as any)}>
              <option value="resume">Resume</option>
              <option value="post">Social Post</option>
              <option value="other">Other</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
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
  onClose,
  onOptimize
}: {
  document: Document;
  onClose: () => void;
  onOptimize: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{document.name}</h2>
            <div className="doc-meta">
              <span className="doc-type">{document.type}</span>
              <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="document-content">
          <pre>{document.content}</pre>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button className="primary-button" onClick={onOptimize}>
            Optimize This Document
          </button>
        </div>
      </div>
    </div>
  );
}
