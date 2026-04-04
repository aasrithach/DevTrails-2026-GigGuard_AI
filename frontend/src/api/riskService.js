import api from './axios';

export const getZoneRisks = async () => {
  const response = await api.get('/risk/zones');
  return response.data;
};

export const spikeZoneRisk = async (zone) => {
  const response = await api.post(`/risk/zones/${zone}/spike`);
  return response.data;
};
