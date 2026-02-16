import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllBugReports, deleteAllBugReports, deleteBugReport, BugReport } from '../../services/firestore';
import './AdminDashboard.css';

const ADMIN_EMAILS = ['ayersdecker@gmail.com', 'eclipse12895@gmail.com'];

export default function AdminDashboard() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authorized
  useEffect(() => {
    if (!loading && (!currentUser || !ADMIN_EMAILS.includes(currentUser.email || ''))) {
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);

  // Load bug reports from Firestore
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reports = await getAllBugReports();
        setBugReports(reports);
      } catch (err: any) {
        console.error('Error loading bug reports:', err);
        setError(err.message || 'Failed to load bug reports');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && ADMIN_EMAILS.includes(currentUser.email || '')) {
      loadReports();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="admin-dashboard-container loading">Loading...</div>;
  }

  if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email || '')) {
    return null;
  }

  const filteredReports = filterSeverity === 'all'
    ? bugReports
    : bugReports.filter(report => report.severity === filterSeverity);

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
  });

  const getStats = () => {
    return {
      total: bugReports.length,
      high: bugReports.filter(r => r.severity === 'high').length,
      medium: bugReports.filter(r => r.severity === 'medium').length,
      low: bugReports.filter(r => r.severity === 'low').length,
    };
  };

  const stats = getStats();

  const handleExportCSV = () => {
    const csv = [
      ['Timestamp', 'Title', 'Description', 'Severity', 'Page', 'Email', 'Browser'],
      ...bugReports.map(r => [
        r.timestamp,
        r.title,
        r.description,
        r.severity,
        r.page,
        r.email,
        r.browserInfo,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankkit-bug-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteReport = async (reportId: string | undefined) => {
    if (!reportId) return;
    
    if (window.confirm('Are you sure you want to delete this bug report?')) {
      try {
        await deleteBugReport(reportId);
        setBugReports(prev => prev.filter(r => r.id !== reportId));
      } catch (err: any) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report: ' + err.message);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL bug reports? This cannot be undone.')) {
      try {
        await deleteAllBugReports();
        setBugReports([]);
      } catch (err: any) {
        console.error('Error clearing reports:', err);
        alert('Failed to clear reports: ' + err.message);
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-nav">
        <h1>Admin Dashboard</h1>
        <button className="admin-back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </nav>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h2>Bug Reports</h2>
            <p>View and manage all user-submitted bug reports</p>
          </div>
          <div className="admin-actions">
            <button className="admin-button secondary" onClick={handleExportCSV} disabled={bugReports.length === 0}>
              📥 Export CSV
            </button>
            <button className="admin-button danger" onClick={handleClearAll} disabled={bugReports.length === 0}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {isLoading ? (
          <div className="admin-loading">Loading bug reports...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Reports</div>
              </div>
              <div className="stat-card high">
                <div className="stat-value">{stats.high}</div>
                <div className="stat-label">High Severity</div>
              </div>
              <div className="stat-card medium">
                <div className="stat-value">{stats.medium}</div>
                <div className="stat-label">Medium Severity</div>
              </div>
              <div className="stat-card low">
                <div className="stat-value">{stats.low}</div>
                <div className="stat-label">Low Severity</div>
              </div>
            </div>

            <div className="filters-section">
              <div className="filter-group">
                <label htmlFor="severity-filter">Filter by Severity:</label>
                <select
                  id="severity-filter"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-by">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'severity')}
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="severity">Severity (High First)</option>
                </select>
              </div>
            </div>

            <div className="reports-section">
              {sortedReports.length === 0 ? (
                <div className="no-reports">
                  <p>No bug reports found</p>
                </div>
              ) : (
                <div className="reports-list">
                  {sortedReports.map((report) => (
                    <div key={report.id} className={`report-card severity-${report.severity}`}>
                      <div className="report-header">
                        <div className="report-title-section">
                          <h3>{report.title}</h3>
                          <span className={`severity-badge ${report.severity}`}>
                            {report.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="report-meta">
                          <span className="report-date">
                            {new Date(report.timestamp).toLocaleString()}
                          </span>
                          {report.id && (
                            <button
                              className="report-delete-btn"
                              onClick={() => handleDeleteReport(report.id)}
                              title="Delete this report"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="report-body">
                        <p className="report-description">{report.description}</p>
                      </div>

                      <div className="report-footer">
                        <div className="report-info">
                          <span className="info-label">Page:</span>
                          <span className="info-value">{report.page}</span>
                        </div>
                        {report.email && (
                          <div className="report-info">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{report.email}</span>
                          </div>
                        )}
                        <details className="browser-info">
                          <summary>Browser Info</summary>
                          <p>{report.browserInfo}</p>
                        </details>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
