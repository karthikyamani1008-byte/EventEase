const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a student'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Booking must belong to an event'],
    },
    bookingReference: {
      type: String,
      required: [true, 'Booking must have a unique reference code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled', 'attended'],
        message: 'Invalid booking status',
      },
      default: 'confirmed',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index to help query bookings by student and prevent duplicate confirmed bookings
bookingSchema.index({ student: 1, event: 1, status: 1 });
bookingSchema.index({ event: 1, status: 1 });

// Helper to generate formatted booking reference
bookingSchema.statics.generateReference = function () {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `EVT-${randomSuffix}`;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
