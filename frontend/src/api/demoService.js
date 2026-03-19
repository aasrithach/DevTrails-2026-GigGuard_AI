import api from './axios';

export const triggerDisruption = (data) => api.post('/demo/trigger-disruption', data);
export const resolveDisruption = (id) => api.post(`/demo/resolve-disruption/${id}`);
export const setWeather = (data) => api.post('/demo/set-weather', data);
export const resetDemo = () => api.post('/demo/reset');
export const getZoneSummary = () => api.get('/demo/zone-summary');
