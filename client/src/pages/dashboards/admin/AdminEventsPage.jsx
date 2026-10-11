import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { adminService } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchPlatformEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getEvents({
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      if (res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlatformEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">
          Platform Events Management
        </h1>
        <p className="text-xs text-muted">
          Master registry of all published, past, and upcoming campus programs.
        </p>
      </div>

      {/* Controls Bar */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <FormInput
              placeholder="Search event titles, organizers, or venues..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sm:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 rounded-xl border border-subtle bg-surface px-3 py-2 text-xs text-main font-medium outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="workshops">Workshops</option>
              <option value="hackathons">Hackathons</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Events Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton variant="row" />
            <LoadingSkeleton variant="row" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-xs text-muted text-center py-6">No events match your search criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-subtle text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Event</th>
                  <th className="pb-3 font-semibold">Organizer</th>
                  <th className="pb-3 font-semibold">Date & Venue</th>
                  <th className="pb-3 font-semibold">Registrations</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {events.map((e) => (
                  <tr key={e._id || e.id} className="hover:bg-canvas/60">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'}
                          alt={e.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <span className="font-semibold text-main truncate max-w-xs">{e.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-muted truncate max-w-[160px]">
                      {e.organizer?.name || 'Club'}
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      <div>{formatDate(e.startDateTime)}</div>
                      <div className="text-[11px] text-muted/80">{e.venue}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-semibold text-main">{e.capacity - e.availableSeats}</span>
                      <span className="text-muted"> / {e.capacity}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={e.status} size="sm" dot>
                        {e.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link to={`/events/${e._id || e.id}`}>
                        <Button variant="outline" size="sm" rightIcon={ArrowUpRight}>
                          View Details
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
