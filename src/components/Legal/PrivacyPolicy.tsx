import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: February 16, 2026</p>

        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to RankKit ("RankKit," "we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website at www.rankkit.net and related services (collectively, the "Service").
          </p>
          <p>
            By using RankKit, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Service.
          </p>
          <p>
            This Privacy Policy applies to all visitors, users, and others who access the Service. It is incorporated into and subject to our Terms of Service. Any capitalized terms not defined here have the meanings given in the Terms of Service.
          </p>
          <p>
            <strong>Key Points:</strong> We are committed to protecting your privacy. We do not sell your personal information. You have control over your data and can request access, correction, or deletion at any time. We use industry-standard security measures to protect your information.
          </p>
        </section>

        <section>
          <h2>Scope and Application</h2>
          <p>
            This Privacy Policy applies to information collected through:
          </p>
          <ul>
            <li>Our website at www.rankkit.net and all associated domains</li>
            <li>Mobile applications and progressive web apps (if applicable)</li>
            <li>Email, text, and other electronic communications</li>
            <li>Interactions with our advertising and applications on third-party websites</li>
            <li>Customer service and support channels</li>
          </ul>
          <p>
            This Privacy Policy does not apply to information collected by third parties, including through any application or content that may link to or be accessible from the Service. We are not responsible for the privacy practices of third parties.
          </p>
        </section>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Service, including information by which you may be personally identified, and information about your internet connection, equipment, and usage patterns.
          </p>
          
          <h3>1.1 Personal Information</h3>
          <p>When you register or use our Service, we may collect:</p>
          <ul>
            <li><strong>Account Information:</strong> Email address, password (encrypted using industry-standard hashing), display name, username</li>
            <li><strong>Profile Information:</strong> Professional links (LinkedIn, GitHub, personal website, portfolio, Twitter), job title, industry, experience level, career goals</li>
            <li><strong>Contact Information:</strong> Phone number, mailing address, professional contact details you provide in your profile or documents</li>
            <li><strong>Demographic Information:</strong> Age range, location (city, state, country), language preferences</li>
            <li><strong>Professional Information:</strong> Work history, education, skills, certifications, achievements</li>
          </ul>

          <h3>1.2 Content You Submit</h3>
          <p>We collect and process content you submit to the Service, including:</p>
          <ul>
            <li><strong>Career Documents:</strong> Resumes, CVs, cover letters, application materials, portfolio samples</li>
            <li><strong>Social Media Content:</strong> Posts, captions, hashtags, content for optimization across platforms (LinkedIn, Twitter, Facebook, Instagram)</li>
            <li><strong>Job-Related Content:</strong> Job descriptions, company research, application tracking information</li>
            <li><strong>Interview Materials:</strong> Preparation notes, practice responses, company research, question lists</li>
            <li><strong>Sales and Business Documents:</strong> Cold emails, sales scripts, pitches, prospecting materials, objection handlers</li>
            <li><strong>Feedback and Suggestions:</strong> User-submitted feature requests, bug reports, satisfaction surveys</li>
            <li><strong>Support Communications:</strong> Messages sent to customer support, help requests, correspondence</li>
          </ul>

          <h3>1.3 Usage Information</h3>
          <p>We automatically collect information about how you interact with our Service:</p>
          <ul>
            <li><strong>Usage Data:</strong> Features accessed, tools used, documents created and edited, optimization requests submitted, time spent on pages, navigation paths, feature interaction frequency</li>
            <li><strong>Device Information:</strong> Browser type and version, operating system and version, device identifiers (such as device ID, advertising ID), screen resolution, hardware model</li>
            <li><strong>Log Data:</strong> IP address, access times and dates, pages viewed, actions taken, referring/exit pages, crash data, performance metrics</li>
            <li><strong>Session Information:</strong> Login frequency, session duration, authentication methods used, account settings changed</li>
            <li><strong>Performance Metrics:</strong> Page load times, error rates, API response times, feature performance data</li>
          </ul>

          <h3>1.4 Cookies and Tracking Technologies</h3>
          <p>We use various technologies to collect information automatically:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic Service functionality</li>
            <li><strong>Preference Cookies:</strong> Remember your settings, language preferences, and customization choices</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service using tools like Google Analytics</li>
            <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
            <li><strong>Local Storage:</strong> HTML5 local storage used to cache data and improve performance</li>
            <li><strong>Web Beacons:</strong> Small graphic images used to track email opens and user engagement</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, some parts of the Service may not function properly if you disable cookies.
          </p>

          <h3>1.5 Payment Information</h3>
          <p>
            If you purchase a subscription or paid features, payment processing is handled by third-party payment processors (such as Stripe or PayPal). We do not store full credit card numbers on our servers. Information we may collect includes:
          </p>
          <ul>
            <li>Billing name and address</li>
            <li>Last four digits of credit card number</li>
            <li>Card type and expiration date</li>
            <li>Transaction history and invoice records</li>
            <li>Payment method preferences</li>
            <li>Subscription tier and renewal dates</li>
          </ul>

          <h3>1.6 Information from Third Parties</h3>
          <p>We may receive information about you from third-party sources:</p>
          <ul>
            <li><strong>Social Media Platforms:</strong> If you log in using Google or other OAuth providers, we receive basic profile information (name, email, profile picture) as permitted by those platforms</li>
            <li><strong>Analytics Providers:</strong> Aggregated demographic and interest data from analytics platforms</li>
            <li><strong>Security Services:</strong> Threat intelligence and fraud prevention data to protect the Service</li>
            <li><strong>Marketing Partners:</strong> If you interact with our advertisements or promotional campaigns</li>
          </ul>

          <h3>1.7 Information You Make Public</h3>
          <p>
            Certain portions of your profile or content may be visible to other users or the public, depending on your privacy settings. This may include:
          </p>
          <ul>
            <li>Display name and profile picture</li>
            <li>Public profile page (if enabled)</li>
            <li>Shared or published content (if you choose to share)</li>
            <li>Comments or feedback on public features</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes, based on the legal grounds described in this section:</p>
          
          <h3>2.1 Providing and Improving the Service</h3>
          <ul>
            <li>Process and optimize your documents using AI technology powered by state-of-the-art language models</li>
            <li>Store your documents and optimization history securely in your personal library</li>
            <li>Personalize your experience and provide tailored recommendations based on your usage patterns</li>
            <li>Develop new features and improve existing functionality through user feedback and testing</li>
            <li>Train and improve our AI models using aggregated, anonymized data (never your personal content)</li>
            <li>Generate analytics and insights to optimize Service performance and user experience</li>
            <li>Provide customized content suggestions based on your professional profile and goals</li>
            <li>Enable search and retrieval of your saved documents and content</li>
            <li>Maintain and troubleshoot technical issues with the Service</li>
          </ul>

          <h3>2.2 Account and Communication</h3>
          <ul>
            <li>Create, maintain, and secure your account</li>
            <li>Authenticate your identity and prevent unauthorized access</li>
            <li>Send service-related notifications including updates, security alerts, and technical notices</li>
            <li>Respond to your inquiries, support requests, and customer service needs</li>
            <li>Send promotional communications about new features, tips, and special offers (with your consent)</li>
            <li>Conduct surveys and gather feedback to improve our Service</li>
            <li>Notify you about changes to the Service, policies, or terms</li>
            <li>Send usage summaries and activity reports</li>
            <li>Provide in-app messages, notifications, and guided tutorials</li>
          </ul>

          <h3>2.3 Security and Compliance</h3>
          <ul>
            <li>Detect, prevent, and address fraud, security issues, and unauthorized access attempts</li>
            <li>Enforce our Terms of Service, policies, and community guidelines</li>
            <li>Comply with legal obligations, court orders, and regulatory requirements</li>
            <li>Monitor and analyze usage patterns to identify and prevent abuse or automated bot activity</li>
            <li>Protect the rights, property, and safety of RankKit, our users, and the public</li>
            <li>Conduct security audits and vulnerability assessments</li>
            <li>Investigate and respond to claims of policy violations</li>
            <li>Maintain records for legal compliance and dispute resolution</li>
            <li>Verify user identity for account recovery and support purposes</li>
          </ul>

          <h3>2.4 Analytics and Research</h3>
          <ul>
            <li>Understand how users interact with the Service through behavioral analysis</li>
            <li>Conduct research to improve AI accuracy, performance, and relevance</li>
            <li>Generate aggregated, anonymized statistics about Service usage and trends</li>
            <li>A/B test new features and interface improvements</li>
            <li>Measure the effectiveness of marketing campaigns and user acquisition channels</li>
            <li>Create reports on Service performance, user satisfaction, and feature adoption</li>
            <li>Identify usage patterns to inform product development roadmap</li>
            <li>Benchmark performance metrics against industry standards</li>
          </ul>

          <h3>2.5 Marketing and Advertising</h3>
          <ul>
            <li>Send targeted marketing communications based on your interests and usage (with consent)</li>
            <li>Display relevant advertisements for our Service on third-party platforms</li>
            <li>Measure the effectiveness of our advertising campaigns</li>
            <li>Create lookalike audiences for marketing purposes (using anonymized data)</li>
            <li>Retarget users who have visited our website or interacted with our Service</li>
            <li>Send newsletter updates about industry trends, career tips, and product news</li>
          </ul>

          <h3>2.6 Payment Processing and Billing</h3>
          <ul>
            <li>Process subscription payments and one-time purchases</li>
            <li>Manage billing cycles, renewals, and cancellations</li>
            <li>Generate invoices and payment receipts</li>
            <li>Handle refund requests and payment disputes</li>
            <li>Detect and prevent payment fraud</li>
            <li>Send payment confirmations and renewal reminders</li>
            <li>Maintain financial records as required by law</li>
          </ul>

          <h3>2.7 Legal Basis for Processing (GDPR)</h3>
          <p>For users in the European Economic Area, we process your personal data based on the following legal grounds:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested</li>
            <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests (e.g., improving the Service, security, analytics), provided your interests don't override ours</li>
            <li><strong>Consent:</strong> Processing based on your explicit consent (e.g., marketing communications)</li>
            <li><strong>Legal Obligation:</strong> Processing necessary to comply with legal requirements</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information to third parties. We may share your information in the following circumstances:</p>

          <h3>3.1 Service Providers</h3>
          <p>We share information with third-party service providers who perform services on our behalf under strict confidentiality agreements:</p>
          <ul>
            <li><strong>OpenAI:</strong> For AI-powered document optimization and content generation. Your content is processed through OpenAI's API, but OpenAI does not use API data to train their models per their API terms</li>
            <li><strong>Firebase/Google Cloud:</strong> For authentication services, database hosting, file storage, and cloud infrastructure</li>
            <li><strong>Payment Processors (Stripe, PayPal):</strong> For processing subscription payments and handling financial transactions securely</li>
            <li><strong>Analytics Providers (Google Analytics):</strong> For understanding service usage, performance metrics, and user behavior patterns</li>
            <li><strong>Email Service Providers:</strong> For sending transactional emails, notifications, and marketing communications</li>
            <li><strong>Customer Support Tools:</strong> For managing support tickets, live chat, and customer communications</li>
            <li><strong>Cloud Storage Providers:</strong> For secure backup and redundancy of your data</li>
            <li><strong>Content Delivery Networks (CDNs):</strong> For fast and reliable content delivery worldwide</li>
            <li><strong>Security Services:</strong> For DDoS protection, fraud prevention, and threat detection</li>
          </ul>
          <p>These providers are contractually bound to protect your information, use it only for specified purposes, and comply with applicable data protection laws.</p>

          <h3>3.2 Legal Requirements and Protection</h3>
          <p>We may disclose your information if required by law or in good faith belief that such action is necessary to:</p>
          <ul>
            <li>Comply with court orders, subpoenas, warrants, or other legal processes</li>
            <li>Respond to lawful requests from law enforcement or government agencies</li>
            <li>Enforce our Terms of Service, policies, or user agreements</li>
            <li>Protect the rights, property, or safety of RankKit, our users, or the public</li>
            <li>Detect, prevent, or address fraud, security, or technical issues</li>
            <li>Respond to claims that content violates the rights of third parties</li>
            <li>Comply with national security or public safety requirements</li>
            <li>Investigate potential violations of law or our policies</li>
          </ul>

          <h3>3.3 Business Transfers</h3>
          <p>
            If RankKit is involved in a merger, acquisition, bankruptcy, reorganization, partnership, asset sale, or similar transaction, your information may be transferred as part of that transaction. In such cases:
          </p>
          <ul>
            <li>We will notify you via email and/or prominent notice on our Service</li>
            <li>Your information will remain subject to this Privacy Policy unless you consent to a new policy</li>
            <li>The acquiring entity will be bound to honor existing privacy commitments</li>
            <li>You will have the option to delete your account if you do not agree to the transfer</li>
          </ul>

          <h3>3.4 With Your Consent</h3>
          <p>We may share your information for other purposes with your explicit consent, such as:</p>
          <ul>
            <li>Sharing your content with third parties you authorize</li>
            <li>Publishing testimonials or case studies (with your permission)</li>
            <li>Participating in partner programs or integrations you enable</li>
            <li>Sharing information for research studies you opt into</li>
          </ul>

          <h3>3.5 Aggregated and Anonymized Data</h3>
          <p>
            We may share aggregated, de-identified, or anonymized information that cannot reasonably be used to identify you. This includes:
          </p>
          <ul>
            <li>Industry reports and trend analysis</li>
            <li>Usage statistics and benchmarks</li>
            <li>Research publications and academic studies</li>
            <li>Public marketing materials and presentations</li>
          </ul>
          <p>This data does not contain personally identifiable information and cannot be traced back to individual users.</p>

          <h3>3.6 Public Forums and Shared Content</h3>
          <p>
            If you choose to participate in public areas of the Service or share content publicly, that information may be visible to other users and the public. This includes:
          </p>
          <ul>
            <li>Public profile information you choose to display</li>
            <li>Comments, reviews, or feedback on public features</li>
            <li>Content you explicitly mark as "public" or "shared"</li>
            <li>Interactions in community forums or discussion boards (if applicable)</li>
          </ul>
          <p>Please exercise caution when sharing personal information in public areas.</p>
        </section>

        <section>
          <h2>4. Data Storage and Security</h2>
          
          <h3>4.1 Data Storage Location</h3>
          <p>
            Your information is stored on secure servers provided by Google Cloud Platform (Firebase) and other trusted infrastructure providers. Data is primarily stored in the United States and may be processed in other countries where our service providers operate, including:
          </p>
          <ul>
            <li>United States (primary data centers)</li>
            <li>European Union (backup and redundancy)</li>
            <li>Other regions as needed for content delivery and performance optimization</li>
          </ul>
          <p>
            We ensure that all international data transfers comply with applicable data protection laws, including the use of Standard Contractual Clauses (SCCs) approved by the European Commission.
          </p>

          <h3>4.2 Security Measures</h3>
          <p>We implement comprehensive technical, administrative, and physical security measures to protect your information:</p>
          
          <p><strong>Technical Safeguards:</strong></p>
          <ul>
            <li>Encryption in transit using TLS 1.2+ (HTTPS) for all data transmission</li>
            <li>Encryption at rest using AES-256 for stored data</li>
            <li>Secure authentication with Firebase Auth and industry-standard password hashing (bcrypt)</li>
            <li>Multi-factor authentication options for account access</li>
            <li>Firestore security rules to restrict unauthorized data access</li>
            <li>Regular automated backups with encryption</li>
            <li>DDoS protection and rate limiting to prevent attacks</li>
            <li>Web Application Firewall (WAF) to filter malicious traffic</li>
            <li>Secure API authentication using tokens with expiration</li>
            <li>SQL injection and XSS prevention through input validation and sanitization</li>
          </ul>

          <p><strong>Administrative Safeguards:</strong></p>
          <ul>
            <li>Access controls limiting employee access to user data on a need-to-know basis</li>
            <li>Regular security training for all personnel with access to user data</li>
            <li>Background checks for employees handling sensitive information</li>
            <li>Confidentiality agreements for all staff and contractors</li>
            <li>Security incident response plan and procedures</li>
            <li>Regular security audits and penetration testing</li>
            <li>Vendor security assessments before onboarding third-party services</li>
            <li>Data minimization practices to collect only necessary information</li>
          </ul>

          <p><strong>Physical Safeguards:</strong></p>
          <ul>
            <li>Secure data centers with 24/7 monitoring and surveillance</li>
            <li>Restricted physical access to server facilities</li>
            <li>Environmental controls (fire suppression, climate control)</li>
            <li>Redundant power supplies and network connections</li>
          </ul>

          <h3>4.3 Data Retention</h3>
          <p>We retain your information for as long as necessary to provide the Service, comply with legal obligations, and resolve disputes:</p>
          <ul>
            <li><strong>Account Information:</strong> Retained while your account is active, plus 30 days after deletion for account recovery purposes, then permanently deleted</li>
            <li><strong>Documents and Content:</strong> Retained until you explicitly delete them or close your account; backup copies deleted within 90 days of primary deletion</li>
            <li><strong>Usage Logs and Analytics:</strong> Typically retained for 90 days for operational purposes, then aggregated or deleted</li>
            <li><strong>Security Logs:</strong> Retained for 12 months for security monitoring and incident investigation</li>
            <li><strong>Financial Records:</strong> Retained for 7 years as required by tax and accounting regulations</li>
            <li><strong>Support Communications:</strong> Retained for 3 years to maintain support history and resolve disputes</li>
            <li><strong>Marketing Data:</strong> Retained until you unsubscribe or request deletion</li>
          </ul>
          <p>
            You can request early deletion of your data by contacting us. Some information may be retained in backup systems for a limited period even after deletion.
          </p>

          <h3>4.4 Data Backup and Recovery</h3>
          <p>
            We maintain regular encrypted backups of your data to prevent data loss due to system failures, disasters, or security incidents. Backup procedures include:
          </p>
          <ul>
            <li>Automated daily backups stored in geographically distributed locations</li>
            <li>Backup retention for 30 days with point-in-time recovery capability</li>
            <li>Regular backup integrity testing and restoration drills</li>
            <li>Encrypted backup storage with access logging</li>
          </ul>

          <h3>4.5 Security Limitations</h3>
          <p>
            While we implement strong security measures, no system is completely secure. You acknowledge that:
          </p>
          <ul>
            <li>Internet transmission is never 100% secure or error-free</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>You should use strong, unique passwords and enable multi-factor authentication</li>
            <li>You should promptly notify us of any unauthorized account access</li>
            <li>We cannot guarantee absolute security of your information</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Privacy Rights and Choices</h2>
          <p>You have significant control over your personal information and how it is used. This section describes your rights and how to exercise them.</p>
          
          <h3>5.1 Access and Portability Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access Your Data:</strong> Request a copy of all personal information we hold about you</li>
            <li><strong>Data Portability:</strong> Receive your data in a structured, commonly used, machine-readable format (JSON or CSV)</li>
            <li><strong>Export Documents:</strong> Download all your documents and content at any time through the Service interface</li>
            <li><strong>Account Information:</strong> View and verify what information we have about you</li>
          </ul>
          <p>
            To request your data, go to Account Settings {'>'} Privacy {'>'} Download My Data, or contact us at ayersdecker@gmail.com with "Data Access Request" in the subject line.
          </p>

          <h3>5.2 Correction and Update Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Correct Inaccurate Data:</strong> Update or correct any inaccurate or incomplete personal information</li>
            <li><strong>Update Profile:</strong> Modify your profile information, contact details, and preferences at any time</li>
            <li><strong>Change Password:</strong> Update your security credentials regularly</li>
            <li><strong>Modify Settings:</strong> Adjust privacy settings and notification preferences</li>
          </ul>
          <p>
            Most information can be updated directly through your Account Settings. For information you cannot update yourself, contact our support team.
          </p>

          <h3>5.3 Deletion Rights (Right to be Forgotten)</h3>
          <p>You have the right to request deletion of your data:</p>
          <ul>
            <li><strong>Account Deletion:</strong> Permanently delete your account and all associated data</li>
            <li><strong>Selective Deletion:</strong> Delete specific documents, content, or profile information</li>
            <li><strong>Complete Erasure:</strong> Request removal of all personal information (subject to legal retention requirements)</li>
          </ul>
          <p>
            To delete your account, go to Account Settings {'>'} Danger Zone {'>'} Delete Account. Note that:
          </p>
          <ul>
            <li>Account deletion is permanent and cannot be undone</li>
            <li>Deleted data is removed within 30 days (including backups within 90 days)</li>
            <li>Some information may be retained for legal compliance (e.g., financial records)</li>
            <li>Anonymized data used in aggregated statistics cannot be retrieved or deleted</li>
          </ul>

          <h3>5.4 Objection and Restriction Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Object to Processing:</strong> Object to certain uses of your personal information, particularly for marketing purposes</li>
            <li><strong>Restrict Processing:</strong> Request that we limit how we use your data while investigating your concerns</li>
            <li><strong>Withdraw Consent:</strong> Withdraw previously given consent for data processing (where consent is the legal basis)</li>
            <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from promotional communications at any time</li>
          </ul>

          <h3>5.5 Managing Your Account</h3>
          <p>You can manage your information directly through the Service:</p>
          <ul>
            <li>Update profile information in Account Settings</li>
            <li>Add or remove professional links (LinkedIn, GitHub, website, portfolio, Twitter)</li>
            <li>Delete individual documents from your Document Library</li>
            <li>Clear optimization history</li>
            <li>Change privacy and notification settings</li>
            <li>Enable or disable two-factor authentication</li>
            <li>View login history and active sessions</li>
            <li>Revoke access for third-party integrations</li>
          </ul>

          <h3>5.6 Marketing Communications</h3>
          <p>
            You can control marketing communications by:
          </p>
          <ul>
            <li>Clicking "unsubscribe" in any promotional email</li>
            <li>Updating email preferences in Account Settings</li>
            <li>Contacting us directly to opt out</li>
            <li>Managing notification preferences for in-app messages</li>
          </ul>
          <p>
            Note: You cannot opt out of service-related communications (e.g., security alerts, billing notifications, Terms updates) while your account is active.
          </p>

          <h3>5.7 Cookie Controls</h3>
          <p>
            You can control cookies and tracking technologies through:
          </p>
          <ul>
            <li>Browser settings to block or delete cookies</li>
            <li>Browser extensions for enhanced privacy control</li>
            <li>Do Not Track (DNT) signals (though not all services honor DNT)</li>
            <li>Opting out of Google Analytics tracking</li>
            <li>Disabling third-party advertising cookies</li>
          </ul>
          <p>
            Cookie Preference Center: [Link to cookie settings if implemented]
          </p>

          <h3>5.8 Mobile Device Permissions</h3>
          <p>
            If you use our Service through a mobile app (if applicable), you can control:
          </p>
          <ul>
            <li>Location services (GPS)</li>
            <li>Camera and microphone access</li>
            <li>Photo library access</li>
            <li>Push notification permissions</li>
            <li>Contacts and calendar access</li>
          </ul>
          <p>
            These permissions can be managed through your device settings.
          </p>

          <h3>5.9 Exercising Your Rights</h3>
          <p>
            To exercise any of the rights described above:
          </p>
          <ul>
            <li>Use self-service options in Account Settings whenever possible</li>
            <li>Email us at ayersdecker@gmail.com with your request</li>
            <li>Include "Privacy Rights Request" in the subject line</li>
            <li>Provide sufficient information to verify your identity</li>
            <li>Specify which rights you wish to exercise</li>
          </ul>
          <p>
            We will respond to verified requests within 30 days (or as required by applicable law). Some requests may take longer to process, and we will notify you of any delays.
          </p>

          <h3>5.10 Verification Process</h3>
          <p>
            To protect your privacy and security, we verify your identity before processing rights requests:
          </p>
          <ul>
            <li>We may request additional information to confirm your identity</li>
            <li>You may need to verify access to your registered email address</li>
            <li>For sensitive requests, we may require additional authentication</li>
            <li>We will not fulfill requests we cannot verify</li>
          </ul>
        </section>

        <section>
          <h2>6. Children's Privacy (COPPA)</h2>
          <p>
            RankKit is not intended for users under 18 years of age, and we do not knowingly collect information from children under 18. We comply with the Children's Online Privacy Protection Act (COPPA) and similar international laws.
          </p>
          <p>
            <strong>Our Policy:</strong>
          </p>
          <ul>
            <li>We do not knowingly solicit or collect personal information from anyone under 18</li>
            <li>We do not knowingly allow users under 18 to register for accounts</li>
            <li>We do not knowingly market to or target children</li>
            <li>We do not sell products or services for purchase by children</li>
          </ul>
          <p>
            <strong>If You Believe a Child Has Provided Information:</strong> If you believe we have collected information from a child under 18, please contact us immediately at ayersdecker @gmail.com with "Child Privacy Concern" in the subject line. We will:
          </p>
          <ul>
            <li>Investigate the matter promptly</li>
            <li>Delete the child's information from our systems</li>
            <li>Terminate the account if one was created</li>
            <li>Take steps to prevent future incidents</li>
          </ul>
          <p>
            <strong>Parental Rights:</strong> Parents or legal guardians can request access to and deletion of their child's information by providing proof of guardianship.
          </p>
        </section>

        <section>
          <h2>7. Cookies and Tracking Technologies Policy</h2>
          <p>
            This section provides detailed information about cookies and similar technologies we use on the Service.
          </p>

          <h3>7.1 What Are Cookies</h3>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, making your experience more convenient and personalized.
          </p>

          <h3>7.2 Types of Cookies We Use</h3>
          <p><strong>Essential Cookies (Required):</strong></p>
          <ul>
            <li>Authentication cookies to keep you logged in</li>
            <li>Security cookies to prevent fraud and abuse</li>
            <li>Session management cookies for Service functionality</li>
            <li>Load balancing cookies for Service performance</li>
          </ul>

          <p><strong>Functional Cookies (Optional):</strong></p>
          <ul>
            <li>Preference cookies to remember your settings</li>
            <li>Language selection cookies</li>
            <li>Theme and interface customization cookies</li>
            <li>Recently viewed content cookies</li>
          </ul>

          <p><strong>Analytics Cookies (Optional):</strong></p>
          <ul>
            <li>Google Analytics for understanding user behavior</li>
            <li>Page view and click tracking</li>
            <li>Feature usage analytics</li>
            <li>Performance monitoring</li>
          </ul>

          <p><strong>Marketing Cookies (Optional with Consent):</strong></p>
          <ul>
            <li>Conversion tracking for advertising campaigns</li>
            <li>Retargeting cookies for relevant ads</li>
            <li>Social media integration cookies</li>
          </ul>

          <h3>7.3 Other Tracking Technologies</h3>
          <ul>
            <li><strong>Local Storage:</strong> HTML5 local storage for caching and offline functionality</li>
            <li><strong>Session Storage:</strong> Temporary storage cleared when you close your browser</li>
            <li><strong>Web Beacons:</strong> Small graphics used to track email opens and engagement</li>
            <li><strong>ETags:</strong> HTTP headers for caching and tracking</li>
            <li><strong>Fingerprinting:</strong> We do not use browser or device fingerprinting</li>
          </ul>

          <h3>7.4 Third-Party Cookies</h3>
          <p>Third-party services may set their own cookies:</p>
          <ul>
            <li>Google Analytics (analytics and reporting)</li>
            <li>Firebase (authentication and infrastructure)</li>
            <li>Social media platforms (if you interact with social features)</li>
            <li>Payment processors (for checkout processes)</li>
          </ul>

          <h3>7.5 Managing Cookie Preferences</h3>
          <p>You can control cookies through:</p>
          <ul>
            <li>Browser settings (Chrome, Firefox, Safari, Edge all provide cookie controls)</li>
            <li>Our Cookie Preference Center (if implemented)</li>
            <li>Browser extensions like Privacy Badger or uBlock Origin</li>
            <li>Opt-out tools provided by advertising networks</li>
          </ul>
          <p>
            <strong>Note:</strong> Disabling essential cookies will affect Service functionality, including your ability to log in and use certain features.
          </p>

          <h3>7.6 Do Not Track Signals</h3>
          <p>
            Some browsers support "Do Not Track" (DNT) signals. Currently, there is no industry standard for interpreting DNT signals. We do not currently respond to DNT signals, but we respect your privacy choices through other means (cookie settings, opt-out preferences).
          </p>
        </section>

        <section>
          <h2>8. NYS Education Law 2-d (Student Data)</h2>
          <p>
            When RankKit provides services to New York State educational agencies under a written agreement subject to Education Law 2-d, we handle Student Data as follows:
          </p>
          <ul>
            <li>Use Student Data only to provide the contracted services</li>
            <li>Not sell or use Student Data for targeted advertising</li>
            <li>Implement appropriate safeguards as required by law</li>
            <li>Return or securely delete Student Data upon request or contract termination</li>
            <li>Report any breaches as required by Education Law 2-d</li>
          </ul>
          <p>
            <strong>Subcontractors:</strong> We may use the following subcontractors to process Student Data:
          </p>
          <ul>
            <li>OpenAI (AI processing)</li>
            <li>Google Cloud Platform/Firebase (hosting and database)</li>
          </ul>
          <p>
            Parents and eligible students should direct requests regarding Student Data to their educational agency.
          </p>
        </section>

        <section>
          <h2>9. Automated Decision Making and AI Processing</h2>
          <p>
            RankKit uses artificial intelligence and automated systems to provide its services. This section explains how automated processing works and your related rights.
          </p>

          <h3>9.1 AI-Powered Features</h3>
          <p>We use AI and automated processing for:</p>
          <ul>
            <li><strong>Content Optimization:</strong> AI analysis and improvement of your resumes, cover letters, and other documents</li>
            <li><strong>Content Generation:</strong> Creating new content based on your inputs and preferences</li>
            <li><strong>Personalization:</strong> Recommending features and tools based on your usage patterns</li>
            <li><strong>Quality Control:</strong> Detecting errors, inconsistencies, and areas for improvement</li>
            <li><strong>Spam Detection:</strong> Identifying and preventing abusive or fraudulent content</li>
            <li><strong>Usage Analytics:</strong> Understanding aggregate user behavior patterns</li>
          </ul>

          <h3>9.2 OpenAI Integration</h3>
          <p>
            We use OpenAI's GPT models to power our AI features. When you use optimization tools:
          </p>
          <ul>
            <li>Your content is sent securely to OpenAI's API via HTTPS</li>
            <li>OpenAI processes your content to generate optimized versions</li>
            <li>OpenAI does not use API data to train their public models (per their API terms)</li>
            <li>Data is not stored by OpenAI longer than 30 days for abuse monitoring</li>
            <li>We cache some results to improve performance and reduce costs</li>
          </ul>
          <p>
            OpenAI's API Data Usage Policy: <a href="https://openai.com/policies/api-data-usage-policies" target="_blank" rel="noopener noreferrer">https://openai.com/policies/api-data-usage-policies</a>
          </p>

          <h3>9.3 Human Review and Override</h3>
          <ul>
            <li>You have complete control over accepting or rejecting AI suggestions</li>
            <li>All AI-generated content is presented as suggestions, not final outputs</li>
            <li>You can edit, modify, or discard any AI-generated content</li>
            <li>Customer support is available if you have concerns about AI outputs</li>
            <li>You can request human review of automated decisions that affect you</li>
          </ul>

          <h3>9.4 No Discriminatory Profiling</h3>
          <p>
            We do not use automated decision-making for:
          </p>
          <ul>
            <li>Making decisions that significantly affect your legal rights</li>
            <li>Discriminatory profiling based on protected characteristics</li>
            <li>Automated rejection of job applications or similar high-stakes decisions</li>
            <li>Creating profiles for characteristics like race, religion, or health status</li>
          </ul>

          <h3>9.5 Your Rights Regarding Automated Processing</h3>
          <p>Under GDPR and similar laws, you have the right to:</p>
          <ul>
            <li>Obtain human intervention in automated decisions</li>
            <li>Express your point of view regarding automated processing</li>
            <li>Contest automated decisions that significantly affect you</li>
            <li>Request an explanation of how automated decisions are made</li>
          </ul>
        </section>

        <section>
          <h2>10. User-Generated Content and Public Information</h2>
          
          <h3>10.1 Private by Default</h3>
          <p>
            By default, all content you create on RankKit is private and only accessible by you. Your documents, optimization history, and profile information are not shared with other users unless you explicitly choose to share them.
          </p>

          <h3>10.2 Public Sharing (If Enabled)</h3>
          <p>
            If we implement public sharing features in the future, you will have the option to:
          </p>
          <ul>
            <li>Share specific documents publicly or with selected users</li>
            <li>Create a public profile page</li>
            <li>Participate in community forums or discussions</li>
            <li>Publish testimonials or success stories</li>
          </ul>
          <p>
            Any content you mark as "public" may be:
          </p>
          <ul>
            <li>Visible to other RankKit users and the general public</li>
            <li>Indexed by search engines</li>
            <li>Shared or reposted by others</li>
            <li>Cached or archived by third parties</li>
          </ul>

          <h3>10.3 Ownership and Licenses</h3>
          <p>
            You retain all ownership rights to content you create and upload. By using the Service, you grant us a limited license to:
          </p>
          <ul>
            <li>Store and process your content to provide the Service</li>
            <li>Use AI to optimize and generate content based on your inputs</li>
            <li>Create backups for data protection purposes</li>
            <li>Display your content back to you across devices</li>
          </ul>
          <p>
            This license terminates when you delete your content or account, except for:
          </p>
          <ul>
            <li>Content you've shared publicly (which may remain in caches or archives)</li>
            <li>Backup copies (deleted within 90 days)</li>
            <li>Anonymized data used in aggregated statistics</li>
          </ul>
        </section>

        <section>
          <h2>11. International Users and Data Transfers</h2>
          <p>
            RankKit is based in the United States and operates globally. This section explains how we handle international data transfers and protect your information across borders.
          </p>

          <h3>11.1 Cross-Border Data Transfers</h3>
          <p>
            If you access the Service from outside the United States, your information will be transferred to, stored, and processed in the United States and other countries where our service providers operate. These countries may have different data protection laws than your country of residence.
          </p>
          <p>
            By using the Service, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.
          </p>

          <h3>11.2 Data Transfer Safeguards</h3>
          <p>
            We ensure adequate protection for international data transfers through:
          </p>
          <ul>
            <li><strong>Standard Contractual Clauses (SCCs):</strong> We use European Commission-approved SCCs for transfers from the EEA to other jurisdictions</li>
            <li><strong>Adequacy Decisions:</strong> We comply with adequacy decisions recognizing certain countries as providing adequate data protection</li>
            <li><strong>Privacy Shield (Historical):</strong> While the Privacy Shield framework is no longer valid, we maintain equivalent protections</li>
            <li><strong>Binding Corporate Rules:</strong> Our service providers may use BCRs to ensure consistent data protection</li>
            <li><strong>Encryption:</strong> All data transfers are encrypted in transit using TLS 1.2+</li>
          </ul>

          <h3>11.3 Data Localization</h3>
          <p>
            Primary data storage locations:
          </p>
          <ul>
            <li><strong>United States:</strong> Primary servers and database hosting</li>
            <li><strong>European Union:</strong> Backup servers for EU users (GDPR compliance)</li>
            <li><strong>Content Delivery Networks:</strong> Distributed globally for performance</li>
          </ul>

          <h3>11.4 Regional Data Protection Laws</h3>
          <p>
            We comply with regional data protection laws where applicable, including but not limited to:
          </p>
          <ul>
            <li>EU General Data Protection Regulation (GDPR)</li>
            <li>UK Data Protection Act and UK GDPR</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>Canadian Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
            <li>Australian Privacy Act</li>
            <li>Brazilian General Data Protection Law (LGPD)</li>
            <li>Swiss Federal Act on Data Protection (FADP)</li>
          </ul>

          <h3>11.5 Local Representative</h3>
          <p>
            If required by local law, we may appoint a local data protection representative in your jurisdiction. Contact information for regional representatives will be provided as applicable.
          </p>
        </section>

        <section>
          <h2>12. Third-Party Links, Integrations, and Services</h2>
          <p>
            The Service may contain links to third-party websites, integrate with third-party services, or include third-party content. This section explains our relationship with third parties and your privacy when interacting with them.
          </p>

          <h3>12.1 Third-Party Websites and Links</h3>
          <p>
            Our Service may contain links to external websites, including:
          </p>
          <ul>
            <li>Job boards and career resources</li>
            <li>Professional networking platforms (LinkedIn, Indeed, etc.)</li>
            <li>Social media platforms</li>
            <li>Educational resources and blog articles</li>
            <li>Partner services and integrations</li>
          </ul>
          <p>
            <strong>Important:</strong> We do not control these third-party sites and are not responsible for their privacy practices, content, or policies. We encourage you to review the privacy policies of any third-party site you visit.
          </p>

          <h3>12.2 Third-Party Service Providers</h3>
          <p>
            We work with trusted third-party service providers, including:
          </p>
          <ul>
            <li><strong>OpenAI:</strong> AI and language model processing</li>
            <li><strong>Google (Firebase, Analytics):</strong> Infrastructure, authentication, analytics</li>
            <li><strong>Stripe/PayPal:</strong> Payment processing</li>
            <li><strong>Email Service Providers:</strong> Transactional and marketing emails</li>
            <li><strong>Cloud Storage Providers:</strong> Data hosting and backups</li>
            <li><strong>CDN Providers:</strong> Content delivery and performance</li>
            <li><strong>Security Providers:</strong> DDoS protection, fraud prevention</li>
          </ul>
          <p>
            All third-party providers are:
          </p>
          <ul>
            <li>Carefully vetted for security and privacy practices</li>
            <li>Bound by contractual obligations to protect your data</li>
            <li>Required to use data only for specified purposes</li>
            <li>Subject to our data security standards</li>
          </ul>

          <h3>12.3 Social Media Integration</h3>
          <p>
            Our Service may include social media features such as:
          </p>
          <ul>
            <li>Share buttons for LinkedIn, Twitter, Facebook</li>
            <li>Social media login options (Google OAuth)</li>
            <li>Embedded social media content</li>
          </ul>
          <p>
            These features may collect your IP address, pages you visit, and set cookies. Social media features are governed by the privacy policies of the respective social media companies.
          </p>

          <h3>12.4 Analytics and Advertising Partners</h3>
          <p>
            We use third-party analytics and advertising services:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
            <li><strong>Advertising Networks:</strong> Display relevant ads (if applicable)</li>
            <li><strong>Conversion Tracking:</strong> Measure advertising effectiveness</li>
          </ul>
          <p>
            You can opt out of Google Analytics by installing the Google Analytics Opt-Out Browser Add-on: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a>
          </p>

          <h3>12.5 No Responsibility for Third Parties</h3>
          <p>
            We are not responsible for:
          </p>
          <ul>
            <li>Privacy practices of third-party websites or services</li>
            <li>Content provided by third parties</li>
            <li>Data security of third-party platforms</li>
            <li>Changes to third-party policies or practices</li>
          </ul>
          <p>
            Your interactions with third parties are at your own risk. We encourage you to read their privacy policies before providing information.
          </p>
        </section>

        <section>
          <h2>13. AI and Data Processing Details</h2>
          <p>
            RankKit uses artificial intelligence (OpenAI's GPT models) to optimize and generate content. This section provides detailed information about how AI processes your data.
          </p>

          <h3>13.1 How AI Processing Works</h3>
          <p>When you use our optimization features:</p>
          <ul>
            <li>Your content is sent securely to OpenAI's API via encrypted HTTPS connection</li>
            <li>OpenAI's models analyze your content and generate improved versions</li>
            <li>Results are returned to our servers and displayed to you</li>
            <li>You can accept, modify, or reject the AI-generated content</li>
            <li>Accepted content is saved to your account; rejected content is discarded</li>
          </ul>

          <h3>13.2 OpenAI Data Handling</h3>
          <p>
            According to OpenAI's API Data Usage Policy:
          </p>
          <ul>
            <li>Data sent via API is NOT used to train OpenAI's public models</li>
            <li>API data is retained for a maximum of 30 days for abuse and misuse monitoring</li>
            <li>After 30 days, data is automatically deleted from OpenAI's systems</li>
            <li>OpenAI may retain data longer only if required by law</li>
            <li>OpenAI implements security measures comparable to ours</li>
          </ul>
          <p>
            Full OpenAI Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">https://openai.com/privacy</a>
          </p>

          <h3>13.3 Our Use of AI Data</h3>
          <p>
            We may use aggregated, anonymized data from AI interactions to:
          </p>
          <ul>
            <li>Improve prompt engineering and AI response quality</li>
            <li>Measure feature effectiveness and user satisfaction</li>
            <li>Identify common use cases and user needs</li>
            <li>Detect and prevent abuse or misuse of AI features</li>
            <li>Generate usage statistics and analytics</li>
          </ul>
          <p>
            We do NOT:
          </p>
          <ul>
            <li>Share your specific content with other users</li>
            <li>Use your content for marketing without permission</li>
            <li>Train public AI models on your personal content</li>
            <li>Sell or license your content to third parties</li>
          </ul>

          <h3>13.4 AI Limitations and Disclaimers</h3>
          <ul>
            <li>AI-generated content may contain errors or inaccuracies</li>
            <li>AI suggestions are not professional advice</li>
            <li>You are responsible for reviewing and verifying all AI outputs</li>
            <li>AI may occasionally generate inappropriate or unexpected content</li>
            <li>AI performance may vary based on input quality and context</li>
          </ul>

          <h3>13.5 Opting Out of AI Features</h3>
          <p>
            You can choose not to use AI features by:
          </p>
          <ul>
            <li>Simply not using the optimization tools</li>
            <li>Manually editing documents without AI assistance</li>
            <li>Contacting us to disable AI features for your account</li>
          </ul>
          <p>
            Note: Some basic Service functionality may still use AI for spam detection or security purposes.
          </p>
        </section>

        <section>
          <h2>14. California Privacy Rights (CCPA/CPRA)</h2>
          <p>
            If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). This section explains your rights and how to exercise them.
          </p>

          <h3>14.1 California Consumer Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Right to Know:</strong> Request disclosure of personal information we collected, including categories, sources, purposes, and third parties we shared it with</li>
            <li><strong>Right to Access:</strong> Obtain a copy of the specific personal information we hold about you</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
            <li><strong>Right to Opt-Out of Sale:</strong> Opt out of the sale of personal information (we do not sell data)</li>
            <li><strong>Right to Opt-Out of Sharing:</strong> Opt out of sharing for cross-context behavioral advertising</li>
            <li><strong>Right to Limit Sensitive Personal Information:</strong> Limit use of sensitive personal information</li>
            <li><strong>Right to Non-Discrimination:</strong> Not receive discriminatory treatment for exercising your CCPA rights</li>
          </ul>

          <h3>14.2 Categories of Personal Information</h3>
          <p>We collect the following categories of personal information:</p>
          <ul>
            <li>Identifiers (name, email, IP address, device ID)</li>
            <li>Commercial information (subscription history, payment records)</li>
            <li>Internet activity (browsing history, interactions with our Service)</li>
            <li>Geolocation data (general location based on IP address)</li>
            <li>Professional or employment information (resume content, job titles)</li>
            <li>Education information (degrees, schools, certifications)</li>
            <li>Inferences (preferences, characteristics derived from usage)</li>
          </ul>

          <h3>14.3 Business Purposes for Collection</h3>
          <p>We collect and use personal information for:</p>
          <ul>
            <li>Providing, maintaining, and improving the Service</li>
            <li>Personalizing user experience</li>
            <li>Processing transactions and payments</li>
            <li>Customer support and communication</li>
            <li>Security, fraud prevention, and legal compliance</li>
            <li>Analytics and research</li>
            <li>Marketing and advertising (with consent)</li>
          </ul>

          <h3>14.4 Data Retention Periods</h3>
          <p>We retain personal information for:</p>
          <ul>
            <li>Account data: Duration of account plus 30 days</li>
            <li>Transaction records: 7 years (legal requirement)</li>
            <li>Usage logs: 90 days</li>
            <li>Marketing data: Until opt-out or deletion request</li>
          </ul>

          <h3>14.5 Sale and Sharing of Personal Information</h3>
          <p>
            <strong>We do NOT sell your personal information.</strong> We do not and will not sell or rent your personal information to third parties for monetary or other valuable consideration.
          </p>
          <p>
            <strong>Sharing:</strong> We may share information with service providers for businesspurposes as described in Section 3.
          </p>

          <h3>14.6 Sensitive Personal Information</h3>
          <p>
            We do not collect or process "sensitive personal information" as defined by CCPA (such as Social Security numbers, precise geolocation, racial or ethnic origin, religious beliefs, or genetic data).
          </p>

          <h3>14.7 Exercising Your California Rights</h3>
          <p>To exercise your CCPA rights:</p>
          <ol>
            <li>Email us at ayersdecker@gmail.com with "California Privacy Rights" in the subject line</li>
            <li>Specify which right(s) you wish to exercise</li>
            <li>Provide information to verify your identity (name, email associated with account)</li>
            <li>We will respond within 45 days (extendable to 90 days with notice)</li>
          </ol>

          <h3>14.8 Authorized Agents</h3>
          <p>
            You may designate an authorized agent to make requests on your behalf. To do so:
          </p>
          <ul>
            <li>Provide written authorization signed by you</li>
            <li>Verify your own identity</li>
            <li>Verify the agent's authority to act on your behalf</li>
          </ul>

          <h3>14.9 Verification Process</h3>
          <p>
            To protect your privacy, we verify your identity before fulfilling requests:
          </p>
          <ul>
            <li>Match information provided to information in our records</li>
            <li>Request additional verification for sensitive requests</li>
            <li>May decline requests we cannot reasonably verify</li>
          </ul>

          <h3>14.10 No Discrimination</h3>
          <p>
            We will not discriminate against you for exercising your CCPA rights. We will not:
          </p>
          <ul>
            <li>Deny goods or services</li>
            <li>Charge different prices or rates</li>
            <li>Provide different quality of service</li>
            <li>Suggest you will receive different prices or quality</li>
          </ul>
          <p>
            However, we may offer financial incentives (e.g., discounts for subscribing to newsletters) that are reasonably related to the value of your data.
          </p>

          <h3>14.11 Shine the Light Law</h3>
          <p>
            Under California's "Shine the Light" law (Civil Code Section 1798.83), California residents can request information about disclosure of personal information to third parties for direct marketing. Since we do not share personal information for direct marketing, this provision does not apply.
          </p>
        </section>

        <section>
          <h2>15. European Privacy Rights (GDPR)</h2>
          <p>
            If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, you have comprehensive rights under the General Data Protection Regulation (GDPR) and equivalent laws.
          </p>

          <h3>15.1 Legal Basis for Processing</h3>
          <p>We process your personal data based on the following legal grounds:</p>
          <ul>
            <li><strong>Contract Performance (Article 6(1)(b)):</strong> Processing necessary to provide the Service you requested and fulfill our contractual obligations</li>
            <li><strong>Legitimate Interests (Article 6(1)(f)):</strong> Processing for our legitimate business interests (e.g., improving the Service, security, fraud prevention, analytics), provided your interests don't override ours</li>
            <li><strong>Consent (Article 6(1)(a)):</strong> Processing based on your explicit consent (e.g., marketing communications, non-essential cookies)</li>
            <li><strong>Legal Obligation (Article 6(1)(c)):</strong> Processing necessary to comply with legal requirements (e.g., tax laws, court orders)</li>
            <li><strong>Vital Interests (Article 6(1)(d)):</strong> Processing necessary to protect life or physical safety (rare circumstances)</li>
          </ul>

          <h3>15.2 Your GDPR Rights</h3>
          <p>You have the following rights under GDPR:</p>
          <ul>
            <li><strong>Right of Access (Article 15):</strong> Obtain confirmation of whether we process your data and receive a copy</li>
            <li><strong>Right to Rectification (Article 16):</strong> Correct inaccurate or incomplete personal data</li>
            <li><strong>Right to Erasure (Article 17):</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Right to Restriction (Article 18):</strong> Request limited processing of your data in certain circumstances</li>
            <li><strong>Right to Data Portability (Article 20):</strong> Receive your data in a structured, machine-readable format and transmit to another controller</li>
            <li><strong>Right to Object (Article 21):</strong> Object to processing based on legitimate interests or for direct marketing</li>
            <li><strong>Rights Related to Automated Decision-Making (Article 22):</strong> Not be subject to decisions based solely on automated processing with significant effects</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
          </ul>

          <h3>15.3 Data Protection Officer</h3>
          <p>
            For GDPR-related inquiries, you can contact our Data Protection Officer (or designated privacy contact):
          </p>
          <ul>
            <li>Email: ayersdecker@gmail.com</li>
            <li>Subject Line: "GDPR Privacy Inquiry" or "Data Protection Officer"</li>
          </ul>

          <h3>15.4 Right to Lodge a Complaint</h3>
          <p>
            You have the right to lodge a complaint with your local supervisory authority (Data Protection Authority) if you believe our processing violates GDPR. Contact information for EU supervisory authorities: <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener noreferrer">EDPB Member List</a>
          </p>

          <h3>15.5 Data Transfers Outside the EEA</h3>
          <p>
            We transfer personal data from the EEA to the United States and other countries. We ensure adequate protection through:
          </p>
          <ul>
            <li><strong>Standard Contractual Clauses (SCCs):</strong> European Commission-approved contractual terms ensuring GDPR-level protection</li>
            <li><strong>Adequacy Decisions:</strong> Transfers to countries recognized by the EU as providing adequate protection</li>
            <li><strong>Supplementary Measures:</strong> Additional technical and organizational measures (encryption, access controls) to ensure data protection</li>
          </ul>

          <h3>15.6 Special Categories of Data</h3>
          <p>
            We do not intentionally collect "special categories" of personal data (racial origin, political opinions, religious beliefs, health data, biometric data, sexual orientation) as defined in Article 9 of GDPR.
          </p>
          <p>
            If such data is inadvertently included in content you submit (e.g., in a resume), it is processed based on:
          </p>
          <ul>
            <li>Your explicit consent (Article 9(2)(a))</li>
            <li>Processing manifestly made public by you (Article 9(2)(e))</li>
          </ul>

          <h3>15.7 Exercising Your GDPR Rights</h3>
          <p>To exercise any GDPR right:</p>
          <ol>
            <li>Email ayersdecker@gmail.com with "GDPR Request" in the subject line</li>
            <li>Specify which right(s) you wish to exercise</li>
            <li>Provide proof of identity (we may request additional verification)</li>
            <li>We will respond within 1 month (extendable to 3 months for complex requests)</li>
          </ol>

          <h3>15.8 Data Processing Addendum</h3>
          <p>
            For business customers requiring a Data Processing Addendum (DPA) under GDPR Article 28, please contact us to execute a formal DPA.
          </p>
        </section>

        <section>
          <h2>16. Other Regional Privacy Rights</h2>
          
          <h3>16.1 Canadian Users (PIPEDA)</h3>
          <p>Canadian residents have rights under the Personal Information Protection and Electronic Documents Act (PIPEDA):</p>
          <ul>
            <li>Right to access personal information held by organizations</li>
            <li>Right to challenge accuracy and completeness of information</li>
            <li>Right to request withdrawal of consent for use of personal information</li>
            <li>Right to file complaints with the Privacy Commissioner of Canada</li>
          </ul>

          <h3>16.2 Australian Users (Privacy Act)</h3>
          <p>Australian residents have rights under the Privacy Act 1988:</p>
          <ul>
            <li>Right to access and correct personal information</li>
            <li>Right to complain to the Office of the Australian Information Commissioner (OAIC)</li>
            <li>Protections under the Australian Privacy Principles (APPs)</li>
          </ul>

          <h3>16.3 Brazilian Users (LGPD)</h3>
          <p>Brazilian residents have rights under Lei Geral de Proteção de Dados (LGPD):</p>
          <ul>
            <li>Right to confirmation of processing and access to data</li>
            <li>Right to correction, anonymization, blocking, or deletion</li>
            <li>Right to data portability</li>
            <li>Right to information about sharing with third parties</li>
            <li>Right to withdraw consent</li>
            <li>Right to lodge complaints with ANPD (National Data Protection Authority)</li>
          </ul>

          <h3>16.4 Other Jurisdictions</h3>
          <p>
            We respect privacy rights under all applicable laws. If you reside in a jurisdiction not specifically mentioned, please contact us to learn about your privacy rights.
          </p>
        </section>

        <section>
          <h2>17. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or Service features. The "Last updated" date at the top indicates when the policy was last revised.
          </p>

          <h3>17.1 Types of Changes</h3>
          <p>We may update this Privacy Policy for reasons including:</p>
          <ul>
            <li>Changes to our data collection or processing practices</li>
            <li>New features or services that affect privacy</li>
            <li>Changes in applicable privacy laws and regulations</li>
            <li>Improved clarity or transparency in our practices</li>
            <li>Changes to third-party service providers</li>
            <li>Corporate transactions (mergers, acquisitions)</li>
            <li>User feedback and industry best practices</li>
          </ul>

          <h3>17.2 Notice of Material Changes</h3>
          <p>
            For material changes that significantly affect your rights or how we use your data, we will provide prominent notice through:
          </p>
          <ul>
            <li>Email notification to your registered email address (at least 30 days before the change takes effect)</li>
            <li>Prominent banner or notification on our website</li>
            <li>In-app notification when you log in</li>
            <li>Pop-up requiring acknowledgment for significant changes</li>
          </ul>

          <h3>17.3 Review and Acceptance</h3>
          <p>
            We encourage you to review this Privacy Policy periodically. Your options after notification of changes:
          </p>
          <ul>
            <li><strong>Accept:</strong> Continue using the Service (constitutes acceptance of updated Privacy Policy)</li>
            <li><strong>Object:</strong> Contact us with concerns or questions about changes</li>
            <li><strong>Delete Account:</strong> Delete your account if you do not agree with the changes</li>
          </ul>

          <h3>17.4 Historical Versions</h3>
          <p>
            We maintain archived versions of previous Privacy Policies. To request access to historical versions, contact us at ayersdecker@gmail.com.
          </p>

          <h3>17.5 Effective Date of Changes</h3>
          <p>
            Changes become effective:
          </p>
          <ul>
            <li>For minor, non-material changes: Immediately upon posting</li>
            <li>For material changes: 30 days after notice (or as required by applicable law)</li>
            <li>For changes requiring consent: Only after you provide explicit consent</li>
          </ul>
        </section>

        <section>
          <h2>18. Contact Us and Privacy Inquiries</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, we encourage you to contact us. We are committed to resolving your privacy concerns promptly and transparently.
          </p>

          <h3>18.1 Contact Information</h3>
          <ul>
            <li><strong>Primary Contact Email:</strong> ayersdecker@gmail.com</li>
            <li><strong>Website:</strong> https://www.rankkit.net</li>
            <li><strong>Data Protection Officer:</strong> ayersdecker@gmail.com (for GDPR inquiries)</li>
          </ul>

          <h3>18.2 Types of Inquiries We Handle</h3>
          <p>Contact us regarding:</p>
          <ul>
            <li>General privacy questions and clarifications</li>
            <li>Data access, correction, or deletion requests</li>
            <li>Exercising your privacy rights (CCPA, GDPR, etc.)</li>
            <li>Data breach notifications or security concerns</li>
            <li>Complaints about privacy practices</li>
            <li>Third-party service provider inquiries</li>
            <li>Consent withdrawal requests</li>
            <li>Questions about international data transfers</li>
            <li>Marketing opt-out requests</li>
          </ul>

          <h3>18.3 Response Timeline</h3>
          <p>We commit to responding to privacy inquiries in a timely manner:</p>
          <ul>
            <li><strong>General Inquiries:</strong> Within 5 business days</li>
            <li><strong>Data Rights Requests:</strong> Within 30 days (or as required by applicable law)</li>
            <li><strong>GDPR Requests:</strong> Within 1 month (extendable to 3 months for complex requests)</li>
            <li><strong>CCPA Requests:</strong> Within 45 days (extendable to 90 days with notice)</li>
            <li><strong>Security Incidents:</strong> As soon as possible, typically within 72 hours</li>
          </ul>

          <h3>18.4 Information to Include in Your Request</h3>
          <p>To help us process your inquiry efficiently, please include:</p>
          <ul>
            <li>Your full name and email address associated with your account</li>
            <li>Clear description of your inquiry or request</li>
            <li>Specific privacy right you wish to exercise (if applicable)</li>
            <li>Relevant subject line (e.g., "GDPR Request," "California Privacy Rights," "Privacy Inquiry")</li>
            <li>Any additional information that helps verify your identity</li>
          </ul>

          <h3>18.5 Alternative Contact Methods</h3>
          <p>
            If you prefer not to use email or need to reach us for legal matters:
          </p>
          <ul>
            <li><strong>In-App Support:</strong> Contact us through the help/support feature in your account</li>
            <li><strong>Account Settings:</strong> Many privacy choices can be managed directly in Account Settings</li>
          </ul>

          <h3>18.6 Escalation Process</h3>
          <p>
            If you're not satisfied with our response:
          </p>
          <ul>
            <li>Request to speak with a supervisor or our Data Protection Officer</li>
            <li>File a complaint with the relevant regulatory authority (see rights sections above)</li>
            <li>Seek independent legal advice</li>
          </ul>
        </section>

        <section>
          <h2>19. Data Breach Notification and Security Incidents</h2>
          <p>
            We take data security seriously and have implemented comprehensive measures to prevent data breaches. However, in the unlikely event of a security incident that affects your personal information, we are committed to transparency and prompt notification.
          </p>

          <h3>19.1 Our Breach Response Process</h3>
          <p>In the event of a data breach, we will:</p>
          <ul>
            <li>Investigate the incident immediately upon discovery</li>
            <li>Contain and remediate the breach as quickly as possible</li>
            <li>Assess the scope, nature, and potential impact of the incident</li>
            <li>Identify which users and what data were affected</li>
            <li>Document the incident and response actions taken</li>
            <li>Implement additional security measures to prevent recurrence</li>
            <li>Cooperate with law enforcement and regulatory authorities</li>
          </ul>

          <h3>19.2 Notification to Affected Users</h3>
          <p>If your personal information was compromised, we will notify you:</p>
          <ul>
            <li><strong>Timing:</strong> Within 72 hours of discovering the breach (or as required by applicable law)</li>
            <li><strong>Method:</strong> Via email to your registered email address, with in-app notification and website banner</li>
            <li><strong>Content:</strong> Description of what happened, what data was affected, when it occurred, steps we're taking, and what you should do</li>
          </ul>

          <h3>19.3 Information Included in Breach Notifications</h3>
          <p>Our breach notification will include:</p>
          <ul>
            <li>Date and time of the breach (or estimated timeframe)</li>
            <li>Types of personal information that were compromised</li>
            <li>Number of affected users (if applicable)</li>
            <li>Potential consequences and risks</li>
            <li>Remediation steps we've taken</li>
            <li>Recommended actions for affected users (e.g., change passwords, monitor accounts)</li>
            <li>Contact information for questions and support</li>
            <li>Resources for identity protection (if applicable)</li>
          </ul>

          <h3>19.4 Post-Breach Support and Prevention</h3>
          <p>Following a breach, we will:</p>
          <ul>
            <li>Provide dedicated customer support for affected users</li>
            <li>Offer guidance on protective measures</li>
            <li>Conduct post-incident reviews to improve security</li>
            <li>Comply with all regulatory notification requirements (GDPR, CCPA, state laws)</li>
          </ul>
        </section>

        <section>
          <h2>20. Additional Privacy Topics</h2>

          <h3>20.1 Account Security Best Practices</h3>
          <p>Protect your account by:</p>
          <ul>
            <li>Using a strong, unique password (at least 12 characters with mixed case, numbers, symbols)</li>
            <li>Enabling two-factor authentication (2FA) for added security</li>
            <li>Never sharing your password with anyone</li>
            <li>Logging out of shared or public devices</li>
            <li>Regularly reviewing login history and active sessions</li>
            <li>Being cautious of phishing attempts and suspicious emails</li>
          </ul>

          <h3>20.2 Privacy by Design</h3>
          <p>We incorporate privacy considerations into our product development process:</p>
          <ul>
            <li>Data minimization: Collect only necessary information</li>
            <li>Privacy-friendly defaults: Most privacy-protective settings by default</li>
            <li>User control: Tools to manage your privacy preferences</li>
            <li>Transparency: Clear information about data practices</li>
            <li>Security: Built-in protections at every layer</li>
          </ul>

          <h3>20.3 Research and Testing</h3>
          <p> We may conduct research and testing to improve our Service:</p>
          <ul>
            <li>A/B testing of features using anonymized data</li>
            <li>Usability studies with participant consent</li>
            <li>Academic research collaborations (with anonymized, aggregated data only)</li>
            <li>Beta testing programs requiring opt-in consent</li>
          </ul>

          <h3>20.4 Corporate Transactions</h3>
          <p>In the event RankKit is involved in a corporate transaction:</p>
          <ul>
            <li>Your data may be transferred as a business asset</li>
            <li>We will notify you before the transfer</li>
            <li>The acquiring entity must honor this Privacy Policy</li>
            <li>You will have the option to delete your account before the transfer</li>
          </ul>
        </section>

        <section>
          <h2>21. Your Consent and Agreement</h2>
          <p>
            By using RankKit, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and sharing of your information as described herein.
          </p>
          <p>
            If you do not agree with any part of this Privacy Policy, please discontinue use of the Service immediately.
          </p>
          <p>
            Your continued use of the Service after we make changes to this Privacy Policy constitutes your acceptance of those changes.
          </p>
          <p>
            <strong>Summary of Key Points:</strong>
          </p>
          <ul>
            <li>We collect personal information, usage data, and content you submit</li>
            <li>We use your information to provide and improve the Service</li>
            <li>We do not sell your personal information</li>
            <li>We share data with service providers (OpenAI, Firebase, payment processors) under strict agreements</li>
            <li>We implement strong security measures to protect your data</li>
            <li>You have rights to access, correct, delete, and control your data</li>
            <li>We comply with GDPR, CCPA, and other privacy laws</li>
            <li>We will notify you promptly of any data breaches</li>
            <li>You can contact us anytime with privacy questions or concerns</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
