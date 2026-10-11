const Event = require('../models/Event');
const Booking = require('../models/Booking');
const AppError = require('../utils/appError');

/**
 * Concurrency-Safe Atomic Booking Engine
 * Guarantees zero overbooking and negative seat counts even under high concurrent traffic.
 */
const bookSeat = async (studentId, eventId) => {
  // 1. Check for duplicate active booking by this student for this event
  const existingActiveBooking = await Booking.findOne({
    student: studentId,
    event: eventId,
    status: 'confirmed',
  });

  if (existingActiveBooking) {
    throw new AppError(
      `You already have an active reservation for this event (Ref: #${existingActiveBooking.bookingReference}). Duplicate bookings are not permitted.`,
      400
    );
  }

  // 2. Fetch event to verify preliminary conditions
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  if (event.status !== 'approved') {
    throw new AppError('This event is not currently open for bookings.', 400);
  }

  const now = new Date();
  if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
    throw new AppError('Registration deadline for this event has passed.', 400);
  }

  // 3. Atomic Seat Decrement
  // Atomically check availableSeats > 0 and decrement in a single atomic database operation.
  // This guarantees that even if 50 students click "Book" for 1 remaining seat simultaneously,
  // only 1 succeeds at the database engine level.
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      status: 'approved',
      availableSeats: { $gt: 0 },
      registrationDeadline: { $gt: now },
    },
    {
      $inc: { availableSeats: -1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedEvent) {
    throw new AppError(
      'This event is fully booked or the registration deadline has just closed.',
      400
    );
  }

  // 4. Generate unique reference and create Booking record
  try {
    let bookingReference = Booking.generateReference();
    // Ensure reference uniqueness
    let isUnique = false;
    while (!isUnique) {
      const existingRef = await Booking.findOne({ bookingReference });
      if (!existingRef) {
        isUnique = true;
      } else {
        bookingReference = Booking.generateReference();
      }
    }

    const booking = await Booking.create({
      student: studentId,
      event: eventId,
      bookingReference,
      status: 'confirmed',
      bookedAt: new Date(),
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title category venue startDateTime endDateTime price bannerImage')
      .populate('student', 'name email studentId department');

    return {
      booking: populatedBooking,
      remainingSeats: updatedEvent.availableSeats,
    };
  } catch (error) {
    // Roll back the atomic seat decrement if booking document creation fails
    await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: 1 } });
    throw error;
  }
};

/**
 * Idempotent Seat Cancellation & Restoration Engine
 * Ensures seats are restored exactly once and retried calls do not cause seat leaks.
 */
const cancelSeat = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId).populate('event');

  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }

  // Authorization check: Must be the owner student or platform admin
  if (
    user.role !== 'admin' &&
    booking.student.toString() !== user._id.toString()
  ) {
    throw new AppError('You are not authorized to cancel this booking.', 403);
  }

  // Idempotency check: Already cancelled
  if (booking.status === 'cancelled') {
    throw new AppError(
      `This booking (#${booking.bookingReference}) has already been cancelled.`,
      400
    );
  }

  // Atomically update booking status to cancelled
  const updatedBooking = await Booking.findOneAndUpdate(
    { _id: bookingId, status: 'confirmed' },
    {
      $set: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    },
    { new: true }
  );

  if (!updatedBooking) {
    throw new AppError('Booking could not be cancelled or was already updated.', 400);
  }

  // Atomically restore the seat back to the event capacity pool
  const updatedEvent = await Event.findByIdAndUpdate(
    booking.event._id,
    { $inc: { availableSeats: 1 } },
    { new: true }
  );

  return {
    booking: updatedBooking,
    restoredSeats: updatedEvent ? updatedEvent.availableSeats : null,
  };
};

module.exports = {
  bookSeat,
  cancelSeat,
};
