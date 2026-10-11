import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin
} from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/feedback/EmptyState';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { ConfirmModal } from '../../../components/common/Modal';
import CreateEditEventModal from './CreateEditEventModal';
import { useToast } from '../../../context/ToastContext';
import { organizerService } from '../../../services/organizerService';
import { eventService } from '../../../services/eventService';
import { formatDate, formatCurrency } from '../../../utils/formatters';

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const toast = useToast();

  const fetchOrganizerEvents = async () => {
    setIsLoading(true);
    try {
      const res = await organizerService.getMyEvents();
      if (res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      toast.error('Failed to load your organized events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const handleCreateNew = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setModalOpen(true);
  };

  const handleSaveEvent = async (eventFormData) => {
    try {
      if (editingEvent) {
        const res = await eventService.updateEvent(editingEvent._id || editingEvent.id, eventFormData);
        const updated = res.data?.event;
        setEvents((prev) =>
          prev.map((e) => (e._id === updated._id || e.id === updated._id ? updated : e))
        );
        toast.success(res.message || 'Event updated successfully.');
      } else {
        const res = await eventService.createEvent(eventFormData);
        const created = res.data?.event;
        setEvents((prev) => [created, ...prev]);
        toast.success(res.message || 'Event proposal submitted for admin review!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePrompt = (evt) => {
    setEventToDelete(evt);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await eventService.deleteEvent(eventToDelete._id || eventToDelete.id);
      setEvents((prev) =>
        prev.filter((e) => (e._id !== eventToDelete._id && e.id !== eventToDelete.id))
      );
      setDeleteConfirmOpen(false);
      toast.error(`Event "${eventToDelete.title}" has been deleted.`);
      setEventToDelete(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">
            Manage My Events
          </h1>
          <p className="text-xs text-muted">
            Create, update, and inspect student registration capacities.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={PlusCircle}
          onClick={handleCreateNew}
        >
          Create New Event
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface border border-subtle rounded-xl self-start w-fit">
        {['all', 'approved', 'pending', 'rejected'].map((tab) => (
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

      {/* Events List */}
      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton variant="row" />
          <LoadingSkeleton variant="row" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description={`There are currently no events with status "${activeTab}".`}
          actionText="Submit Event Proposal"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((evt) => (
            <Card key={evt._id || evt.id} className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Event info */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={evt.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'}
                    alt={evt.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-subtle"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={evt.status} size="sm" dot>
                        {evt.status.toUpperCase()}
                      </Badge>
                      <Badge variant={evt.category} size="sm">
                        {evt.category}
                      </Badge>
                      <span className="text-xs font-semibold text-main">
                        {formatCurrency(evt.price)}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-main truncate">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(evt.startDateTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted" />
                        {evt.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted" />
                        <span className="font-semibold text-main">
                          {evt.capacity - evt.availableSeats}
                        </span>
                        <span>/ {evt.capacity} booked</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-subtle self-end lg:self-center">
                  <Link to={`/events/${evt._id || evt.id}`}>
                    <Button variant="outline" size="sm">
                      Public View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Edit2}
                    onClick={() => handleEdit(evt)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    leftIcon={Trash2}
                    onClick={() => handleDeletePrompt(evt)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Rejection Alert if applicable */}
              {evt.status === 'rejected' && evt.rejectionReason && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-status-danger mt-0.5" />
                  <div>
                    <span className="font-bold">Rejection Reason from Administrator: </span>
                    <span>{evt.rejectionReason}</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <CreateEditEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialEvent={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Event Proposal?"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This will permanently remove the event and all associated capacity.`}
        confirmText="Yes, Delete Event"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
