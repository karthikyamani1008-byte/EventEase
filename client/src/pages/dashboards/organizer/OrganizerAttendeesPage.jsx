import React, { useState, useEffect } from 'react';
import { Users, Search, Download, CheckCircle, Ticket, Mail } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import SelectInput from '../../../components/common/SelectInput';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import EmptyState from '../../../components/feedback/EmptyState';
import { organizerService } from '../../../services/organizerService';
import { formatDate } from '../../../utils/formatters';

export default function OrganizerAttendeesPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [searchAttendee, setSearchAttendee] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

  // Load owned events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await organizerService.getMyEvents();
        if (res.data?.events && res.data.events.length > 0) {
          setEvents(res.data.events);
          setSelectedEventId(res.data.events[0]._id || res.data.events[0].id);
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Load attendees when selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchAttendees = async () => {
      setIsLoadingAttendees(true);
      try {
        const res = await organizerService.getEventAttendees(selectedEventId);
        if (res.data?.bookings) {
          setAttendees(res.data.bookings);
        }
      } catch (err) {
        setAttendees([]);
      } finally {
        setIsLoadingAttendees(false);
      }
    };
    fetchAttendees();
  }, [selectedEventId]);

  const eventOptions = events.map((e) => ({
    label: `${e.title} (${e.capacity - e.availableSeats} booked)`,
    value: e._id || e.id,
  }));

  const filteredAttendees = attendees.filter((b) => {
    const sName = b.student?.name || '';
    const sEmail = b.student?.email || '';
    const ref = b.bookingReference || '';
    const q = searchAttendee.toLowerCase();
    return (
      sName.toLowerCase().includes(q) ||
      sEmail.toLowerCase().includes(q) ||
      ref.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">
          Attendee Rosters & Verification
        </h1>
        <p className="text-xs text-muted">
          Inspect confirmed student registrations for door access and attendance.
        </p>
      </div>

      {isLoadingEvents ? (
        <LoadingSkeleton variant="card" />
      ) : events.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="Create an event first to start collecting attendee registrations."
        />
      ) : (
        <>
          {/* Controls Bar */}
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-6">
                <SelectInput
                  label="Select Event"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  options={eventOptions}
                />
              </div>
              <div className="sm:col-span-6">
                <FormInput
                  label="Search Roster"
                  placeholder="Search by student name or #EVT reference..."
                  leftIcon={Search}
                  value={searchAttendee}
                  onChange={(e) => setSearchAttendee(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-main uppercase tracking-wider">
                Confirmed Attendees ({filteredAttendees.length})
              </h2>
            </div>

            {isLoadingAttendees ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="row" />
                <LoadingSkeleton variant="row" />
              </div>
            ) : filteredAttendees.length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">
                No confirmed attendees for this event yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-subtle text-muted uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Student Name</th>
                      <th className="pb-3 font-semibold">Student ID</th>
                      <th className="pb-3 font-semibold">Booking Reference</th>
                      <th className="pb-3 font-semibold">Registration Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {filteredAttendees.map((b) => (
                      <tr key={b._id || b.id} className="hover:bg-canvas/60">
                        <td className="py-3.5 pr-4">
                          <div>
                            <div className="font-semibold text-main">{b.student?.name}</div>
                            <div className="text-[11px] text-muted">{b.student?.email}</div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 font-mono font-medium text-main">
                          {b.student?.studentId || 'N/A'}
                        </td>
                        <td className="py-3.5 pr-4 font-mono font-semibold text-primary">
                          #{b.bookingReference}
                        </td>
                        <td className="py-3.5 pr-4 text-muted">
                          {formatDate(b.bookedAt)}
                        </td>
                        <td className="py-3.5">
                          <Badge variant={b.status === 'confirmed' ? 'approved' : 'cancelled'} size="sm" dot>
                            {b.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
