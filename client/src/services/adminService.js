import api from './api';

export const adminService = {
  // Get master admin platform statistics
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get pending events queue
  async getPendingEvents() {
    const response = await api.get('/admin/events/pending');
    return response.data;
  },

  // Approve or reject event proposal
  async updateEventApproval(id, action, rejectionReason = '') {
    const response = await api.patch(`/admin/events/${id}/approval`, {
      action,
      rejectionReason,
    });
    return response.data;
  },

  // Get users directory with filters
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user status (active / suspended)
  async updateUserStatus(id, status) {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Get master platform events catalog
  async getEvents(params = {}) {
    const response = await api.get('/admin/events', { params });
    return response.data;
  },
};
