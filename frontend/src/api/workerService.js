import api from './axios';

export const getMe = () => api.get('/workers/me');
export const updateMe = (data) => api.put('/workers/me', data);
export const getDashboard = (id) => api.get(`/workers/${id}/dashboard`);
