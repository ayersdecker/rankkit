import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/Shared/ErrorBoundary';
import { PromotionalNotification } from './components/Shared/PromotionalNotification';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentLibrary from './components/Dashboard/DocumentLibrary';
import OptimizationWorkspace from './components/Dashboard/OptimizationWorkspace';
import Profile from './components/Dashboard/Profile';
import CareerToolsDashboard from './modules/CareerTools/CareerToolsDashboard';
import WorkplaceToolsDashboard from './modules/WorkplaceTools/WorkplaceToolsDashboard';
import ResumeOptimizer from './modules/ResumeRank/ResumeOptimizer';
import PostOptimizer from './modules/PostRank/PostOptimizer';
import CoverLetterWriter from './modules/CoverLetter/CoverLetterWriter';
import InterviewPrep from './modules/Interview/InterviewPrep';
import JobSearchAssistant from './modules/JobSearch/JobSearchAssistant';
import ColdEmailGenerator from './modules/WorkplaceTools/ColdEmailGenerator';
import SellingPointsFinder from './modules/WorkplaceTools/SellingPointsFinder';
import SocialMediaToolsDashboard from './modules/SocialMediaTools/SocialMediaToolsDashboard';
import HashtagGenerator from './modules/SocialMediaTools/HashtagGenerator';
import { promotionalNotifications } from './config/notifications';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function NotificationWrapper() {
  const { currentUser } = useAuth();
  
  // Only show notifications to authenticated users
  if (!currentUser) {
    return null;
  }
  
  return (
    <PromotionalNotification 
      notifications={promotionalNotifications}
      intervalMinutes={60}
    />
  );
}

function App() {
  // Use /rankkit basename for GitHub Pages deployment
  const basename = process.env.NODE_ENV === 'production' ? '/rankkit' : '/';
    
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router basename={basename}>
          <NotificationWrapper />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
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
            <Route
              path="/career-tools"
              element={
                <PrivateRoute>
                  <CareerToolsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/workplace-tools"
              element={
                <PrivateRoute>
                  <WorkplaceToolsDashboard />
                </PrivateRoute>
              }
            />
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
              path="/social-media-tools"
              element={
                <PrivateRoute>
                  <SocialMediaToolsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/hashtag-generator"
              element={
                <PrivateRoute>
                  <HashtagGenerator />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
