import api from './api';

export const authService = {
  // Register new student or organizer
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Get current user profile
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
