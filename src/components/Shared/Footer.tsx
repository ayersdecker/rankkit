import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BugReportModal } from './BugReportModal';
import './Footer.css';

const ADMIN_EMAILS = ['ayersdecker@gmail.com', 'eclipse12895@gmail.com'];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || '');
  
  // Don't show footer on auth pages to keep them clean
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>RankKit</h3>
            <p>AI-powered optimization for career, workplace, and social media content</p>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/legal-disclaimer">Legal Disclaimer</Link>
              </li>
              <li>
                <Link to="/success-disclaimer">Success Disclaimer</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <button
                  className="bug-report-link"
                  onClick={() => setIsBugReportOpen(true)}
                >
                  Report a Bug
                </button>
              </li>
              <li>
                <a href="mailto:support@rankkit.net">Contact Support</a>
              </li>
              {isAdmin && (
                <li>
                  <button
                    className="admin-link"
                    onClick={() => navigate('/admin')}
                  >
                    👤 Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 RankKit. All rights reserved. Beta Version</p>
        </div>
      </footer>
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
      />
    </>
  );
}
