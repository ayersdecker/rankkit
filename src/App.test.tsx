import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAuth } from './hooks/useAuth';
import { SubscriptionBoundary } from './components/Shared/SubscriptionBoundary';

let mockPathname = '/documents';
const mockNavigate = jest.fn();
jest.mock('./hooks/useAuth', () => ({ useAuth: jest.fn() }));
jest.mock('./config', () => ({ isWhitelistedEmail: () => false }));
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
  useNavigate: () => mockNavigate,
  Navigate: () => <div>Sign in required</div>
}), { virtual: true });
jest.mock('./components/Shared/PaywallModal', () => ({
  PaywallModal: ({ onClose }: { onClose: () => void }) => <button onClick={onClose}>Subscription required</button>
}));

const mockUseAuth = useAuth as jest.Mock;
const freeUser = { uid: 'user', email: 'free@example.com', isPremium: false, subscriptionPlan: 'free' };

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ currentUser: freeUser, loading: false });
});

test('free accounts can open document management', () => {
  mockPathname = '/documents';
  render(<SubscriptionBoundary><div>Document management</div></SubscriptionBoundary>);
  expect(screen.getByText('Document management')).toBeInTheDocument();
});

test.each(['/career-tools', '/workplace-tools', '/social-media-tools', '/job-search', '/post-optimizer', '/optimize/document'])('free accounts cannot mount paid features at %s', path => {
  mockPathname = path;
  const onMount = jest.fn();
  function Tool() {
    onMount();
    return <div>AI document search</div>;
  }
  render(<SubscriptionBoundary><Tool /></SubscriptionBoundary>);
  expect(onMount).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText('Subscription required'));
  expect(mockNavigate).toHaveBeenCalledWith('/documents');
});

test('an active plan can mount its subscribed tool', () => {
  mockPathname = '/job-search';
  mockUseAuth.mockReturnValue({ currentUser: { ...freeUser, subscriptionPlan: 'career', subscriptionStatus: 'active', subscriptionValidUntil: Date.now() + 60000 }, loading: false });
  render(<SubscriptionBoundary><div>AI document search</div></SubscriptionBoundary>);
  expect(screen.getByText('AI document search')).toBeInTheDocument();
});

test('other paid categories remain locked', () => {
  mockPathname = '/post-optimizer';
  mockUseAuth.mockReturnValue({ currentUser: { ...freeUser, subscriptionPlan: 'career', subscriptionStatus: 'active', subscriptionValidUntil: Date.now() + 60000 }, loading: false });
  render(<SubscriptionBoundary><div>Social tool</div></SubscriptionBoundary>);
  expect(screen.queryByText('Social tool')).not.toBeInTheDocument();
});

test('signed-out users must authenticate before paid features', () => {
  mockPathname = '/job-search';
  mockUseAuth.mockReturnValue({ currentUser: null, loading: false });
  render(<SubscriptionBoundary><div>AI document search</div></SubscriptionBoundary>);
  expect(screen.getByText('Sign in required')).toBeInTheDocument();
});
