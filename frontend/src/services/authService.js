import apiClient from './api';

/**
 * Auth API endpoints
 */
export const authService = {
  register: (email, password, fullName) =>
    apiClient.post('/auth/register', { email, password, fullName }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout')
};

export default authService;
