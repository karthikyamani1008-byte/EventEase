const Booking = require('../models/Booking');
const { sendResponse } = require('../utils/apiResponse');
const { cancelSeat } = require('../services/bookingService');

/**
 * @desc    Get currently logged in student's bookings
 * @route   GET /api/v1/bookings/my
 * @access  Private (Student, Admin)
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate({
        path: 'event',
        select: 'title category venue location startDateTime endDateTime price isFree bannerImage status',
        populate: { path: 'organizer', select: 'name email department' },
      })
      .sort({ bookedAt: -1 });

    return sendResponse(res, 200, { bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a confirmed booking and restore seat capacity
 * @route   PATCH /api/v1/bookings/:id/cancel
 * @access  Private (Student, Admin)
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await cancelSeat(id, req.user);

    return sendResponse(
      res,
      200,
      result,
      `Booking #${result.booking.bookingReference} has been successfully cancelled and seat restored.`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyBookings,
  cancelBooking,
};
