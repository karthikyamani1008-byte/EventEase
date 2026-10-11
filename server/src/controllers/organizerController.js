const Event = require('../models/Event');
const Booking = require('../models/Booking');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/apiResponse');

/**
 * @desc    Get organizer metrics and dashboard statistics
 * @route   GET /api/v1/organizer/dashboard
 * @access  Private (Organizer, Admin)
 */
const getOrganizerDashboard = async (req, res, next) => {
  try {
    const organizerId = req.user._id;

    const [totalEvents, publishedEvents, pendingEvents, rejectedEvents, eventsList] =
      await Promise.all([
        Event.countDocuments({ organizer: organizerId }),
        Event.countDocuments({ organizer: organizerId, status: 'approved' }),
        Event.countDocuments({ organizer: organizerId, status: 'pending' }),
        Event.countDocuments({ organizer: organizerId, status: 'rejected' }),
        Event.find({ organizer: organizerId }).select('_id capacity availableSeats'),
      ]);

    // Calculate total confirmed bookings across all owned events
    const eventIds = eventsList.map((e) => e._id);
    const totalActiveBookings = await Booking.countDocuments({
      event: { $in: eventIds },
      status: 'confirmed',
    });

    return sendResponse(res, 200, {
      stats: {
        totalEvents,
        publishedEvents,
        pendingEvents,
        rejectedEvents,
        totalActiveBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events owned by current organizer
 * @route   GET /api/v1/organizer/events
 * @access  Private (Organizer, Admin)
 */
const getOrganizerEvents = async (req, res, next) => {
  try {
    const organizerId = req.user._id;

    const events = await Event.find({ organizer: organizerId }).sort({
      createdAt: -1,
    });

    return sendResponse(res, 200, { events });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get confirmed student attendees for a specific owned event
 * @route   GET /api/v1/organizer/events/:id/bookings
 * @access  Private (Organizer, Admin)
 */
const getEventAttendees = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Ownership check: Must be owner organizer or platform admin
    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError('Forbidden: You can only view attendee rosters for your own events.', 403)
      );
    }

    const bookings = await Booking.find({ event: id })
      .populate('student', 'name email studentId department')
      .sort({ bookedAt: -1 });

    return sendResponse(res, 200, {
      event: {
        _id: event._id,
        title: event.title,
        capacity: event.capacity,
        availableSeats: event.availableSeats,
      },
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizerDashboard,
  getOrganizerEvents,
  getEventAttendees,
};
