import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="legal-content">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: February 16, 2026</p>

        <section>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They help websites remember information about your visit, such as your preferences and login status. Cookies are widely used in web applications to improve user experience and functionality.
          </p>
        </section>

        <section>
          <h2>How We Use Cookies</h2>
          <p>
            RankKit uses cookies for the following purposes:
          </p>
          <ul>
            <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
            <li><strong>User Preferences:</strong> To remember your settings and preferences</li>
            <li><strong>Analytics:</strong> To understand how users interact with our Service</li>
            <li><strong>Performance:</strong> To improve Service performance and functionality</li>
            <li><strong>Security:</strong> To prevent fraud and protect your account</li>
            <li><strong>Error Tracking:</strong> To diagnose and fix technical issues</li>
          </ul>
        </section>

        <section>
          <h2>Types of Cookies We Use</h2>
          
          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the Service to function properly. They enable core functionality such as:
          </p>
          <ul>
            <li>User authentication and session management</li>
            <li>Account security and fraud prevention</li>
            <li>Basic page functionality and navigation</li>
          </ul>
          <p>
            You cannot disable these cookies without affecting the functionality of the Service.
          </p>

          <h3>Performance Cookies</h3>
          <p>
            These cookies help us understand how users interact with the Service by collecting and analyzing information about:
          </p>
          <ul>
            <li>Pages visited and features used</li>
            <li>Time spent on different pages</li>
            <li>Errors encountered</li>
            <li>User interactions and navigation patterns</li>
          </ul>

          <h3>Preference Cookies</h3>
          <p>
            These cookies remember your choices and preferences, such as:
          </p>
          <ul>
            <li>Language preferences</li>
            <li>Display settings</li>
            <li>Content preferences</li>
          </ul>

          <h3>Third-Party Cookies</h3>
          <p>
            We may allow third-party services to place cookies on your device for:
          </p>
          <ul>
            <li>Analytics and usage tracking (Google Analytics)</li>
            <li>Payment processing (Stripe, Firebase)</li>
            <li>Authentication services (Firebase Authentication)</li>
          </ul>
          <p>
            These third parties have their own cookie policies and privacy practices. We recommend reviewing their policies directly.
          </p>
        </section>

        <section>
          <h2>First-Party Cookies</h2>
          <p>
            First-party cookies are set by RankKit directly through www.rankkit.net. These include:
          </p>
          <ul>
            <li>Authentication tokens and session cookies</li>
            <li>User preference cookies</li>
            <li>CORS and security-related cookies</li>
          </ul>
        </section>

        <section>
          <h2>Cookie Duration</h2>
          <p>
            Cookies have different lifespans:
          </p>
          <ul>
            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 1 year)</li>
            <li><strong>Authentication Cookies:</strong> Remain active for the duration of your session or until you log out</li>
          </ul>
        </section>

        <section>
          <h2>Control and Disable Cookies</h2>
          <p>
            You can control and disable cookies through your browser settings:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
          </ul>
          <p>
            <strong>Warning:</strong> Disabling essential cookies may prevent you from accessing or using certain features of RankKit. Non-essential cookies can typically be disabled without affecting core functionality.
          </p>
        </section>

        <section>
          <h2>Do Not Track</h2>
          <p>
            If you enable "Do Not Track" (DNT) in your browser, we respect your privacy preference. However, note that:
          </p>
          <ul>
            <li>Essential cookies for authentication and security will still be used</li>
            <li>Analytics and performance cookies may be limited</li>
            <li>Some Service features may not function optimally</li>
          </ul>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically to stay informed about how we use cookies.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about our cookie practices, please contact us through our website or email at the contact information provided in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>Third-Party Links</h2>
          <p>
            Our Service may contain links to third-party websites. We are not responsible for the cookie practices of these external websites. We encourage you to review their privacy policies and cookie policies before providing personal information.
          </p>
        </section>
      </div>
    </div>
  );
}
