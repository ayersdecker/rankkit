import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function LegalDisclaimer() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="legal-content">
        <h1>Legal Disclaimer</h1>
        <p className="last-updated">Last updated: February 16, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>
            This Legal Disclaimer applies to the RankKit website (www.rankkit.net), mobile applications, and all related services and content (collectively, the "Service"). Please read this disclaimer carefully before using our Service.
          </p>
        </section>

        <section>
          <h2>General Disclaimer</h2>
          <p>
            <strong>RankKit provides the Service "as is" and "as available" without representations or warranties of any kind, express or implied.</strong> We do not warrant that the Service will be uninterrupted, error-free, secure, or that any errors will be corrected.
          </p>
          <p>
            To the maximum extent permitted by law, we disclaim all warranties, including:
          </p>
          <ul>
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
            <li>Accuracy, reliability, or completeness of content</li>
            <li>Quality of any products, services, or information</li>
          </ul>
        </section>

        <section>
          <h2>No Professional Advice</h2>
          <p>
            RankKit does not provide legal, financial, tax, employment, investment, or professional advice. The Service is provided for informational and optimization purposes only. 
          </p>
          <p>
            <strong>Do not rely on RankKit content for any legal, financial, investment, or professional decisions.</strong> For such decisions, please:
          </p>
          <ul>
            <li>Consult a qualified attorney for legal matters</li>
            <li>Consult a certified financial advisor for financial matters</li>
            <li>Consult a licensed tax professional for tax matters</li>
            <li>Consult a career professional for career-related decisions</li>
            <li>Consult appropriate certified professionals for other specialized matters</li>
          </ul>
        </section>

        <section>
          <h2>User-Generated Content</h2>
          <p>
            You are solely responsible for any content you create, modify, publish, or upload using RankKit, including:
          </p>
          <ul>
            <li>Ensuring content is original and not plagiarized</li>
            <li>Ensuring content does not infringe on third-party rights</li>
            <li>Ensuring content complies with all applicable laws and regulations</li>
            <li>Obtaining necessary permissions and licenses</li>
            <li>Ensuring content is accurate and truthful</li>
          </ul>
          <p>
            You assume full responsibility for any consequences resulting from your content.
          </p>
        </section>

        <section>
          <h2>AI-Generated Content</h2>
          <p>
            Content generated or suggested by our AI tools:
          </p>
          <ul>
            <li>Is provided for reference and assistance only</li>
            <li>May contain errors, inaccuracies, or inappropriate content</li>
            <li>Should be reviewed and edited before use</li>
            <li>Does not reflect our endorsement or guarantee of accuracy</li>
            <li>Remains subject to copyright and intellectual property issues</li>
          </ul>
          <p>
            <strong>You are responsible for verifying all AI-generated suggestions before implementation.</strong>
          </p>
        </section>

        <section>
          <h2>Third-Party Content and Services</h2>
          <p>
            RankKit may contain links to third-party websites, services, and content. We do not endorse, control, or assume responsibility for:
          </p>
          <ul>
            <li>The content, accuracy, or reliability of third-party materials</li>
            <li>The privacy practices of third-party websites</li>
            <li>Any products or services offered by third parties</li>
            <li>Any actions taken on third-party websites</li>
          </ul>
          <p>
            Use third-party services at your own risk and review their terms and policies.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            <strong>To the maximum extent permitted by applicable law, RankKit and its owners, operators, and employees shall not be liable for any damages, including but not limited to:</strong>
          </p>
          <ul>
            <li>Direct, indirect, incidental, or consequential damages</li>
            <li>Special, punitive, or exemplary damages</li>
            <li>Lost profits, revenue, or financial losses</li>
            <li>Lost employment opportunities or income</li>
            <li>Lost business opportunities or contracts</li>
            <li>Lost data, files, or business information</li>
            <li>Damage to reputation or credibility</li>
            <li>Loss of social media reach or followers</li>
            <li>Any other loss or harm</li>
          </ul>
          <p>
            These limitations apply regardless of the form of action (contract, tort, negligence, strict liability, or otherwise) and even if RankKit has been advised of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless RankKit and its owners, operators, employees, and agents from any claims, damages, costs, or expenses (including attorney's fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of this disclaimer or any policies</li>
            <li>Content you create or submit</li>
            <li>Your violation of any claims, laws, or regulations</li>
            <li>Infringement of third-party rights</li>
          </ul>
        </section>

        <section>
          <h2>Intellectual Property Rights</h2>
          <p>
            <strong>Content Ownership:</strong> You retain ownership of content you create. However:
          </p>
          <ul>
            <li>By using RankKit, you grant us a license to use your content to provide and improve our Service</li>
            <li>You are responsible for ensuring you have the right to grant such license</li>
            <li>AI-generated suggestions may be influenced by third-party data patterns</li>
          </ul>
          <p>
            <strong>RankKit Content:</strong> All RankKit branded content, design, and functionality are owned by RankKit and protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>Compliance with Laws</h2>
          <p>
            You agree to use RankKit only for lawful purposes and in compliance with all applicable laws, rules, and regulations. You are responsible for ensuring:
          </p>
          <ul>
            <li>Content complies with all applicable laws</li>
            <li>Employment-related content complies with labor laws</li>
            <li>Financial-related content does not violate securities laws</li>
            <li>Marketing content complies with advertising regulations</li>
            <li>No content violates any third-party rights</li>
          </ul>
        </section>

        <section>
          <h2>Modification of Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We are not liable for any such modifications or discontinuations.
          </p>
        </section>

        <section>
          <h2>Service Availability</h2>
          <p>
            While we strive to maintain continuous service availability, we do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted service</li>
            <li>Error-free operation</li>
            <li>Specific performance or speed</li>
            <li>Availability during maintenance or emergencies</li>
          </ul>
          <p>
            We are not responsible for any service interruptions or data loss.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            This Legal Disclaimer is governed by and construed in accordance with the laws of the applicable jurisdiction, regardless of its conflict of law provisions. Any legal action or proceeding must be brought exclusively in the courts of that jurisdiction.
          </p>
        </section>

        <section>
          <h2>Severability</h2>
          <p>
            If any provision of this disclaimer is found to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect to the maximum extent permitted by law.
          </p>
        </section>

        <section>
          <h2>Entire Agreement</h2>
          <p>
            This Legal Disclaimer, together with our Privacy Policy, Cookie Policy, Terms of Service, and other policies, constitutes the entire agreement between you and RankKit regarding the Service and supersedes all prior agreements and understandings.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            If you have questions about this Legal Disclaimer, please contact us through our website or the contact information provided in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>Changes to This Disclaimer</h2>
          <p>
            We reserve the right to modify this disclaimer at any time. Changes are effective immediately upon posting. Your continued use of the Service after changes are posted constitutes your acceptance of the updated disclaimer.
          </p>
        </section>
      </div>
    </div>
  );
}
