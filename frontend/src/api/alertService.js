import api from './axios';

export const getMyAlerts = () => api.get('/alerts/my-alerts');
export const getLatestUnread = () => api.get('/alerts/latest');
export const markAsRead = (id) => api.put(`/alerts/mark-read/${id}`);
