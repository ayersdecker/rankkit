import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateInterviewPrep } from '../../services/openai';
import { canUserOptimize, decrementFreeOptimization } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import { PaywallModal } from '../../components/Shared/PaywallModal';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';
import { shouldShowPaywall } from '../../utils/premiumUtils';
import { useSaveDocument } from '../../utils/useSaveDocument';
import { formatPlainTextDocument } from '../../utils/documentFormatting';
import './InterviewPrep.css';

export default function InterviewPrep() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [includeResume, setIncludeResume] = useState(false);
  const [prepData, setPrepData] = useState<{
    commonQuestions: string[];
    suggestedAnswers: { question: string; answer: string }[];
    questionsToAsk: string[];
    tips: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { saveDocument, saving, saveError, saveSuccess } = useSaveDocument();

  useEffect(() => {
    // Check if user has premium access
    if (shouldShowPaywall(currentUser)) {
      setShowPaywall(true);
    }
  }, [currentUser, navigate]);

  async function handleSave() {
    if (!prepData) return;
    const sections = [
      { heading: 'Interview Tips', content: prepData.tips },
      { heading: 'Common Interview Questions', content: prepData.commonQuestions },
      ...prepData.suggestedAnswers.map((item) => ({
        heading: `Q: ${item.question}`,
        content: `A: ${item.answer}`
      })),
      { heading: 'Questions You Should Ask', content: prepData.questionsToAsk }
    ];
    const formatted = formatPlainTextDocument('Interview Preparation Guide', sections);
    await saveDocument(formatted, 'interview-prep', 'Interview Prep');
  }

  async function handleGenerate() {
    if (!jobDescription) {
      setError('Please provide a job description');
      return;
    }

    if (includeResume && !resume) {
      setError('Please provide your resume or uncheck "Include Resume"');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to generate interview prep');
      return;
    }

    try {
      // Check if user can optimize
      const eligibility = await canUserOptimize(currentUser.uid);
      if (!eligibility.canOptimize) {
        setError(eligibility.reason || 'Unable to generate. Please subscribe to continue.');
        return;
      }

      setError('');
      setLoading(true);

      const result = await generateInterviewPrep({
        jobDescription: jobDescription,
        resumeContent: includeResume ? resume : undefined,
        userId: currentUser.uid
      });

      // Decrement free optimization count
      await decrementFreeOptimization(currentUser.uid);
      
      // Refresh user data to update UI
      await refreshUser();

      setPrepData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate interview prep');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="optimizer-container">
      <nav className="optimizer-nav">
        <h1 onClick={() => navigate('/career-tools')}>← Interview Preparation</h1>
      </nav>

      <div className="optimizer-content">
        <div className="feature-description">
          <p>Get comprehensive interview preparation including common questions, suggested answers, questions to ask, and expert tips tailored to the job.</p>
        </div>

        <div className="interview-prep-layout">
          <div className="input-section">
            <h3>Job Description</h3>
            <textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeResume}
                  onChange={(e) => setIncludeResume(e.target.checked)}
                />
                Include my resume for personalized answers
              </label>
            </div>

            {includeResume && (
              <>
                <h3>Your Resume</h3>
                <textarea
                  placeholder="Paste your resume here for personalized answer suggestions..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={10}
                />
              </>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !jobDescription}
              className="optimize-button"
            >
              {loading ? 'Generating...' : 'Generate Interview Prep'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {saveError && <div className="error-message">{saveError}</div>}
            {saveSuccess && <div className="update-message success">✓ Saved to Documents!</div>}
          </div>

          <div className="output-section interview-output">
            {prepData ? (
              <>
                <div className="prep-section">
                  <h3>💡 Interview Tips</h3>
                  <ul className="tips-list">
                    {prepData.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="prep-section">
                  <h3>❓ Common Interview Questions</h3>
                  <ol className="questions-list">
                    {prepData.commonQuestions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ol>
                </div>

                {prepData.suggestedAnswers.length > 0 && (
                  <div className="prep-section">
                    <h3>💬 Suggested Answer Frameworks</h3>
                    {prepData.suggestedAnswers.map((item, index) => (
                      <div key={index} className="answer-card">
                        <h4>Q: {item.question}</h4>
                        <p className="answer-text">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="prep-section">
                  <h3>🤔 Questions You Should Ask</h3>
                  <ul className="questions-to-ask-list">
                    {prepData.questionsToAsk.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>

                <div className="action-buttons">
                  <button className="secondary-button" onClick={handleSave} disabled={saving}>
                    {saving ? '💾 Saving...' : '💾 Save to Documents'}
                  </button>
                  <button className="secondary-button" onClick={handlePrint}>
                    🖨️ Print Interview Prep
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Provide the job description and click "Generate Interview Prep" to get your personalized interview preparation guide.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner overlay size="small" message="Preparing your interview guide..." />}

      {showPaywall && (
        <PaywallModal
          toolName="Interview Prep"
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
