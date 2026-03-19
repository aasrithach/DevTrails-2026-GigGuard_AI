import { useEffect, useContext, useRef } from 'react';
import { ToastContext } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getLatestUnread, markAsRead } from '../api/alertService';

function GlobalPoller() {
  const toastContext = useContext(ToastContext);
  const { user } = useAuth();
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!toastContext) {
      console.warn('GlobalPoller: ToastContext not found, polling disabled');
      return;
    }

    if (!user || user.role !== 'WORKER') return;

    const { addToast } = toastContext;

    const pollAlerts = async () => {
      try {
        const res = await getLatestUnread();
        const unreadList = res.data;
        
        if (unreadList && unreadList.length > 0) {
          for (const alert of unreadList) {
            addToast({
              type: getAlertType(alert.alertType),
              title: getAlertTitle(alert.alertType),
              message: alert.message
            });
            await markAsRead(alert.id);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    pollingRef.current = setInterval(pollAlerts, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user, toastContext]);

  return null;
}

function getAlertType(alertType) {
  const map = {
    CLAIM_APPROVED: 'success',
    PAYOUT_PROCESSED: 'success',
    DISRUPTION_WARNING: 'warning',
    FRAUD_DETECTED: 'error',
    COVERAGE_ACTIVATED: 'info'
  };
  return map[alertType] || 'info';
}

function getAlertTitle(alertType) {
  const map = {
    CLAIM_APPROVED: 'Claim Approved',
    PAYOUT_PROCESSED: 'Payout Sent',
    DISRUPTION_WARNING: 'Disruption Warning',
    FRAUD_DETECTED: 'Fraud Alert',
    COVERAGE_ACTIVATED: 'Coverage Activated'
  };
  return map[alertType] || 'Notification';
}

export default GlobalPoller;
