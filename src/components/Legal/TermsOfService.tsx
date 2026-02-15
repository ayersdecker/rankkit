import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: February 14, 2026</p>

        <section>
          <h2>Welcome to RankKit</h2>
          <p>
            Welcome to RankKit ("RankKit," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website located at www.rankkit.net and any related services, tools, or features (collectively, the "Service").
          </p>
          <p>
            By accessing or using RankKit, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old to use RankKit. By using the Service, you represent that you meet this requirement and have the legal capacity to enter into these Terms.
          </p>
        </section>

        <section>
          <h2>2. Account Registration</h2>
          <p>Some features may require you to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Keep your login credentials secure</li>
            <li>Notify us immediately of unauthorized access</li>
          </ul>
          <p>You are responsible for all activity that occurs under your account.</p>
        </section>

        <section>
          <h2>3. Use of the Service</h2>
          <p>You agree to use RankKit only for lawful purposes and in compliance with these Terms.</p>
          <p>You may not:</p>
          <ul>
            <li>Reverse engineer, scrape, or exploit the Service</li>
            <li>Use RankKit to violate laws or third-party rights</li>
            <li>Attempt to disrupt or overload our infrastructure</li>
            <li>Use automated systems without our permission</li>
          </ul>
          <p>We reserve the right to suspend or terminate access for violations.</p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content, software, branding, and materials on RankKit are owned by or licensed to us and are protected by intellectual property laws.
          </p>
          <p>
            You may not copy, modify, distribute, or create derivative works without written permission, except as expressly allowed by the Service.
          </p>
        </section>

        <section>
          <h2>5. User Content</h2>
          <p>You retain ownership of any content you submit to RankKit ("User Content").</p>
          <p>
            By submitting User Content, you grant RankKit a non-exclusive, worldwide, royalty-free license to use, host, store, process, and display that content solely for operating and improving the Service.
          </p>
          <p>You are responsible for ensuring you have the rights to any content you submit.</p>
        </section>

        <section>
          <h2>6. Privacy and Data Protection</h2>
          <p>
            Our Privacy Policy explains how we collect, use, and share information. By using the Service, you agree to
            the Privacy Policy, which is incorporated into these Terms. You can review it at{' '}
            <a href="/privacy">https://www.rankkit.net/privacy</a>.
          </p>
        </section>

        <section>
          <h2>7. NYS Education Law 2-d (If Applicable)</h2>
          <p>
            This section applies only when RankKit acts as a third-party contractor to a New York State educational
            agency under Education Law 2-d and a written agreement. In that case, we will:
          </p>
          <ul>
            <li>Use Student Data only to provide and improve the Service for the educational agency</li>
            <li>Not sell Student Data or use it for targeted advertising</li>
            <li>Limit collection to what is necessary for the educational purpose</li>
            <li>Maintain administrative, technical, and physical safeguards to protect Student Data</li>
            <li>Bind subcontractors to equivalent privacy and security obligations</li>
            <li>Provide a list of subcontractors in our Privacy Policy</li>
            <li>Return or delete Student Data within 30 days of the educational agency request or contract end</li>
            <li>Notify the educational agency of a breach of Student Data as required by Education Law 2-d</li>
          </ul>
          <p>
            Requests to access, correct, or delete Student Data must be submitted through the educational agency.
          </p>
        </section>

        <section>
          <h2>8. Paid Features and Subscriptions</h2>
          <p>If RankKit offers paid features:</p>
          <ul>
            <li>Prices and billing terms will be disclosed at purchase</li>
            <li>Payments are non-refundable unless stated otherwise</li>
            <li>We may change pricing with reasonable notice</li>
            <li>Failure to pay may result in loss of access to paid features</li>
          </ul>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>
            RankKit may integrate or link to third-party services. We are not responsible for their content, policies, or practices. Use them at your own risk.
          </p>
        </section>

        <section>
          <h2>10. Disclaimer of Warranties</h2>
          <p>RankKit is provided "as is" and "as available."</p>
          <p>We make no warranties regarding:</p>
          <ul>
            <li>Accuracy or reliability of data or rankings</li>
            <li>Availability or uptime</li>
            <li>Fitness for a particular purpose</li>
          </ul>
          <p>Use of the Service is at your own risk.</p>
        </section>

        <section>
          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, RankKit and its owners, employees, and affiliates shall not be liable for indirect, incidental, consequential, or punitive damages, including loss of data, profits, or business.
          </p>
          <p>Our total liability shall not exceed the amount paid by you (if any) in the past 12 months.</p>
        </section>

        <section>
          <h2>12. Indemnification</h2>
          <p>You agree to indemnify and hold harmless RankKit from any claims, damages, or expenses arising from:</p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your infringement of third-party rights</li>
          </ul>
        </section>

        <section>
          <h2>13. Termination</h2>
          <p>
            We may suspend or terminate your access at any time, with or without notice, for any reason, including violation of these Terms.
          </p>
          <p>You may stop using the Service at any time.</p>
        </section>

        <section>
          <h2>14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of RankKit after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2>15. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States, without regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2>16. Contact Information</h2>
          <p>If you have questions about these Terms, contact us at:</p>
          <ul>
            <li>Email: ayersdecker@gmail.com</li>
            <li>Website: https://www.rankkit.net</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
