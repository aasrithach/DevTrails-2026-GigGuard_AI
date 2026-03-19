import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const Toast = ({ id, type, title, message, timeAgo, onClose }) => {
  // determine styling by type
  let accent = "bg-primary text-primary";
  let border = "border-l-primary";
  let Icon = Info;
  
  if (type === 'WARNING' || type === 'DISRUPTION_WARNING') {
    accent = "bg-secondary text-secondary";
    border = "border-l-secondary";
    Icon = AlertTriangle;
  } else if (type === 'SUCCESS' || type === 'PAYOUT_PROCESSED' || type === 'CLAIM_APPROVED') {
    accent = "bg-success text-success";
    border = "border-l-success";
    Icon = CheckCircle;
  } else if (type === 'ERROR' || type === 'FRAUD_DETECTED') {
    accent = "bg-danger text-danger";
    border = "border-l-danger";
    Icon = AlertTriangle; // reuse alert for error
  } else if (type === 'POLICY_UPDATED' || type === 'COVERAGE_ACTIVATED') {
    accent = "bg-primary text-primary";
    border = "border-l-primary";
    Icon = Bell;
  }

  return (
    <div 
      onClick={() => onClose(id)}
      className={`glass-panel mb-3 relative overflow-hidden rounded-xl border-l-[4px] ${border} 
      shadow-2xl cursor-pointer hover:bg-card transform transition-all duration-300 pointer-events-auto
      animate-slide-in-right group`}
    >
      <div className="p-4 flex items-start">
        {/* Icon */}
        <div className={`mt-0.5 rounded-full p-1 bg-background ${accent.split(' ')[1]}`}>
          <Icon className="w-5 h-5 pointer-events-none" />
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <span className="text-[10px] text-textSecondary ml-2">{timeAgo}</span>
          </div>
          <p className="text-xs text-textSecondary mt-1 leading-snug">{message}</p>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(id); }}
          className="ml-4 text-textSecondary hover:text-white transition-colors"
        >
          <X className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        </button>
      </div>
      
      {/* Auto Dismiss Progress Bar (4s length) */}
      <div className="absolute bottom-0 left-0 h-1 bg-background w-full">
        <div className={`h-full ${accent.split(' ')[0]} animate-shrink-width`}></div>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [{ ...notification, id }, ...prev]);
    
    // Auto remove after 4.2 seconds (allowing for 4s bar + 200ms slide)
    setTimeout(() => {
      removeNotification(id);
    }, 4200);
  }, []);

  const removeNotification = useCallback((id) => {
    // Add slide-out class logic before removing from DOM
    // For simplicity, we just filter it out immediately instead of managing exit states complexly 
    // unless explicitly needed. The slide-in is handled natively.
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, toasts }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none flex flex-col items-end">
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            {...toast}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
