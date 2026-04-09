import api from './api';

export const blogService = {
  getAll: (params) => api.get('/blog', { params }),
  getBySlug: (slug) => api.get(`/blog/${slug}`),
  create: (data) => api.post('/admin/blog', data),
  update: (id, data) => api.put(`/admin/blog/${id}`, data),
  delete: (id) => api.delete(`/admin/blog/${id}`),
};
