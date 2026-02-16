import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailablePlans, getRecommendedPlan } from '../../config/pricing';
import { Lock, Sparkles, Star } from 'lucide-react';
import { MonoIcon } from './MonoIcon';
import './PaywallModal.css';

interface PaywallModalProps {
  toolName: string;
  toolCategory?: 'career' | 'work' | 'social';
  onClose: () => void;
}

export function PaywallModal({ toolName, toolCategory, onClose }: PaywallModalProps) {
  const navigate = useNavigate();
  const plans = getAvailablePlans();
  
  // Determine recommended plan based on tool category
  const recommendedPlan = toolCategory 
    ? getRecommendedPlan([toolCategory])
    : plans.find(p => p.id === 'ultimate-bundle');

  function handleSelectPlan(planId: string) {
    navigate(`/profile?tab=billing&plan=${planId}`);
    onClose();
  }

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal-large" onClick={e => e.stopPropagation()}>
        <button className="paywall-close" onClick={onClose}>×</button>
        
        <div className="paywall-header">
          <div className="paywall-icon">
            <MonoIcon icon={Star} size={32} className="mono-icon" />
          </div>
          <h2>Unlock Premium Features</h2>
          <p className="paywall-message">
            <strong>{toolName}</strong> requires a subscription.
            {toolCategory && <span className="category-badge">{toolCategory}</span>}
          </p>
          <p className="beta-notice">
            <MonoIcon icon={Sparkles} size={16} className="mono-icon inline" />
            <strong>Beta Access:</strong> All features are currently free! Choose a plan to prepare for launch.
          </p>
        </div>
        
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.id === recommendedPlan?.id ? 'recommended' : ''}`}
            >
              {plan.id === recommendedPlan?.id && (
                <div className="recommended-badge">Recommended</div>
              )}
              {plan.isPopular && (
                <div className="popular-badge">Best Value</div>
              )}
              
              <h3>{plan.name}</h3>
              
              <div className="pricing-price">
                <span className="price-amount">${plan.price}</span>
                <span className="price-period">/month</span>
              </div>
              
              {plan.savings && (
                <div className="pricing-savings">{plan.savings}</div>
              )}
              
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              
              <button 
                className={`pricing-button ${plan.id === recommendedPlan?.id ? 'primary' : 'secondary'}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === recommendedPlan?.id ? 'Get Started' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="paywall-footer">
          <p>
            <MonoIcon icon={Lock} size={16} className="mono-icon inline" />
            All plans include secure storage • Priority support • Cancel anytime
          </p>
          <button className="cancel-button-text" onClick={onClose}>
            I'll stick with the free trial for now
          </button>
        </div>
      </div>
    </div>
  );
}
