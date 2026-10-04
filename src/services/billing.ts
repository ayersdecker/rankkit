import { auth } from './firebase';
import { firebaseConfig } from '../config';

async function openBillingSession(action: 'createCheckoutSession' | 'createBillingPortalSession', planId?: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Sign in to manage your subscription.');
  const baseUrl = process.env.REACT_APP_BILLING_API_URL ||
    (firebaseConfig.projectId ? `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net` : '');
  if (!baseUrl) throw new Error('Subscription billing has not been configured yet.');
  const token = await auth.currentUser.getIdToken(true);
  const response = await fetch(`${baseUrl}/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(planId ? { planId } : {})
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Unable to open billing. Please try again.');
  const url = new URL(data.url);
  if (url.protocol !== 'https:' || !['checkout.stripe.com', 'billing.stripe.com'].includes(url.hostname)) {
    throw new Error('Invalid billing session URL.');
  }
  window.location.assign(url.href);
}

export function startSubscriptionCheckout(planId: string): Promise<void> {
  return openBillingSession('createCheckoutSession', planId);
}

export function openBillingPortal(): Promise<void> {
  return openBillingSession('createBillingPortalSession');
}