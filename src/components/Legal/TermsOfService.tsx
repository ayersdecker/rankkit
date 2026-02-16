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
            Welcome to RankKit ("RankKit," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website located at www.rankkit.net and any related services, tools, features, mobile applications, and software (collectively, the "Service").
          </p>
          <p>
            By accessing or using RankKit, creating an account, or clicking "I Agree," you enter into a legally binding agreement with RankKit. If you do not agree with these Terms, you must not access or use the Service.
          </p>
          <p>
            <strong>Important Notice:</strong> These Terms contain provisions that limit our liability to you and require you to resolve disputes with us through binding arbitration on an individual basis (see Section 17). Please read these Terms carefully.
          </p>
          <p>
            These Terms incorporate our Privacy Policy by reference. Any capitalized terms not defined in these Terms have the meanings given in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2>1. Eligibility and Account Requirements</h2>
          
          <h3>1.1 Age Requirement</h3>
          <p>
            You must be at least 18 years old to use RankKit. By using the Service, you represent and warrant that you:
          </p>
          <ul>
            <li>Are at least 18 years of age</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Are not barred from using the Service under applicable laws</li>
            <li>Will comply with these Terms and all applicable laws and regulations</li>
          </ul>

          <h3>1.2 Geographic Restrictions</h3>
          <p>
            The Service may not be available in all countries or regions. We reserve the right to restrict access to the Service from certain jurisdictions without notice.
          </p>

          <h3>1.3 Account Limitations</h3>
          <ul>
            <li>You may only create one account unless expressly authorized for multiple accounts</li>
            <li>Accounts are non-transferable and cannot be sold, traded, or transferred to others</li>
            <li>You cannot impersonate another person or entity</li>
            <li>Business or organizational use may require a separate business account</li>
          </ul>

          <h3>1.4 Restricted Users</h3>
          <p>You may not use the Service if you:</p>
          <ul>
            <li>Have been previously banned or suspended by RankKit</li>
            <li>Are located in a country subject to U.S. government embargo</li>
            <li>Are listed on any U.S. government list of prohibited or restricted parties</li>
            <li>Have engaged in fraudulent activity related to the Service</li>
          </ul>
        </section>

        <section>
          <h2>2. Account Registration and Security</h2>
          
          <h3>2.1 Account Creation</h3>
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Choose a strong, secure password</li>
            <li>Use a valid email address that you can access</li>
            <li>Provide truthful information in your profile</li>
          </ul>

          <h3>2.2 Account Security</h3>
          <p>You are responsible for maintaining the security of your account and password. You agree to:</p>
          <ul>
            <li>Keep your password confidential and not share it with anyone</li>
            <li>Notify us immediately of any unauthorized access or security breach</li>
            <li>Use strong authentication methods, including two-factor authentication if available</li>
            <li>Log out from shared or public computers</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>

          <h3>2.3 Account Responsibility</h3>
          <p>
            You are solely responsible for all activity that occurs under your account, whether or not authorized by you. We are not liable for any loss or damage arising from unauthorized use of your account.
          </p>

          <h3>2.4 Account Verification</h3>
          <p>
            We may require you to verify your email address or provide additional authentication. Failure to verify your account may result in limited access to certain features.
          </p>

          <h3>2.5 Account Suspension or Termination</h3>
          <p>We reserve the right to suspend or terminate your account if:</p>
          <ul>
            <li>You violate these Terms</li>
            <li>We detect fraudulent or suspicious activity</li>
            <li>You fail to pay for subscriptions or services</li>
            <li>We are required to do so by law</li>
            <li>Your account has been inactive for an extended period</li>
          </ul>
        </section>

        <section>
          <h2>3. Acceptable Use of the Service</h2>
          <p>
            You agree to use RankKit only for lawful purposes and in compliance with these Terms and all applicable laws and regulations.
          </p>

          <h3>3.1 Permitted Uses</h3>
          <p>You may use the Service to:</p>
          <ul>
            <li>Create, store, and optimize professional documents (resumes, cover letters, etc.)</li>
            <li>Optimize social media content and posts</li>
            <li>Prepare for job interviews and career development</li>
            <li>Generate business communications and sales materials</li>
            <li>Access career tools and resources</li>
            <li>Use AI-powered optimization features</li>
          </ul>

          <h3>3.2 Prohibited Uses</h3>
          <p>You may NOT use the Service to:</p>
          <ul>
            <li><strong>Violate Laws:</strong> Engage in any illegal activity or violate any local, state, national, or international law</li>
            <li><strong>Infringe Rights:</strong> Violate intellectual property rights, privacy rights, or other rights of third parties</li>
            <li><strong>Harass or Abuse:</strong> Harass, abuse, threaten, or intimidate any person</li>
            <li><strong>Spam or Mislead:</strong> Send spam, chain letters, or unsolicited commercial communications</li>
            <li><strong>Impersonate:</strong> Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
            <li><strong>Distribute Malware:</strong> Transmit viruses, malware, or other harmful code</li>
            <li><strong>Interfere with Service:</strong> Disrupt, overload, or interfere with the operation of the Service</li>
            <li><strong>Reverse Engineer:</strong> Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li><strong>Scrape Content:</strong> Use automated systems (bots, scrapers) to access the Service without permission</li>
            <li><strong>Circumvent Restrictions:</strong> Bypass any access restrictions, rate limits, or security measures</li>
            <li><strong>Sell or Resell:</strong> Resell or commercially exploit the Service without authorization</li>
            <li><strong>Create Fake Accounts:</strong> Create multiple accounts to circumvent restrictions or for fraudulent purposes</li>
            <li><strong>Harmful Content:</strong> Upload content that is illegal, defamatory, obscene, hateful, or discriminatory</li>
            <li><strong>Competitive Use:</strong> Use the Service to build a competing product or service</li>
          </ul>

          <h3>3.3 Content Standards</h3>
          <p>All content you submit must:</p>
          <ul>
            <li>Be accurate and not misleading</li>
            <li>Not violate any third-party rights</li>
            <li>Not contain confidential or proprietary information of others without permission</li>
            <li>Comply with applicable professional and ethical standards</li>
            <li>Not contain malicious code or links to harmful sites</li>
          </ul>

          <h3>3.4 Professional Use</h3>
          <p>
            If using the Service for professional or commercial purposes, you represent that you have all necessary rights, permissions, and licenses to do so.
          </p>

          <h3>3.5 Monitoring and Enforcement</h3>
          <p>
            We reserve the right (but have no obligation) to:
          </p>
          <ul>
            <li>Monitor use of the Service for compliance with these Terms</li>
            <li>Investigate suspected violations</li>
            <li>Remove or disable access to content that violates these Terms</li>
            <li>Suspend or terminate accounts that violate these Terms</li>
            <li>Report violations to law enforcement authorities</li>
            <li>Cooperate with legal investigations</li>
          </ul>

          <h3>3.6 Consequences of Violations</h3>
          <p>Violations of these Terms may result in:</p>
          <ul>
            <li>Warning notifications</li>
            <li>Temporary suspension of account or features</li>
            <li>Permanent termination of account</li>
            <li>Legal action and pursuit of damages</li>
            <li>Reporting to authorities</li>
            <li>Banning from future use of the Service</li>
          </ul>
        </section>

        <section>
          <h2>4. Intellectual Property Rights</h2>
          
          <h3>4.1 Our Intellectual Property</h3>
          <p>
            All content, software, code, designs, graphics, logos, trademarks, branding, and materials on RankKit are owned by or licensed to us and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            Protected materials include but are not limited to:
          </p>
          <ul>
            <li>Website design, layout, and user interface</li>
            <li>Software code and algorithms</li>
            <li>RankKit name, logo, and branding</li>
            <li>AI model configurations and prompts</li>
            <li>Documentation, guides, and educational content</li>
            <li>Features, functionality, and workflows</li>
            <li>Database structure and organization</li>
          </ul>

          <h3>4.2 Limited License to Use</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal or internal business purposes, subject to these Terms.
          </p>
          <p>
            This license does NOT permit you to:
          </p>
          <ul>
            <li>Copy, modify, distribute, sell, or lease any part of the Service</li>
            <li>Create derivative works based on the Service</li>
            <li>Reverse engineer or attempt to extract source code</li>
            <li>Remove or modify any proprietary notices or labels</li>
            <li>Use the Service to build a similar or competing service</li>
            <li>Frame, mirror, or replicate any part of the Service</li>
            <li>Use our trademarks or branding without written permission</li>
          </ul>

          <h3>4.3 Trademark Policy</h3>
          <p>
            "RankKit" and associated logos are trademarks of RankKit. You may not use our trademarks without our prior written consent. Unauthorized use may constitute trademark infringement.
          </p>

          <h3>4.4 DMCA and Copyright Infringement</h3>
          <p>
            We respect intellectual property rights. If you believe content on our Service infringes your copyright, please notify us with:
          </p>
          <ul>
            <li>Your contact information</li>
            <li>Description of the copyrighted work</li>
            <li>Location of the infringing content (URL)</li>
            <li>Statement of good faith belief of infringement</li>
            <li>Statement of accuracy and authorization</li>
            <li>Electronic or physical signature</li>
          </ul>
          <p>
            Send DMCA notices to: ayersdecker@gmail.com with "DMCA Notice" in the subject line.
          </p>

          <h3>4.5 Counter-Notification</h3>
          <p>
            If your content was removed due to a DMCA notice and you believe it was removed in error, you may submit a counter-notification with similar information stating your good faith belief that the content was removed by mistake.
          </p>

          <h3>4.6 Repeat Infringer Policy</h3>
          <p>
            We will terminate the accounts of users who are repeat copyright infringers.
          </p>
        </section>

        <section>
          <h2>5. User Content and Licenses</h2>
          
          <h3>5.1 Your Ownership</h3>
          <p>
            You retain all ownership rights to any content you create, upload, or submit to RankKit ("User Content"). This includes:
          </p>
          <ul>
            <li>Resumes, CVs, and professional documents</li>
            <li>Cover letters and application materials</li>
            <li>Social media posts and content</li>
            <li>Business communications and sales materials</li>
            <li>Profile information and professional links</li>
            <li>Any other text, images, or files you upload</li>
          </ul>

          <h3>5.2 License You Grant to Us</h3>
          <p>
            By submitting User Content, you grant RankKit a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to:
          </p>
          <ul>
            <li>Use, host, store, reproduce, and process your content</li>
            <li>Display your content back to you across devices and platforms</li>
            <li>Process your content through AI models for optimization</li>
            <li>Create backups and derivative works as necessary for Service operation</li>
            <li>Modify or reformat your content for technical compatibility</li>
          </ul>
          <p>
            <strong>Scope of License:</strong> This license is limited to operating and improving the Service. We will not:
          </p>
          <ul>
            <li>Share your specific content with other users (unless you choose to share)</li>
            <li>Sell or license your content to third parties</li>
            <li>Use your content for marketing without your permission</li>
            <li>Publicly display your content without authorization</li>
          </ul>

          <h3>5.3 Your Responsibilities</h3>
          <p>You represent and warrant that:</p>
          <ul>
            <li>You own or have necessary rights to all User Content you submit</li>
            <li>Your User Content does not violate any third-party rights</li>
            <li>Your User Content complies with these Terms and applicable laws</li>
            <li>You have obtained all necessary permissions for content you upload</li>
            <li>Your User Content is accurate and not misleading</li>
          </ul>

          <h3>5.4 Prohibited Content</h3>
          <p>You may not submit content that:</p>
          <ul>
            <li>Violates intellectual property rights</li>
            <li>Contains confidential information without permission</li>
            <li>Is illegal, defamatory, or fraudulent</li>
            <li>Contains viruses or malicious code</li>
            <li>Violates privacy rights of others</li>
            <li>Is hateful, discriminatory, or harassing</li>
          </ul>

          <h3>5.5 Content Removal</h3>
          <p>
            We may remove User Content that violates these Terms, but we have no obligation to monitor or review user-submitted content. You can delete your content at any time through the Service interface.
          </p>

          <h3>5.6 Feedback and Suggestions</h3>
          <p>
            If you provide feedback, suggestions, or ideas about the Service, you grant us an unlimited, irrevocable license to use such feedback without compensation or attribution.
          </p>
        </section>

        <section>
          <h2>6. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains in detail how we collect, use, store, and 
            protect your information. By using the Service, you agree to the Privacy Policy, which is incorporated 
            into these Terms. You can review it at <a href="/privacy">https://www.rankkit.net/privacy</a>.
          </p>
        </section>

        <section>
          <h2>7. Paid Features, Subscriptions, and Billing</h2>
          
          <h3>7.1 Subscription Plans</h3>
          <p>
            RankKit may offer various subscription tiers with different features and pricing. Details about subscription plans, features, and pricing will be displayed on our website and during the purchase process.
          </p>

          <h3>7.2 Payment Terms</h3>
          <p>By purchasing a subscription, you agree to:</p>
          <ul>
            <li>Pay all fees and charges according to the billing terms in effect</li>
            <li>Provide accurate and complete billing information</li>
            <li>Authorize us (or our payment processor) to charge your payment method</li>
            <li>Pay all applicable taxes</li>
            <li>Update your payment information if it changes</li>
          </ul>

          <h3>7.3 Recurring Billing and Automatic Renewal</h3>
          <p>
            Subscriptions automatically renew at the end of each billing cycle unless you cancel before the renewal date. You authorize us to:
          </p>
          <ul>
            <li>Charge your payment method at the beginning of each billing period</li>
            <li>Continue charging until you cancel your subscription</li>
            <li>Update payment amounts if pricing changes (with advance notice)</li>
          </ul>

          <h3>7.4 Free Trials</h3>
          <p>
            We may offer free trials for certain subscription plans. Free trial terms:
          </p>
          <ul>
            <li>You must provide payment information to start a free trial</li>
            <li>You will be charged automatically when the trial ends unless you cancel</li>
            <li>We may limit free trials to first-time subscribers only</li>
            <li>Free trial offers may be changed or discontinued at any time</li>
          </ul>

          <h3>7.5 Price Changes</h3>
          <p>
            We reserve the right to change subscription pricing with at least 30 days' notice. Price changes will not affect your current billing cycle but will apply to subsequent renewals. You may cancel before the price change takes effect.
          </p>

          <h3>7.6 Refund Policy</h3>
          <p>
            Payments are generally non-refundable except:
          </p>
          <ul>
            <li>As required by applicable law</li>
            <li>If we terminate your account without cause</li>
            <li>At our sole discretion for extraordinary circumstances</li>
          </ul>
          <p>
            Refund requests must be submitted within 30 days of payment to ayersdecker@gmail.com with "Refund Request" in the subject line.
          </p>

          <h3>7.7 Cancellation</h3>
          <p>
            You may cancel your subscription at any time through Account Settings. Upon cancellation:
          </p>
          <ul>
            <li>You will retain access to paid features until the end of your current billing period</li>
            <li>No refunds will be provided for partial billing periods</li>
            <li>Automatic renewal will stop</li>
            <li>You may resubscribe at any time</li>
          </ul>

          <h3>7.8 Failed Payments</h3>
          <p>
            If a payment fails:
          </p>
          <ul>
            <li>We will attempt to process the payment again</li>
            <li>We may notify you to update your payment information</li>
            <li>Your access to paid features may be suspended after repeated failures</li>
            <li>Your account may be downgraded to a free plan if payment issues persist</li>
          </ul>

          <h3>7.9 Taxes</h3>
          <p>
            Prices do not include applicable taxes unless stated otherwise. You are responsible for paying all taxes associated with your purchase. We will collect and remit taxes as required by law.
          </p>

          <h3>7.10 Payment Processing</h3>
          <p>
            Payments are processed by third-party payment processors (such as Stripe or PayPal). Your payment information is subject to their privacy policies and terms of service.
          </p>
        </section>

        <section>
          <h2>8. Third-Party Services and Integrations</h2>
          
          <h3>8.1 Third-Party Links</h3>
          <p>
            RankKit may contain links to third-party websites, services, or resources. We do not endorse and are not responsible for:
          </p>
          <ul>
            <li>Content on third-party websites</li>
            <li>Privacy practices of third parties</li>
            <li>Accuracy or reliability of third-party information</li>
            <li>Products or services offered by third parties</li>
          </ul>

          <h3>8.2 Third-Party Services We Use</h3>
          <p>
            The Service integrates with third-party services including:
          </p>
          <ul>
            <li><strong>OpenAI:</strong> For AI-powered content generation and optimization</li>
            <li><strong>Google Firebase:</strong> For authentication and data storage</li>
            <li><strong>Payment Processors:</strong> For subscription billing</li>
            <li><strong>Analytics Providers:</strong> For service analytics and improvements</li>
          </ul>
          <p>
            Your use of these services is subject to their respective terms and policies.
          </p>

          <h3>8.3 No Warranties for Third Parties</h3>
          <p>
            We make no representations or warranties regarding third-party services and disclaim all liability for issues arising from their use.
          </p>

          <h3>8.4 Changes to Third-Party Services</h3>
          <p>
            We may add, remove, or modify third-party integrations at any time. Some features may become unavailable if third-party services change or terminate.
          </p>
        </section>

        <section>
          <h2>9. Disclaimers and Warranties</h2>
          
          <h3>9.1 "AS IS" and "AS AVAILABLE" Basis</h3>
          <p>
            RankKit is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, to the maximum extent permitted by law.
          </p>

          <h3>9.2 Disclaimer of Warranties</h3>
          <p>
            We specifically disclaim all warranties, including but not limited to:
          </p>
          <ul>
            <li><strong>Merchantability:</strong> No warranty that the Service is suitable for your purposes</li>
            <li><strong>Fitness for Particular Purpose:</strong> No guarantee the Service meets your specific needs</li>
            <li><strong>Non-Infringement:</strong> No warranty that the Service doesn't infringe third-party rights</li>
            <li><strong>Accuracy:</strong> No guarantee of accuracy, reliability, or completeness of content or data</li>
            <li><strong>Quality:</strong> No warranty regarding quality of AI-generated content or optimization results</li>
            <li><strong>Availability:</strong> No guarantee of uninterrupted, timely, secure, or error-free access</li>
            <li><strong>Security:</strong> No warranty against viruses, bugs, or security vulnerabilities</li>
            <li><strong>Results:</strong> No guarantee of specific results, outcomes, or job placement</li>
          </ul>

          <h3>9.3 AI-Generated Content Disclaimer</h3>
          <p>
            AI-generated content and optimization suggestions:
          </p>
          <ul>
            <li>May contain errors, inaccuracies, or inappropriate content</li>
            <li>Are not professional advice (career, legal, financial, etc.)</li>
            <li>Should be reviewed and verified before use</li>
            <li>May not be suitable for all purposes</li>
            <li>Are provided as suggestionsonly</li>
            <li>Do not guarantee specific outcomes or employment results</li>
          </ul>

          <h3>9.4 Not Professional Advice</h3>
          <p>
            The Service is not a substitute for professional advice. We do not provide career counseling, legal advice, financial advice, or other professional services. Consult qualified professionals for specific advice.
          </p>

          <h3>9.5 Third-Party Content</h3>
          <p>
            We are not responsible for third-party content, advertisements, or linked websites. Use of third-party content is at your own risk.
          </p>

          <h3>9.6 System Requirements</h3>
          <p>
            You are responsible for obtaining and maintaining all equipment and services needed to access and use the Service, including internet connectivity, compatible devices, and updated browsers.
          </p>

          <h3>9.7 Modifications and Interruptions</h3>
          <p>
            We reserve the right to:
          </p>
          <ul>
            <li>Modify, suspend, or discontinue any part of the Service at any time</li>
            <li>Perform maintenance that may cause temporary interruptions</li>
            <li>Change features, functionality, or interfaces</li>
            <li>Remove or modify content without notice</li>
          </ul>

          <h3>9.8 Beta Features</h3>
          <p>
            Beta or experimental features are provided "as is" without warranty and may be unstable or incomplete. We may discontinue beta features at any time.
          </p>

          <h3>9.9 Assumption of Risk</h3>
          <p>
            Use of the Service is entirely at your own risk. You assume all risks associated with using the Service, including reliance on AI-generated content, data loss, security breaches, and service interruptions.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          
          <h3>10.1 Maximum Liability Cap</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANKKIT'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE GREATER OF:
          </p>
          <ul>
            <li>(A) THE AMOUNT YOU PAID TO RANKKIT IN THE 12 MONTHS PRECEDING THE CLAIM, OR</li>
            <li>(B) ONE HUNDRED DOLLARS ($100 USD)</li>
          </ul>

          <h3>10.2 Exclusion of Damages</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANKKIT AND ITS OWNERS, EMPLOYEES, AGENTS, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR:
          </p>
          <ul>
            <li><strong>Indirect Damages:</strong> Indirect, incidental, special, exemplary, or consequential damages</li>
            <li><strong>Lost Profits:</strong> Loss of profits, revenue, data, opportunities, or business</li>
            <li><strong>Reputation Harm:</strong> Loss of goodwill or reputation</li>
            <li><strong>Data Loss:</strong> Loss, corruption, or unauthorized access to data</li>
            <li><strong>Substitute Services:</strong> Cost of substitute goods or services</li>
            <li><strong>Employment Issues:</strong> Failure to obtain employment, promotions, or career advancement</li>
            <li><strong>Content Issues:</strong> Errors or inaccuracies in AI-generated content</li>
            <li><strong>Security Breaches:</strong> Unauthorized access to your account or information</li>
            <li><strong>Service Interruptions:</strong> Service downtime, errors, or unavailability</li>
          </ul>
          <p>
            These limitations apply regardless of the legal theory of liability (contract, tort, negligence, strict liability, or otherwise), even if we have been advised of the possibility of such damages.
          </p>

          <h3>10.3 Jurisdictional Limitations</h3>
          <p>
            Some jurisdictions do not allow certain limitations of liability. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
          </p>

          <h3>10.4 Basis of the Bargain</h3>
          <p>
            You acknowledge that we have set our prices and entered into this agreement in reliance upon the limitations of liability and disclaimers of warranties set forth herein, which allocate risk between us and form the basis of the bargain between the parties.
          </p>

          <h3>10.5 Force Majeure</h3>
          <p>
            We are not liable for delays or failures in performance resulting from causes beyond our reasonable control, including: acts of God, natural disasters, war, terrorism, riots, government actions, internet or network failures, power outages, strikes, or pandemics.
          </p>
        </section>

        <section>
          <h2>11. Indemnification</h2>
          
          <h3>11.1 Your Indemnification Obligation</h3>
          <p>
            You agree to indemnify, defend, and hold harmless RankKit, its owners, officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all:
          </p>
          <ul>
            <li>Claims, demands, actions, or proceedings</li>
            <li>Losses, liabilities, damages, judgments, or settlements</li>
            <li>Costs and expenses (including reasonable attorneys' fees)</li>
          </ul>

          <h3>11.2 Indemnification Triggers</h3>
          <p>Your indemnification obligation applies to claims arising from or related to:</p>
          <ul>
            <li>Your use or misuse of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any law or regulation</li>
            <li>Your violation of any third-party rights (intellectual property, privacy, publicity, etc.)</li>
            <li>Any User Content you submit</li>
            <li>Your breach of any representation or warranty</li>
            <li>Your negligence or willful misconduct</li>
            <li>Claims by third parties related to your use of the Service</li>
          </ul>

          <h3>11.3 Defense and Settlement</h3>
          <p>
            We reserve the right, at our expense, to assume exclusive defense and control of any matter subject to indemnification by you. You agree to cooperate with our defense of such claims. You may not settle any claim without our prior written consent.
          </p>

          <h3>11.4 Notification</h3>
          <p>
            We will notify you of any claim, demand, or action subject to your indemnification obligation. However, our failure to notify you promptly does not relieve your obligations except to the extent you are prejudiced by such failure.
          </p>
        </section>

        <section>
          <h2>12. Termination and Suspension</h2>
          
          <h3>12.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by:
          </p>
          <ul>
            <li>Using the account deletion feature in Account Settings</li>
            <li>Contacting us at ayersdecker@gmail.com</li>
            <li>Simply ceasing to use the Service (though your account may remain active)</li>
          </ul>
          <p>
            Upon termination, you will lose access to all paid features, content, and account data.
          </p>

          <h3>12.2 Termination by Us</h3>
          <p>
            We may terminate or suspend your account immediately, with or without notice, for any reason including:
          </p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Fraudulent, abusive, or illegal activity</li>
            <li>Failure to pay for subscriptions</li>
            <li>Prolonged inactivity(at our discretion)</li>
            <li>Risk to the security or integrity of the Service</li>
            <li>Request by law enforcement or regulatory authorities</li>
            <li>Unexpected technical or security issues</li>
            <li>Discontinuation of the Service</li>
          </ul>

          <h3>12.3 Effect of Termination</h3>
          <p>
            Upon termination of your account:
          </p>
          <ul>
            <li>Your right to use the Service immediately ceases</li>
            <li>We may delete your account and all associated data within 30 days</li>
            <li>You remain responsible for all charges incurred before termination</li>
            <li>Provisions that should survive termination will continue to apply</li>
            <li>No refunds will be provided for prepaid subscriptions (unless required by law)</li>
            <li>You may not create a new account if terminated for cause</li>
          </ul>

          <h3>12.4 Survival of Terms</h3>
          <p>
            The following provisions survive termination:
          </p>
          <ul>
            <li>Intellectual Property Rights (Section 4)</li>
            <li>User Content licenses granted to us (Section 5)</li>
            <li>Disclaimers and Warranties (Section 9)</li>
            <li>Limitation of Liability (Section 10)</li>
            <li>Indemnification (Section 11)</li>
            <li>Dispute Resolution and Arbitration (Section 17)</li>
            <li>Governing Law (Section 18)</li>
            <li>Any payment obligations incurred before termination</li>
          </ul>

          <h3>12.5 Data Retention After Termination</h3>
          <p>
            After termination, we may retain:
          </p>
          <ul>
            <li>Backup copies of your data for up to 90 days</li>
            <li>Information required for legal or regulatory compliance</li>
            <li>Anonymized, aggregated data for analytics</li>
            <li>Records of transactions and communications</li>
          </ul>

          <h3>12.6 Account Reactivation</h3>
          <p>
            If you deactivate your account voluntarily, you may be able to reactivate it within 30 days by contacting us. After 30 days, data may be permanently deleted.
          </p>
        </section>

        <section>
          <h2>13. Changes to These Terms</h2>
          
          <h3>13.1 Right to Modify</h3>
          <p>
            We reserve the right to modify, amend, or update these Terms at any time at our sole discretion. We will update the "Last updated" date at the top of these Terms when changes are made.
          </p>

          <h3>13.2 Notification of Changes</h3>
          <p>
            For material changes, we will provide notice through:
          </p>
          <ul>
            <li>Email notification to your registered email address (at least 15 days before changes take effect)</li>
            <li>Prominent notice on our website or in the Service</li>
            <li>In-app notification when you log in</li>
            <li>Pop-up requiring acknowledgment for significant changes</li>
          </ul>

          <h3>13.3 Acceptance of Changes</h3>
          <p>
            Your continued use of the Service after changes become effective constitutes your acceptance of the updated Terms. If you do not agree with the changes:
          </p>
          <ul>
            <li>You must stop using the Service</li>
            <li>You may delete your account before the changes take effect</li>
            <li>Contact us with questions or concerns about the changes</li>
          </ul>

          <h3>13.4 Effective Date of Changes</h3>
          <p>
            Changes become effective:
          </p>
          <ul>
            <li>For minor updates: Immediately upon posting</li>
            <li>For material changes: On the date specified in the notice (typically 15-30 days after notification)</li>
          </ul>

          <h3>13.5 Historical Versions</h3>
          <p>
            We maintain archives of previous versions of these Terms. To review historical versions, contact us at ayersdecker@gmail.com.
          </p>
        </section>

        <section>
          <h2>14. Communications and Notices</h2>
          
          <h3>14.1 Electronic Communications</h3>
          <p>
            By using the Service, you consent to receive electronic communications from us, including:
          </p>
          <ul>
            <li>Transactional emails (account confirmations, password resets, receipts)</li>
            <li>Service notifications (updates, maintenance, security alerts)</li>
            <li>Legal notices (Terms changes, Privacy Policy updates)</li>
            <li>Marketing communications (if you opt in)</li>
          </ul>
          <p>
            You agree that all electronic communications satisfy any legal requirement that communications be in writing.
          </p>

          <h3>14.2 Opting Out of Marketing</h3>
          <p>
            You can opt out of promotional emails by clicking "unsubscribe" in any marketing email or updating preferences in Account Settings. You cannot opt out of transactional or legal notices.
          </p>

          <h3>14.3 Notices to Us</h3>
          <p>
            Send legal notices to us via email at ayersdecker@gmail.com with appropriate subject lines (e.g., "Legal Notice," "Terms Inquiry").
          </p>

          <h3>14.4 Notice Address</h3>
          <p>
            We will send notices to the email address associated with your account. You must keep your email address current.
          </p>
        </section>

        <section>
          <h2>15. Export Controls and Sanctions</h2>
          <p>
            The Service may be subject to export control and economic sanctions laws of the United States and other jurisdictions. You represent and warrant that:
          </p>
          <ul>
            <li>You are not located in a country subject to U.S. government embargo</li>
            <li>You are not on any U.S. government list of prohibited or restricted parties</li>
            <li>You will comply with all applicable export control and sanctions laws</li>
            <li>You will not use the Service for any prohibited end-use (e.g., weapons development)</li>
          </ul>
        </section>

        <section>
          <h2>16. Accessibility</h2>
          <p>
            We strive to make the Service accessible to users with disabilities. If you encounter accessibility barriers, please contact us at ayersdecker@gmail.com with "Accessibility" in the subject line.
          </p>
        </section>

        <section>
          <h2>17. Dispute Resolution and Arbitration</h2>
          
          <h3>17.1 Informal Resolution</h3>
          <p>
            If you have a dispute with RankKit, you agree to first contact us at ayersdecker@gmail.com with a detailed description of the dispute. We will attempt to resolve the dispute informally within 60 days.
          </p>

          <h3>17.2 Binding Arbitration</h3>
          <p>
            If we cannot resolve the dispute informally, any dispute arising from or relating to these Terms or the Service shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
          </p>

          <h3>17.3 Arbitration Procedures</h3>
          <ul>
            <li>Arbitration will be conducted by a single arbitrator</li>
            <li>Arbitration will be conducted in English</li>
            <li>The arbitrator's decision shall be final and binding</li>
            <li>Judgment on the award may be entered in any court with jurisdiction</li>
            <li>Each party bears its own costs and attorneys' fees (unless the arbitrator awards them)</li>
          </ul>

          <h3>17.4 Class Action Waiver</h3>
          <p>
            <strong>YOU AND RANKKIT AGREE THAT DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A CLASS ACTION, CONSOLIDATED ACTION, OR REPRESENTATIVE ACTION. Class arbitrations, class actions, private attorney general actions, and consolidation with other arbitrations are not permitted.</strong>
          </p>

          <h3>17.5 Exceptions to Arbitration</h3>
          <p>
            The following claims are not subject to arbitration:
          </p>
          <ul>
            <li>Claims in small claims court that fall within its jurisdiction</li>
            <li>Claims for injunctive relief related to intellectual property infringement</li>
            <li>Claims that cannot be arbitrated as a matter of law</li>
          </ul>

          <h3>17.6 Waiver of Jury Trial</h3>
          <p>
            YOU AND RANKKIT WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND RECEIVE A JUDGE OR JURY TRIAL. You and RankKit agree that any claims not subject to arbitration will be resolved by a judge, not a jury.
          </p>

          <h3>17.7 Opt-Out Right</h3>
          <p>
            You may opt out of this arbitration agreement by sending written notice to ayersdecker@gmail.com within 30 days of first accepting these Terms. Your notice must include your name, email, and clear statement that you wish to opt out of arbitration.
          </p>
        </section>

        <section>
          <h2>18. Governing Law and Jurisdiction</h2>
          
          <h3>18.1 Governing Law</h3>
          <p>
            These Terms and any disputes arising from or related to the Service shall be governed by and construed in accordance with the laws of the United States and the State of [Your State], without regard to conflict of law principles.
          </p>

          <h3>18.2 Venue</h3>
          <p>
            For any disputes not subject to arbitration, you agree to submit to the exclusive jurisdiction of the state and federalcourts located in [Your County/State].
          </p>

          <h3>18.3 Waiver of Conflict of Laws</h3>
          <p>
            The application of the United Nations Convention on Contracts for the International Sale of Goods is expressly excluded.
          </p>
        </section>

        <section>
          <h2>19. Miscellaneous Provisions</h2>
          
          <h3>19.1 Entire Agreement</h3>
          <p>
            These Terms, together with our Privacy Policy and any other legal notices or agreements posted on the Service, constitute the entire agreement between you and RankKit regarding the Service and supersede all prior agreements and understandings.
          </p>

          <h3>19.2 Severability</h3>
          <p>
            If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
          </p>

          <h3>19.3 Waiver</h3>
          <p>
            No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
          </p>

          <h3>19.4 Assignment</h3>
          <p>
            You may not assign, transfer, or delegate these Terms or your rights and obligations hereunder without our prior written consent. We may assign these Terms without restriction, including in connection with a merger, acquisition, or sale of assets.
          </p>

          <h3>19.5 No Third-Party Beneficiaries</h3>
          <p>
            These Terms do not create any third-party beneficiary rights. Only you and RankKit may enforce these Terms.
          </p>

          <h3>19.6 Relationship of Parties</h3>
          <p>
            These Terms do not create a partnership, joint venture, employment, or agency relationship between you and RankKit. You have no authority to bind RankKit in any manner.
          </p>

          <h3>19.7 Headings</h3>
          <p>
            Section headings are for convenience only and do not affect the interpretation of these Terms.
          </p>

          <h3>19.8 Language</h3>
          <p>
            These Terms are drafted in English. If translated into other languages, the English version shall control in the event of any conflict or inconsistency.
          </p>

          <h3>19.9 Force Majeure</h3>
          <p>
            Neither party shall be liable for delays or failures in performance resulting from causes beyond reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
          </p>

          <h3>19.10 Electronic Signatures</h3>
          <p>
            Your acceptance of these Terms by clicking "I Agree" or using the Service constitutes your electronic signature and agreement to be bound by these Terms with the same force and effect as a manually executed signature.
          </p>

          <h3>19.11 Statute of Limitations</h3>
          <p>
            You agree that any claim or cause of action arising from or related to the Service or these Terms must be filed within one (1) year after the claim or cause of action arose, or it shall be forever barred, regardless of any statute or law to the contrary.
          </p>

          <h3>19.12 Regulatory Compliance</h3>
          <p>
            The Service is controlled and operated from the United States. We make no representations that the Service is appropriate or available for use in other locations. Those who access the Service from other locations do so on their own initiative and are responsible for compliance with local laws.
          </p>

          <h3>19.13 Government Use</h3>
          <p>
            If you are a U.S. government entity, the Service is a "Commercial Item" as defined at 48 C.F.R. §2.101 and is provided with only those rights as are granted to end users pursuant to these Terms.
          </p>

          <h3>19.14 Interpretation</h3>
          <p>
            In the event of any ambiguity or inconsistency, these Terms shall not be construed more strictly against either party and shall be interpreted fairly and reasonably.
          </p>
        </section>

        <section>
          <h2>20. Contact Information</h2>
          <p>
            If you have questions, concerns, or feedback about these Terms or the Service, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> ayersdecker@gmail.com</li>
            <li><strong>Website:</strong> https://www.rankkit.net</li>
            <li><strong>Subject Lines for Specific Issues:</strong>
              <ul>
                <li>"Terms Inquiry" - General questions about Terms</li>
                <li>"Legal Notice" - Formal legal notifications</li>
                <li>"DMCA Notice" - Copyright infringement claims</li>
                <li>"Account Issue" - Account-related problems</li>
                <li>"Refund Request" - Payment and refund inquiries</li>
                <li>"Privacy Concern" - Data privacy questions</li>
              </ul>
            </li>
          </ul>
          <p>
            We will respond to inquiries as promptly as possible, typically within 5-10 business days.
          </p>
        </section>

        <section>
          <h2>Acknowledgment</h2>
          <p>
            BY USING RANKKIT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SERVICE.
          </p>
          <p>
            <strong>Key Points Summary:</strong>
          </p>
          <ul>
            <li>You must be 18+ to use RankKit</li>
            <li>You are responsible for account security and all activities under your account</li>
            <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
            <li>We own all intellectual property in the Service; you retain ownership of your content</li>
            <li>Subscriptions automatically renew; payments are generally non-refundable</li>
            <li>The Service is provided "as is" without warranties</li>
            <li>Our liability is limited to the amount you paid in the past 12 months (max $100)</li>
            <li>Disputes are resolved through individual binding arbitration (with opt-out right)</li>
            <li>We may modify these Terms with notice; continued use means acceptance</li>
            <li>We may terminate your account for violations or at our discretion</li>
          </ul>
          <p>
            Thank you for using RankKit!
          </p>
        </section>
      </div>
    </div>
  );
}
