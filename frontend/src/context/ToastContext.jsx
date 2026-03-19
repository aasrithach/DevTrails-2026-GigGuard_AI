import React, { createContext, useContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = 'info', title, message }) => {
      // Handle the case where the rest of the app calls addToast(message, type)
      if (typeof arguments[0] === 'string') {
          message = arguments[0];
          type = arguments[1] || 'info';
          title = type === 'error' || type === 'danger' ? 'Error' 
                : type === 'success' ? 'Success' 
                : type === 'warning' ? 'Warning' : 'Notification';
      }

      // Convert "danger" to "error" to match the new color mapping
      if (type === 'danger') type = 'error';

      const id = Date.now() + Math.random();
      setToasts(prev => [
        ...prev, 
        { id, type, title, message }
      ]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    }, 
    []
  );

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { 
      addToast: () => {}, 
      removeToast: () => {},
      toasts: [] 
    };
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxWidth: 360,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const colors = {
    success: { bg: '#065F46', border: '#10B981', icon: '✓' },
    warning: { bg: '#78350F', border: '#F59E0B', icon: '⚠' },
    error: { bg: '#7F1D1D', border: '#EF4444', icon: '✕' },
    info: { bg: '#1E293B', border: '#14B8A6', icon: 'ℹ' }
  };
  
  const c = colors[toast.type] || colors.info;
  
  return (
    <div 
      onClick={() => onRemove(toast.id)}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: 8,
        padding: '12px 16px',
        cursor: 'pointer',
        pointerEvents: 'all',
        animation: 'slideIn .3s ease forwards'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: c.border, fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
          {c.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#F1F5F9', fontSize: 13, fontWeight: 600 }}>
            {toast.title}
          </div>
          {toast.message && (
            <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>
              {toast.message}
            </div>
          )}
        </div>
        <span style={{ color: '#64748B', fontSize: 16, flexShrink: 0 }}>
          ×
        </span>
      </div>
    </div>
  );
}
