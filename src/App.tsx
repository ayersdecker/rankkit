import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/Shared/ErrorBoundary';
import { PromotionalNotification } from './components/Shared/PromotionalNotification';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentLibrary from './components/Dashboard/DocumentLibrary';
import OptimizationWorkspace from './components/Dashboard/OptimizationWorkspace';
import Profile from './components/Dashboard/Profile';
import TermsOfService from './components/Legal/TermsOfService';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import SuccessDisclaimer from './components/Legal/SuccessDisclaimer';
import CookiePolicy from './components/Legal/CookiePolicy';
import LegalDisclaimer from './components/Legal/LegalDisclaimer';
import AdminDashboard from './components/Admin/AdminDashboard';
import Footer from './components/Shared/Footer';
import CareerToolsDashboard from './modules/CareerTools/CareerToolsDashboard';
import WorkplaceToolsDashboard from './modules/WorkplaceTools/WorkplaceToolsDashboard';
import ResumeOptimizer from './modules/ResumeRank/ResumeOptimizer';
import PostOptimizer from './modules/PostRank/PostOptimizer';
import CoverLetterWriter from './modules/CoverLetter/CoverLetterWriter';
import InterviewPrep from './modules/Interview/InterviewPrep';
import JobSearchAssistant from './modules/JobSearch/JobSearchAssistant';
import JobApplicationToolkit from './modules/CareerTools/JobApplicationToolkit';
import ColdEmailGenerator from './modules/WorkplaceTools/ColdEmailGenerator';
import SellingPointsFinder from './modules/WorkplaceTools/SellingPointsFinder';
import SalesScriptBuilder from './modules/WorkplaceTools/SalesScriptBuilder';
import ObjectionHandler from './modules/WorkplaceTools/ObjectionHandler';
import PitchPerfect from './modules/WorkplaceTools/PitchPerfect';
import SocialMediaToolsDashboard from './modules/SocialMediaTools/SocialMediaToolsDashboard';
import HashtagGenerator from './modules/SocialMediaTools/HashtagGenerator';
import { promotionalNotifications } from './config/notifications';
import { CookieConsentBanner } from './components/Shared/CookieConsentBanner';
import {
  getNotificationCategory,
  hasCategorySubscription,
  shouldShowSubscribeNotifications
} from './utils/subscriptionVisibility';
import './App.css';

type ThemeMode = 'light' | 'dark' | 'darker';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
}

function NotificationWrapper() {
  const { currentUser } = useAuth();
  
  // Only show notifications to authenticated users
  if (!currentUser) {
    return null;
  }

  const filteredNotifications = promotionalNotifications.filter((notification) => {
    if (notification.type === 'subscribe') {
      return shouldShowSubscribeNotifications(currentUser);
    }

    if (notification.type === 'promotion') {
      const category = getNotificationCategory(notification.linkUrl);
      if (category && hasCategorySubscription(currentUser, category)) {
        return false;
      }
    }

    return true;
  });

  if (filteredNotifications.length === 0) {
    return null;
  }
  
  return (
    <PromotionalNotification 
      notifications={filteredNotifications}
      intervalMinutes={60}
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);

  return null;
}

function App() {
  // Use root basename for custom domain www.rankkit.net
  const basename = '/';
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const savedTheme = window.localStorage.getItem('rankkit-theme');
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'darker') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('rankkit-theme', theme);
  }, [theme]);

  const handleThemeToggle = React.useCallback(() => {
    setTheme((currentTheme) => {
      if (currentTheme === 'light') {
        return 'dark';
      }

      if (currentTheme === 'dark') {
        return 'darker';
      }

      return 'light';
    });
  }, []);
    
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app-shell">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="app-background" aria-hidden="true">
            <div className="starfield layer-one" />
            <div className="starfield layer-two" />
            <div className="starfield layer-three" />
            <div className="nebula haze-one" />
            <div className="nebula haze-two" />
            <div className="orbital orbital-one" />
            <div className="orbital orbital-two" />
            <div className="orbital orbital-three" />
            <div className="ai-node node-one" />
            <div className="ai-node node-two" />
            <div className="ai-node node-three" />
            <div className="ai-node node-four" />
            <div className="data-beam beam-one" />
            <div className="data-beam beam-two" />
            <div className="particle particle-one" />
            <div className="particle particle-two" />
            <div className="particle particle-three" />
          </div>
          <div className="app-content">
            <Router basename={basename}>
              <ScrollToTop />
              <NotificationWrapper />
              <main id="main-content" tabIndex={-1}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/documents"
                    element={
                      <PrivateRoute>
                        <DocumentLibrary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/optimize/:documentId?"
                    element={
                      <PrivateRoute>
                        <OptimizationWorkspace />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/career-tools" element={<CareerToolsDashboard />} />
                  <Route path="/workplace-tools" element={<WorkplaceToolsDashboard />} />
                  <Route
                    path="/cold-email"
                    element={
                      <PrivateRoute>
                        <ColdEmailGenerator />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/selling-points"
                    element={
                      <PrivateRoute>
                        <SellingPointsFinder />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/sales-script"
                    element={
                      <PrivateRoute>
                        <SalesScriptBuilder />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/objection-handler"
                    element={
                      <PrivateRoute>
                        <ObjectionHandler />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/pitch-perfect"
                    element={
                      <PrivateRoute>
                        <PitchPerfect />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/resume-optimizer"
                    element={
                      <PrivateRoute>
                        <ResumeOptimizer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/post-optimizer"
                    element={
                      <PrivateRoute>
                        <PostOptimizer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cover-letter"
                    element={
                      <PrivateRoute>
                        <CoverLetterWriter />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/interview-prep"
                    element={
                      <PrivateRoute>
                        <InterviewPrep />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/job-search"
                    element={
                      <PrivateRoute>
                        <JobSearchAssistant />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/job-application-toolkit"
                    element={
                      <PrivateRoute>
                        <JobApplicationToolkit />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/social-media-tools" element={<SocialMediaToolsDashboard />} />
                  <Route
                    path="/hashtag-generator"
                    element={
                      <PrivateRoute>
                        <HashtagGenerator />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/success-disclaimer" element={<SuccessDisclaimer />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
              <Footer theme={theme} onToggleTheme={handleThemeToggle} />
            </Router>
            <CookieConsentBanner />
          </div>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
