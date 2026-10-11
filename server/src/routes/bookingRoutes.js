const express = require('express');
const { getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.get('/my', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
