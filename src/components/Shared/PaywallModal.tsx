import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaywallModal.css';

interface PaywallModalProps {
  toolName: string;
  onClose: () => void;
}

export function PaywallModal({ toolName, onClose }: PaywallModalProps) {
  const navigate = useNavigate();

  function handleUpgrade() {
    navigate('/profile?tab=billing');
  }

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={e => e.stopPropagation()}>
        <button className="paywall-close" onClick={onClose}>×</button>
        
        <div className="paywall-icon">🔒</div>
        
        <h2>Premium Feature</h2>
        
        <p className="paywall-message">
          <strong>{toolName}</strong> requires a Premium subscription to unlock.
        </p>
        
        <div className="paywall-benefits">
          <h3>Premium Benefits:</h3>
          <ul>
            <li>✅ Unlimited AI optimizations</li>
            <li>✅ Access to all 16+ tools</li>
            <li>✅ Up to 30 saved documents</li>
            <li>✅ Advanced features & priority support</li>
          </ul>
        </div>
        
        <div className="paywall-actions">
          <button className="upgrade-button-primary" onClick={handleUpgrade}>
            ⭐ Upgrade to Premium
          </button>
          <button className="cancel-button" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
