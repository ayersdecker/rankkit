import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  
  // Don't show footer on auth pages to keep them clean
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>RankKit</h3>
          <p>AI-powered document optimization</p>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 RankKit. All rights reserved.</p>
      </div>
    </footer>
  );
}
