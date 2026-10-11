import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/feedback/EmptyState';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { ConfirmModal } from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';
import { bookingService } from '../../../services/bookingService';
import { formatDate, formatTime } from '../../../utils/formatters';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'confirmed' | 'cancelled'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const toast = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res.data?.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load your bookings from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setIsCancelling(true);

    try {
      const res = await bookingService.cancelBooking(selectedBooking._id || selectedBooking.id);
      toast.success(res.message || 'Booking cancelled and seat restored.');

      // Update state locally
      setBookings((prev) =>
        prev.map((b) =>
          (b._id === selectedBooking._id || b.id === selectedBooking.id)
            ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : b
        )
      );
      setCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">
            My Event Bookings
          </h1>
          <p className="text-xs text-muted">
            Manage your registered campus activities, view digital ticket references, and cancel reservations.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-subtle rounded-xl self-start">
          {['all', 'confirmed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-main'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton variant="row" />
          <LoadingSkeleton variant="row" />
          <LoadingSkeleton variant="row" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description={
            activeTab === 'all'
              ? 'You have not registered for any events yet. Check out the campus catalog!'
              : `You do not have any ${activeTab} event bookings.`
          }
          actionText={activeTab === 'all' ? 'Explore Events' : undefined}
          onAction={() => window.location.href = '/events'}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            return (
              <Card
                key={b._id || b.id}
                className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Image & Details */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={b.event?.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'}
                    alt={b.event?.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-subtle"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isConfirmed ? 'approved' : 'cancelled'}
                        size="sm"
                        dot
                      >
                        {isConfirmed ? 'Confirmed' : 'Cancelled'}
                      </Badge>
                      <Badge variant={b.event?.category || 'default'} size="sm">
                        {b.event?.category}
                      </Badge>
                      <span className="text-xs font-mono font-semibold bg-canvas px-2 py-0.5 rounded border border-subtle text-main">
                        #{b.bookingReference}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-main truncate">
                      {b.event?.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(b.event?.startDateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        {formatTime(b.event?.startDateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted" />
                        {b.event?.venue}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted pt-1">
                      Registered on {formatDate(b.bookedAt)}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-subtle self-end lg:self-center">
                  <Link to={`/events/${b.event?._id || b.event?.id}`}>
                    <Button variant="outline" size="sm" rightIcon={ArrowUpRight}>
                      View Event
                    </Button>
                  </Link>

                  {isConfirmed && (
                    <Button
                      variant="dangerOutline"
                      size="sm"
                      onClick={() => handleOpenCancelModal(b)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Custom Confirmation Modal for Cancellation */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Your Registration?"
        message={`Are you sure you want to cancel your seat for "${selectedBooking?.event?.title}"? Your seat (#${selectedBooking?.bookingReference}) will be immediately restored to the open availability pool.`}
        confirmText="Yes, Release Seat"
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
