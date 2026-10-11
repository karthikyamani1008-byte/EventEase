import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, MapPin, Calendar, Building, AlertCircle } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import TextArea from '../../../components/common/TextArea';
import EmptyState from '../../../components/feedback/EmptyState';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { useToast } from '../../../context/ToastContext';
import { adminService } from '../../../services/adminService';
import { formatDate, formatTime, formatCurrency } from '../../../utils/formatters';

export default function AdminApprovalsPage() {
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const fetchPendingEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingEvents();
      if (res.data?.events) {
        setPendingList(res.data.events);
      }
    } catch (err) {
      toast.error('Failed to load pending events from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (evt) => {
    setIsProcessing(true);
    try {
      const res = await adminService.updateEventApproval(evt._id || evt.id, 'approve');
      setPendingList((prev) => prev.filter((item) => (item._id || item.id) !== (evt._id || evt.id)));
      toast.success(res.message || `Approved "${evt.title}"!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenRejectModal = (evt) => {
    setSelectedEvent(evt);
    setRejectionReason('');
    setRejectionError('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectionError('A clear rejection reason is required so the organizer can revise their proposal.');
      return;
    }

    setIsProcessing(true);
    try {
      const targetId = selectedEvent._id || selectedEvent.id;
      const res = await adminService.updateEventApproval(targetId, 'reject', rejectionReason);
      setPendingList((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
      setRejectModalOpen(false);
      toast.error(res.message || `Rejected "${selectedEvent.title}".`);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">
          Event Approvals & Quality Review
        </h1>
        <p className="text-xs text-muted">
          Review submissions by campus student organizations before publishing to the catalog.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      ) : pendingList.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All Caught Up!"
          description="There are no pending event proposals waiting for review at this time."
        />
      ) : (
        <div className="space-y-4">
          {pendingList.map((evt) => (
            <Card key={evt._id || evt.id} className="p-6 space-y-4 border-amber-200">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="pending" size="sm" dot>Pending Review</Badge>
                    <Badge variant={evt.category} size="sm">{evt.category}</Badge>
                    <Badge variant={evt.isFree ? 'free' : 'paid'} size="sm">
                      {formatCurrency(evt.price)}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-main">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-main/80 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                    <span className="flex items-center gap-1.5 font-medium text-primary">
                      <Building className="w-3.5 h-3.5" />
                      {evt.organizer?.name} ({evt.organizer?.department || 'Student Organization'})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      {formatDate(evt.startDateTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted" />
                      {evt.venue}
                    </span>
                    <span>Capacity: <strong className="text-main">{evt.capacity} seats</strong></span>
                  </div>
                </div>

                {/* Approve & Reject Actions */}
                <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-subtle">
                  <Button
                    variant="dangerOutline"
                    size="md"
                    leftIcon={XCircle}
                    onClick={() => handleOpenRejectModal(evt)}
                    disabled={isProcessing}
                  >
                    Reject with Reason
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={CheckCircle2}
                    onClick={() => handleApprove(evt)}
                    disabled={isProcessing}
                  >
                    Approve & Publish
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mandatory Rejection Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Event Proposal"
        description={`Provide a constructive reason explaining why "${selectedEvent?.title}" cannot be approved in its current form.`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 pt-2">
          <TextArea
            label="Rejection Reason (Required)"
            rows={4}
            placeholder="e.g., Venue conflicts with campus examinations schedule. Please adjust timing or select an alternative seminar hall."
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setRejectionError('');
            }}
            error={rejectionError}
            required
          />

          <div className="pt-4 border-t border-subtle flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setRejectModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              type="submit"
              isLoading={isProcessing}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
