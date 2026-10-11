import api from './api';

export const eventService = {
  // Get public approved events with filters and pagination
  async getEvents(params = {}) {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get single event by ID
  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event proposal (organizers and admins)
  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update owned event
  async updateEvent(id, eventData) {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete owned event
  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Book seat for an event (students and admins)
  async bookEvent(id) {
    const response = await api.post(`/events/${id}/book`);
    return response.data;
  },
};
