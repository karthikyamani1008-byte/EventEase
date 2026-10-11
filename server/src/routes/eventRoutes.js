const express = require('express');
const {
  getPublicEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getPublicEvents);
router.get('/:id', getEventById);

// Protected routes for Organizers and Admins
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.patch('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

// Protected booking action for Students (and Admins)
router.post('/:id/book', protect, authorize('student', 'admin'), bookEvent);

module.exports = router;
