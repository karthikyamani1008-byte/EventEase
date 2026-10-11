import api from './api';

export const organizerService = {
  // Get organizer metrics & stats
  async getDashboard() {
    const response = await api.get('/organizer/dashboard');
    return response.data;
  },

  // Get owned events
  async getMyEvents() {
    const response = await api.get('/organizer/events');
    return response.data;
  },

  // Get attendee roster for specific owned event
  async getEventAttendees(eventId) {
    const response = await api.get(`/organizer/events/${eventId}/bookings`);
    return response.data;
  },
};
