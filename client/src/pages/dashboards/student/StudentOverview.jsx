import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import EmptyState from '../../../components/feedback/EmptyState';
import { useAuth } from '../../../context/AuthContext';
import { bookingService } from '../../../services/bookingService';
import { formatDate, formatTime } from '../../../utils/formatters';

export default function StudentOverview() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentBookings = async () => {
      try {
        const res = await bookingService.getMyBookings();
        if (res.data?.bookings) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentBookings();
  }, []);

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-light via-accent-blue to-canvas border border-subtle p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-sm">
        <div className="space-y-2">
          <Badge variant="student" size="sm">Student Account Active</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            Welcome back, {currentUser?.name || 'Student'}!
          </h1>
          <p className="text-sm text-muted max-w-xl">
            You have <span className="font-bold text-main">{confirmedBookings.length} upcoming events</span> on your schedule. Don't forget to keep your digital pass handy at the venue doors.
          </p>
        </div>
        <Link to="/events" className="shrink-0">
          <Button variant="primary" size="lg" rightIcon={ArrowRight}>
            Discover Events
          </Button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All-time registrations"
          icon={BookmarkCheck}
        />
        <StatCard
          title="Upcoming Events"
          value={confirmedBookings.length}
          subtitle="Ready to attend"
          icon={Calendar}
        />
        <StatCard
          title="Completed Events"
          value="0"
          subtitle="Past participation"
          icon={CheckCircle2}
        />
        <StatCard
          title="Cancelled Bookings"
          value={cancelledBookings.length}
          subtitle="Released seats"
          icon={XCircle}
        />
      </div>

      {/* Two Column Layout: Upcoming Bookings & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upcoming Events Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-main uppercase tracking-wider">
              Upcoming Booked Events
            </h2>
            <Link to="/student/bookings" className="text-xs font-semibold text-primary hover:underline">
              View All ({bookings.length})
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="row" />
              <LoadingSkeleton variant="row" />
            </div>
          ) : confirmedBookings.length === 0 ? (
            <EmptyState
              title="No Upcoming Events"
              description="You have not booked any upcoming campus events yet."
              actionText="Browse Event Catalog"
              onAction={() => window.location.href = '/events'}
            />
          ) : (
            <div className="space-y-4">
              {confirmedBookings.map((b) => (
                <Card key={b._id || b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={b.event?.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'}
                      alt={b.event?.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={b.event?.category || 'default'} size="sm">
                          {b.event?.category}
                        </Badge>
                        <span className="text-[11px] font-mono font-semibold text-muted">
                          #{b.bookingReference}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-main truncate">
                        {b.event?.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDate(b.event?.startDateTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted" />
                          {formatTime(b.event?.startDateTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-subtle">
                    <Link to={`/events/${b.event?._id || b.event?.id}`}>
                      <Button variant="outline" size="sm">
                        Event Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Activity */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-main uppercase tracking-wider">
              Recent Booking History
            </h3>
            {bookings.length === 0 ? (
              <p className="text-xs text-muted">No activity recorded yet.</p>
            ) : (
              <div className="space-y-4 text-xs">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b._id || b.id} className="flex items-start gap-3 pb-3 border-b border-subtle last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      b.status === 'confirmed' ? 'bg-status-success' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-semibold text-main line-clamp-1">
                        {b.status === 'confirmed' ? 'Booked' : 'Cancelled'} pass for {b.event?.title}
                      </p>
                      <span className="text-[11px] text-muted">
                        Ref #{b.bookingReference} • {formatDate(b.bookedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary-light/50 to-surface border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Sparkles className="w-4 h-4" />
              <span>Campus Pro-Tip</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Arrive 15 minutes before the scheduled time with your student ID card to facilitate quick check-in.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
