const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/apiResponse');
const { bookSeat } = require('../services/bookingService');

/**
 * @desc    Get all public approved events with filters and pagination
 * @route   GET /api/v1/events
 * @access  Public
 */
const getPublicEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      price,
      location,
      sort = 'upcoming',
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'approved' };

    // Search keyword
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Location / Venue filter
    if (location && location.trim()) {
      query.$or = [
        ...(query.$or || []),
        { venue: { $regex: location.trim(), $options: 'i' } },
        { location: { $regex: location.trim(), $options: 'i' } },
      ];
    }

    // Price filter
    if (price === 'free') {
      query.price = 0;
    } else if (price === 'paid') {
      query.price = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { startDateTime: 1 };
    if (sort === 'title') {
      sortOptions = { title: 1 };
    } else if (sort === 'seats') {
      sortOptions = { availableSeats: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name email department avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(query),
    ]);

    return sendResponse(res, 200, {
      events,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID with organizer metadata
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate(
      'organizer',
      'name email department avatar'
    );

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    return sendResponse(res, 200, { event });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event proposal (organizers and admins)
 * @route   POST /api/v1/events
 * @access  Private (Organizer, Admin)
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      location,
      startDateTime,
      endDateTime,
      registrationDeadline,
      price = 0,
      capacity,
      bannerImage,
      rules,
      eligibility,
    } = req.body;

    if (!title || !description || !category || !venue || !startDateTime || !capacity) {
      return next(new AppError('Please provide all required event details', 400));
    }

    const numCapacity = Number(capacity);
    if (isNaN(numCapacity) || numCapacity <= 0) {
      return next(new AppError('Capacity must be a positive number', 400));
    }

    // Event Lifecycle Workflow: Organizer submissions start as 'pending' for review.
    // Admins can create immediately approved events.
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase().trim(),
      venue: venue.trim(),
      location: location ? location.trim() : venue.trim(),
      startDateTime: new Date(startDateTime),
      endDateTime: endDateTime ? new Date(endDateTime) : new Date(startDateTime),
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline)
        : new Date(startDateTime),
      price: Number(price) || 0,
      isFree: Number(price) === 0,
      capacity: numCapacity,
      availableSeats: numCapacity,
      bannerImage: bannerImage || undefined,
      rules: Array.isArray(rules) ? rules : [],
      eligibility: eligibility || 'Open to all enrolled students.',
      organizer: req.user._id,
      status: initialStatus,
    });

    return sendResponse(
      res,
      201,
      { event },
      req.user.role === 'admin'
        ? 'Event created and published successfully'
        : 'Event proposal submitted successfully. It is now pending administrative approval.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update owned event
 * @route   PATCH /api/v1/events/:id
 * @access  Private (Owner Organizer, Admin)
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Ownership check: Must be the organizer who created it or platform admin
    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError('Forbidden: You can only edit events that you have organized.', 403)
      );
    }

    // Disallow editing sensitive workflow status through general edit endpoint
    delete req.body.status;
    delete req.body.organizer;

    // Handle capacity update safely
    if (req.body.capacity && Number(req.body.capacity) !== event.capacity) {
      const newCapacity = Number(req.body.capacity);
      const bookedSeats = event.capacity - event.availableSeats;
      if (newCapacity < bookedSeats) {
        return next(
          new AppError(
            `Capacity cannot be reduced below current bookings (${bookedSeats} confirmed seats).`,
            400
          )
        );
      }
      req.body.availableSeats = newCapacity - bookedSeats;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email department avatar');

    return sendResponse(res, 200, { event: updatedEvent }, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete owned event
 * @route   DELETE /api/v1/events/:id
 * @access  Private (Owner Organizer, Admin)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Ownership check
    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError('Forbidden: You can only delete events that you have organized.', 403)
      );
    }

    await Event.findByIdAndDelete(id);

    return sendResponse(res, 200, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Book seat for an approved event
 * @route   POST /api/v1/events/:id/book
 * @access  Private (Student, Admin)
 */
const bookEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const result = await bookSeat(studentId, id);

    return sendResponse(
      res,
      201,
      result,
      `Seat reserved successfully! Your booking reference is #${result.booking.bookingReference}.`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
};
