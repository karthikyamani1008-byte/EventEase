const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify an event category'],
      enum: {
        values: ['technology', 'workshops', 'hackathons', 'cultural', 'sports', 'other'],
        message: 'Invalid category',
      },
      lowercase: true,
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must have an organizer'],
    },
    startDateTime: {
      type: Date,
      required: [true, 'Please specify event start date and time'],
    },
    endDateTime: {
      type: Date,
      required: [true, 'Please specify event end date and time'],
    },
    venue: {
      type: String,
      required: [true, 'Please specify event venue'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isFree: {
      type: Boolean,
      default: function () {
        return this.price === 0;
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify total seating capacity'],
      min: [1, 'Capacity must be at least 1 seat'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please specify available seats'],
      min: [0, 'Available seats cannot be negative'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please specify registration deadline'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'pending', 'approved', 'rejected', 'cancelled'],
        message: 'Invalid event status',
      },
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    rules: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Open to all registered campus students.',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for high-speed queries on public catalog & admin filters
eventSchema.index({ status: 1, startDateTime: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ organizer: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
