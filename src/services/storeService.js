import api from './api';

export const storeService = {
  getAll: () => api.get('/stores'),
  create: (data) => api.post('/admin/stores', data),
  update: (id, data) => api.put(`/admin/stores/${id}`, data),
  delete: (id) => api.delete(`/admin/stores/${id}`),
};
