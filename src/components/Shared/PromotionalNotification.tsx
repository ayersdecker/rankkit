import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { MonoIcon } from './MonoIcon';
import './PromotionalNotification.css';

export interface NotificationConfig {
  id: string;
  type: 'subscribe' | 'hint' | 'promotion' | 'info';
  title: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  action?: () => void;
  icon?: LucideIcon;
}

interface PromotionalNotificationProps {
  notifications: NotificationConfig[];
  intervalMinutes?: number; // How often to show notifications (default: 60 minutes)
}

const STORAGE_KEY = 'promo_notification_last_shown';

export function PromotionalNotification({ 
  notifications,
  intervalMinutes = 60
}: PromotionalNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState<NotificationConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const intervalMs = intervalMinutes * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown, 10) > intervalMs) {
      if (notifications.length > 0) {
        const randomIndex = Math.floor(Math.random() * notifications.length);
        setCurrentNotification(notifications[randomIndex]);
        setIsVisible(true);
        localStorage.setItem(STORAGE_KEY, now.toString());
      }
    }
  }, [notifications, intervalMinutes]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 300); // Wait for animation
  };

  const handleAction = () => {
    if (currentNotification?.action) {
      currentNotification.action();
    } else if (currentNotification?.linkUrl) {
      if (currentNotification.linkUrl.startsWith('http')) {
        window.open(currentNotification.linkUrl, '_blank');
      } else {
        navigate(currentNotification.linkUrl);
      }
    }
    handleClose();
  };

  if (!currentNotification || !isVisible) {
    return null;
  }

  return (
    <div className={`promo-notification ${isVisible ? 'visible' : ''}`}>
      <button className="promo-notification-close" onClick={handleClose} aria-label="Close notification">
        ×
      </button>
      
      {currentNotification.icon && (
        <div className="promo-notification-emoji">
          <MonoIcon icon={currentNotification.icon} size={24} className="mono-icon" />
        </div>
      )}
      
      <h3 className="promo-notification-title">{currentNotification.title}</h3>
      
      <p className="promo-notification-message">{currentNotification.message}</p>
      
      {(currentNotification.linkText || currentNotification.linkUrl) && (
        <button 
          className={`promo-notification-action ${currentNotification.type}`}
          onClick={handleAction}
        >
          {currentNotification.linkText || 'Learn More'} →
        </button>
      )}
    </div>
  );
}
