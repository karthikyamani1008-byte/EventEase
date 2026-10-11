import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { organizerService } from '../../../services/organizerService';
import { useAuth } from '../../../context/AuthContext';
import { formatDate } from '../../../utils/formatters';

export default function OrganizerOverview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    pendingEvents: 0,
    totalActiveBookings: 0,
  });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        const [dashRes, eventsRes] = await Promise.all([
          organizerService.getDashboard(),
          organizerService.getMyEvents(),
        ]);

        if (dashRes.data?.stats) {
          setStats(dashRes.data.stats);
        }
        if (eventsRes.data?.events) {
          setEvents(eventsRes.data.events);
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganizerData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-light via-accent-blue to-canvas border border-subtle p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="organizer" size="sm">Club Organizer</Badge>
            <span className="text-xs text-muted font-medium">
              {currentUser?.department || currentUser?.name || 'Campus Club'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            Organizer Portal
          </h1>
          <p className="text-sm text-muted max-w-xl">
            Oversee your campus programs, track seat reservations in real time, and submit new workshop proposals.
          </p>
        </div>
        <Link to="/organizer/events">
          <Button variant="primary" size="lg" leftIcon={PlusCircle}>
            Manage My Events
          </Button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle="All created submissions"
          icon={Calendar}
        />
        <StatCard
          title="Published Events"
          value={stats.publishedEvents}
          subtitle="Active on public site"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingEvents}
          subtitle="Under admin review"
          icon={Clock}
        />
        <StatCard
          title="Active Bookings"
          value={stats.totalActiveBookings}
          subtitle="Enrolled student seats"
          icon={Users}
          trend="Live Roster"
        />
      </div>

      {/* Events Table Overview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-main uppercase tracking-wider">
              Recent Event Submissions
            </h2>
            <p className="text-xs text-muted">
              Live status of your campus programs and seat capacities.
            </p>
          </div>
          <Link to="/organizer/events" className="text-xs font-semibold text-primary hover:underline">
            View All Events
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton variant="row" />
            <LoadingSkeleton variant="row" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-xs text-muted py-4">No events created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-subtle text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Event Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Capacity</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {events.slice(0, 5).map((evt) => (
                  <tr key={evt._id || evt.id} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'}
                          alt={evt.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <span className="font-semibold text-main truncate max-w-xs">
                          {evt.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 capitalize text-muted">{evt.category}</td>
                    <td className="py-3.5 pr-4 text-muted">{formatDate(evt.startDateTime)}</td>
                    <td className="py-3.5 pr-4">
                      <span className="font-semibold text-main">{evt.capacity - evt.availableSeats}</span>
                      <span className="text-muted"> / {evt.capacity} seats</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={evt.status} size="sm" dot>
                        {evt.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link to={`/events/${evt._id || evt.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
