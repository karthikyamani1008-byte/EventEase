import api from './api';

export const bookingService = {
  // Get currently logged-in student's booking history
  async getMyBookings() {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Cancel confirmed booking and restore seat
  async cancelBooking(id) {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};
