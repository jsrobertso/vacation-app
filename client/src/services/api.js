import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const employeeAPI = {
  getAll: () => axios.get(`${API_BASE}/employees`),
  create: (data) => axios.post(`${API_BASE}/employees`, data),
  update: (id, data) => axios.put(`${API_BASE}/employees/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/employees/${id}`)
};

export const locationAPI = {
  getAll: () => axios.get(`${API_BASE}/locations`),
  create: (data) => axios.post(`${API_BASE}/locations`, data),
  update: (id, data) => axios.put(`${API_BASE}/locations/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/locations/${id}`)
};

export const denialReasonAPI = {
  getAll: () => axios.get(`${API_BASE}/denial-reasons`),
  create: (data) => axios.post(`${API_BASE}/denial-reasons`, data),
  update: (id, data) => axios.put(`${API_BASE}/denial-reasons/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/denial-reasons/${id}`)
};

export const vacationRequestAPI = {
  getAll: () => axios.get(`${API_BASE}/vacation-requests`),
  create: (data) => axios.post(`${API_BASE}/vacation-requests`, data),
  approve: (id, supervisorId) => axios.put(`${API_BASE}/vacation-requests/${id}/approve`, { supervisor_id: supervisorId }),
  deny: (id, data) => axios.put(`${API_BASE}/vacation-requests/${id}/deny`, data)
};