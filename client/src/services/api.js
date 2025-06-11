import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: data => axios.post(`${API_BASE}/login`, data),
  requestReset: data => axios.post(`${API_BASE}/request-password-reset`, data),
  resetPassword: data => axios.post(`${API_BASE}/reset-password`, data)
};

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  create: data => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: id => api.delete(`/employees/${id}`)
};

export const locationAPI = {
  getAll: () => api.get('/locations'),
  create: data => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: id => api.delete(`/locations/${id}`)
};

export const denialReasonAPI = {
  getAll: () => api.get('/denial-reasons'),
  create: data => api.post('/denial-reasons', data),
  update: (id, data) => api.put(`/denial-reasons/${id}`, data),
  delete: id => api.delete(`/denial-reasons/${id}`)
};

export const vacationRequestAPI = {
  getAll: () => api.get('/vacation-requests'),
  create: data => api.post('/vacation-requests', data),
  approve: (id, supervisorId) => api.put(`/vacation-requests/${id}/approve`, { supervisor_id: supervisorId }),
  deny: (id, data) => api.put(`/vacation-requests/${id}/deny`, data)
};

export { api };
