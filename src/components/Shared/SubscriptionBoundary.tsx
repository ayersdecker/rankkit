import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPremiumAccess } from '../../utils/premiumUtils';
import { getNotificationCategory, hasCategorySubscription } from '../../utils/subscriptionVisibility';
import { PaywallModal } from './PaywallModal';

export function SubscriptionBoundary({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const category = getNotificationCategory(location.pathname);
  const requiresSubscription = !!category || location.pathname.startsWith('/optimize');

  if (!requiresSubscription) return <>{children}</>;
  if (loading) return <div role="status">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  const allowed = category ? hasCategorySubscription(currentUser, category) : hasPremiumAccess(currentUser);
  if (!allowed) {
    return <PaywallModal toolName="AI tools and document search" toolCategory={category || undefined}
      onClose={() => navigate('/documents')} />;
  }
  return <>{children}</>;
}