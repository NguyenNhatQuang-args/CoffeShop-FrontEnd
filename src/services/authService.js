import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { username: email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
};
