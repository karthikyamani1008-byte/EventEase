import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Mail,
  ShieldAlert,
  CheckCircle,
  Share2,
  ArrowLeft,
  AlertTriangle,
  Building,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton';
import ErrorState from '../../components/feedback/ErrorState';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { bookingService } from '../../services/bookingService';
import { formatDate, formatTime, formatCurrency, isDeadlinePassed } from '../../utils/formatters';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  const fetchEventData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await eventService.getEventById(id);
      if (res.data?.event) {
        setEvent(res.data.event);

        // Check if current logged-in student has already booked this event
        if (isAuthenticated) {
          try {
            const bookingsRes = await bookingService.getMyBookings();
            const existing = bookingsRes.data?.bookings?.find(
              (b) => (b.event?._id === id || b.event?.id === id) && b.status === 'confirmed'
            );
            if (existing) {
              setHasBooked(true);
              setBookingRef(existing.bookingReference);
            }
          } catch (e) {
            // Ignore background check errors
          }
        }
      } else {
        setError('Event not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, isAuthenticated]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      toast.info('Please log in with your student account to reserve a seat.');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setBookModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      const res = await eventService.bookEvent(id);
      const newBooking = res.data?.booking;
      setHasBooked(true);
      setBookingRef(newBooking?.bookingReference || 'CONFIRMED');
      setBookModalOpen(false);

      // Update local seat count
      setEvent((prev) => ({
        ...prev,
        availableSeats: Math.max(0, (prev.availableSeats || 1) - 1),
      }));

      toast.success(res.message || 'Seat reservation confirmed!');
    } catch (err) {
      toast.error(err.message);
      setBookModalOpen(false);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <LoadingSkeleton className="aspect-[16/9] w-full rounded-3xl" />
            <LoadingSkeleton className="h-10 w-3/4" />
            <LoadingSkeleton variant="card" />
          </div>
          <div className="lg:col-span-4">
            <LoadingSkeleton variant="stat" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Event Not Found"
          message={error || 'The requested event could not be found or has been removed.'}
          onRetry={fetchEventData}
        />
      </div>
    );
  }

  const isFull = event.availableSeats <= 0;
  const deadlinePassed = isDeadlinePassed(event.registrationDeadline);
  const capacityPercent = Math.round(
    ((event.capacity - event.availableSeats) / event.capacity) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
        <Button variant="outline" size="sm" leftIcon={Share2} onClick={handleShare}>
          Share Event
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Event Overview */}
        <div className="lg:col-span-8 space-y-8">
          {/* Banner Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-canvas border border-subtle shadow-soft">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={event.category} size="md" className="bg-white/95 backdrop-blur-sm uppercase tracking-wider font-bold text-main border-none">
                {event.category}
              </Badge>
              <Badge variant={event.isFree ? 'free' : 'paid'} size="md" className="font-bold">
                {formatCurrency(event.price)}
              </Badge>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-main tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.startDateTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                <span>{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <h2 className="text-base font-bold text-main uppercase tracking-wider mb-3">
              About This Event
            </h2>
            <p className="text-sm sm:text-base text-main/90 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </Card>

          {/* Guidelines & Rules */}
          {event.rules && event.rules.length > 0 && (
            <Card>
              <h2 className="text-base font-bold text-main uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <span>Event Guidelines & Rules</span>
              </h2>
              <ul className="space-y-2.5">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-main">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Eligibility */}
          {event.eligibility && (
            <Card>
              <h2 className="text-base font-bold text-main uppercase tracking-wider mb-2">
                Eligibility
              </h2>
              <p className="text-sm text-muted">
                {event.eligibility}
              </p>
            </Card>
          )}

          {/* Organizer Card */}
          <Card className="flex items-center gap-4">
            {event.organizer?.avatar ? (
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-xl shrink-0">
                <Building className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Organized by
              </span>
              <h3 className="font-bold text-base text-main truncate">
                {event.organizer?.name}
              </h3>
              <p className="text-xs text-muted truncate">
                {event.organizer?.department || event.organizer?.email}
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Sticky Booking & Capacity Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <Card className="border-primary/20 shadow-soft-lg space-y-6">
            <div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Admission Fee
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-main">
                  {formatCurrency(event.price)}
                </span>
                {event.isFree && (
                  <Badge variant="free" size="sm">Free Entry</Badge>
                )}
              </div>
            </div>

            {/* Live Seat Capacity Progress Bar */}
            <div className="space-y-2 pt-4 border-t border-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted">Seat Capacity:</span>
                <span className="font-bold text-main">
                  {event.availableSeats} of {event.capacity} left
                </span>
              </div>
              <div className="w-full h-2.5 bg-canvas rounded-full overflow-hidden border border-subtle">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isFull
                      ? 'bg-status-danger'
                      : capacityPercent > 80
                      ? 'bg-amber-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, capacityPercent))}%` }}
                />
              </div>
            </div>

            {/* Registration Deadline Alert */}
            <div className="bg-canvas p-3.5 rounded-xl border border-subtle text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-main">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Registration Deadline:</span>
              </div>
              <p className="text-muted pl-5.5">
                {formatDate(event.registrationDeadline)} at {formatTime(event.registrationDeadline)}
              </p>
            </div>

            {/* Live Booking States */}
            {hasBooked ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-status-success text-white mx-auto flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Seat Confirmed!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Ref: <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">#{bookingRef}</code>
                  </p>
                </div>
                <Link to="/student/bookings" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    View in Student Dashboard
                  </Button>
                </Link>
              </div>
            ) : isFull ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-status-danger">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Event is Full</span>
                </div>
                <p className="text-xs text-muted">
                  All available seats for this program have been booked.
                </p>
                <Button variant="outline" size="sm" disabled className="w-full">
                  Fully Booked
                </Button>
              </div>
            ) : deadlinePassed ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Registration Closed</span>
                </div>
                <p className="text-xs text-muted">
                  The deadline for registering for this event has passed.
                </p>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-sm"
                leftIcon={Ticket}
                onClick={handleBookClick}
              >
                {isAuthenticated ? 'Book My Seat' : 'Log In to Reserve Seat'}
              </Button>
            )}

            <div className="text-[11px] text-muted text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Real-time atomic seat reservation</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Confirm Event Booking"
        description="Verify your seat reservation details before finalizing."
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setBookModalOpen(false)}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmBooking}
              isLoading={isBooking}
            >
              Confirm Reservation
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="bg-canvas border border-subtle rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Event:</span>
              <span className="font-semibold text-main text-right">{event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date:</span>
              <span className="font-semibold text-main">{formatDate(event.startDateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Venue:</span>
              <span className="font-semibold text-main">{event.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Price:</span>
              <span className="font-semibold text-main">{formatCurrency(event.price)}</span>
            </div>
          </div>
          <p className="text-xs text-muted">
            By confirming, you agree to attend on time and adhere to campus event conduct regulations.
          </p>
        </div>
      </Modal>
    </div>
  );
}
