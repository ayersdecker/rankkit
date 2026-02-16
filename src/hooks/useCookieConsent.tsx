import { useState, useEffect } from 'react';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  preferences: boolean;
}

const DEFAULT_CONSENT: CookieConsent = {
  essential: true, // Always true, user cannot disable
  analytics: false,
  performance: false,
  preferences: false,
};

const STORAGE_KEY = 'rankkit_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const consentData = JSON.parse(stored);
        setConsent(consentData);
        setShowBanner(false);
      } catch (error) {
        setConsent(DEFAULT_CONSENT);
        setShowBanner(true);
      }
    } else {
      setConsent(DEFAULT_CONSENT);
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    // Always keep essential cookies enabled
    const updatedConsent = {
      ...newConsent,
      essential: true,
    };
    
    setConsent(updatedConsent);
    setShowBanner(false);

    // Save to localStorage with expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...updatedConsent,
        expiryDate: expiryDate.toISOString(),
      })
    );

    // Load analytics if consent given
    if (updatedConsent.analytics) {
      loadAnalytics();
    }
  };

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      essential: true,
      analytics: true,
      performance: true,
      preferences: true,
    };
    saveConsent(fullConsent);
  };

  const rejectNonEssential = () => {
    const minimalConsent: CookieConsent = {
      essential: true,
      analytics: false,
      performance: false,
      preferences: false,
    };
    saveConsent(minimalConsent);
  };

  const updateConsent = (updates: Partial<CookieConsent>) => {
    if (consent) {
      saveConsent({
        ...consent,
        ...updates,
        essential: true, // Always keep essential true
      });
    }
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(DEFAULT_CONSENT);
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    saveConsent,
    acceptAll,
    rejectNonEssential,
    updateConsent,
    resetConsent,
  };
}

// Helper function to load Google Analytics if consent given
function loadAnalytics() {
  // This is where you'd load Google Analytics or other tracking scripts
  // Example:
  // if (window.gtag) {
  //   window.gtag('consent', 'update', {
  //     'analytics_storage': 'granted'
  //   });
  // }
}

// Helper function to check if cookie type is allowed
export function isCookieAllowed(
  cookieType: keyof CookieConsent,
  consent: CookieConsent | null
): boolean {
  if (!consent) return false;
  return consent[cookieType];
}
