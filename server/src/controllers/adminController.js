const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');
const AppError = require('../utils/appError');
const { sendResponse } = require('../utils/apiResponse');

/**
 * @desc    Get master admin platform overview metrics
 * @route   GET /api/v1/admin/dashboard
 * @access  Private (Admin only)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrganizers,
      totalStudents,
      totalEvents,
      pendingEvents,
      approvedEvents,
      totalBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'organizer' }),
      User.countDocuments({ role: 'student' }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'pending' }),
      Event.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'confirmed' }),
    ]);

    return sendResponse(res, 200, {
      stats: {
        totalUsers,
        totalOrganizers,
        totalStudents,
        totalEvents,
        pendingEvents,
        approvedEvents,
        totalBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get queue of events pending administrative review
 * @route   GET /api/v1/admin/events/pending
 * @access  Private (Admin only)
 */
const getPendingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('organizer', 'name email department avatar')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, { events });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject a submitted event proposal
 * @route   PATCH /api/v1/admin/events/:id/approval
 * @access  Private (Admin only)
 */
const updateEventApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return next(
        new AppError('Please specify action as either "approve" or "reject".', 400)
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    if (action === 'reject') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return next(
          new AppError(
            'A constructive rejection reason is strictly required when rejecting an event submission.',
            400
          )
        );
      }
      event.status = 'rejected';
      event.rejectionReason = rejectionReason.trim();
    } else {
      event.status = 'approved';
      event.rejectionReason = null;
    }

    await event.save();

    const populatedEvent = await Event.findById(id).populate(
      'organizer',
      'name email department'
    );

    return sendResponse(
      res,
      200,
      { event: populatedEvent },
      action === 'approve'
        ? `Event "${event.title}" has been approved and is now live on the public campus catalog.`
        : `Event "${event.title}" has been rejected. Reason logged for organizer.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get registered users directory with search and role filter
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin only)
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { department: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    return sendResponse(res, 200, {
      users,
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
 * @desc    Update user status (active / suspended)
 * @route   PATCH /api/v1/admin/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'suspended'].includes(status)) {
      return next(new AppError('Invalid status. Must be "active" or "suspended".', 400));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Safety guard: Cannot suspend the primary admin
    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return next(new AppError('You cannot suspend your own administrative account.', 400));
    }

    user.status = status;
    await user.save();

    return sendResponse(res, 200, { user }, `User status updated to ${status}.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all platform events (all statuses)
 * @route   GET /api/v1/admin/events
 * @access  Private (Admin only)
 */
const getAdminEvents = async (req, res, next) => {
  try {
    const { search, status, category, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { venue: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name email department')
        .sort({ createdAt: -1 })
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

module.exports = {
  getAdminDashboard,
  getPendingEvents,
  updateEventApproval,
  getAdminUsers,
  updateUserStatus,
  getAdminEvents,
};
