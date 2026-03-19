import api from './axios';

export const getDashboard = () => api.get('/admin/dashboard');
export const getClaims = () => api.get('/admin/claims');
export const getDisruptions = () => api.get('/admin/disruptions');
export const getFraudFlags = () => api.get('/admin/fraud-flags');
