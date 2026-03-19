import api from './axios';

export const createPolicy = () => api.post('/policies/create');
export const getActivePolicy = () => api.get('/policies/active');
export const getHistory = () => api.get('/policies/history');
export const previewCoverage = (data) => api.post('/policies/preview', data);
