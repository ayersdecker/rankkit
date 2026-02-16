import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function SuccessDisclaimer() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="legal-content">
        <h1>Success Disclaimer</h1>
        <p className="last-updated">Last updated: February 16, 2026</p>

        <section>
          <h2>No Guarantees of Results</h2>
          <p>
            RankKit provides tools, suggestions, and assistance for optimizing career, workplace, and social media content. However, we make <strong>no guarantees or representations</strong> regarding the success or results you may achieve by using our Service.
          </p>
          <p>
            The success of any content optimization, job application, career advancement, or business opportunity depends on numerous external factors beyond our control, including but not limited to:
          </p>
          <ul>
            <li>Individual skills, experience, and qualifications</li>
            <li>Market conditions and economic factors</li>
            <li>Employer or recruiter preferences and hiring decisions</li>
            <li>Platform algorithm changes and update</li>
            <li>Competition and industry dynamics</li>
            <li>Individual effort and implementation quality</li>
            <li>Timing and external circumstances</li>
          </ul>
        </section>

        <section>
          <h2>AI-Generated Content Limitations</h2>
          <p>
            Our AI-powered suggestions are generated based on patterns and best practices. While we strive for accuracy and relevance, AI-generated content:
          </p>
          <ul>
            <li>May not be suitable for all contexts or audiences</li>
            <li>Should be reviewed and edited by you before use</li>
            <li>May not reflect your unique voice or brand identity</li>
            <li>May contain errors or inaccuracies</li>
            <li>Requires your judgment and customization</li>
          </ul>
        </section>

        <section>
          <h2>User Responsibility</h2>
          <p>
            You are solely responsible for:
          </p>
          <ul>
            <li>The content you create, modify, and publish using RankKit</li>
            <li>Ensuring all content is accurate, original, and compliant with applicable laws</li>
            <li>Verifying all suggestions and recommendations before implementation</li>
            <li>Making independent decisions about using our recommendations</li>
            <li>Understanding that results vary by individual and situation</li>
          </ul>
        </section>

        <section>
          <h2>Testimonials and Case Studies</h2>
          <p>
            Any testimonials, success stories, or case studies provided represent individual experiences and are not typical or guaranteed results. Individual results may vary significantly. We do not warrant that your experience will be similar.
          </p>
        </section>

        <section>
          <h2>No Professional Advice</h2>
          <p>
            RankKit does not provide legal, financial, career, or professional advice. Our Service is provided for informational and optimization purposes only. For important decisions:
          </p>
          <ul>
            <li>Consult a qualified professional in the relevant field</li>
            <li>Seek legal counsel for legal matters</li>
            <li>Consult a financial advisor for financial decisions</li>
            <li>Work with a career coach for career planning</li>
          </ul>
        </section>

        <section>
          <h2>Disclaimer of Warranties</h2>
          <p>
            <strong>RankKit is provided "as is" without warranties of any kind, express or implied, regarding the results, accuracy, reliability, or fitness for a particular purpose of the Service or any suggestions provided.</strong>
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, RankKit and its owners shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service, including but not limited to:
          </p>
          <ul>
            <li>Loss of job opportunities or employment</li>
            <li>Loss of business opportunities or sales</li>
            <li>Loss of followers, engagement, or social media reach</li>
            <li>Loss of reputation or credibility</li>
            <li>Lost profits or revenue</li>
            <li>Any other money damages</li>
          </ul>
        </section>

        <section>
          <h2>Acknowledgment</h2>
          <p>
            By using RankKit, you acknowledge that you have read and understood this Success Disclaimer and that you use the Service at your own risk. You assume all responsibility for the results, or lack thereof, obtained from using RankKit.
          </p>
        </section>
      </div>
    </div>
  );
}
