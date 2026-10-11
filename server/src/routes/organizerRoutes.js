const express = require('express');
const {
  getOrganizerDashboard,
  getOrganizerEvents,
  getEventAttendees,
} = require('../controllers/organizerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('organizer', 'admin'));

router.get('/dashboard', getOrganizerDashboard);
router.get('/events', getOrganizerEvents);
router.get('/events/:id/bookings', getEventAttendees);

module.exports = router;
