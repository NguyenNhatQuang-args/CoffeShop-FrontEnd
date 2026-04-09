import api from './api';

const upload = (endpoint, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadService = {
  uploadProduct: (file) => upload('/admin/upload/product', file),
  uploadCategory: (file) => upload('/admin/upload/category', file),
  uploadBlog: (file) => upload('/admin/upload/blog', file),
  deleteFile: (url) => api.delete('/admin/upload', { data: { url } }),
};
