import React from 'react';
import EventCard from './EventCard';
import LoadingSkeleton from '../feedback/LoadingSkeleton';
import EmptyState from '../feedback/EmptyState';

export default function EventGrid({
  events = [],
  isLoading = false,
  emptyTitle = 'No events found',
  emptyDescription = 'Try adjusting your search criteria, dates, or category filters.',
  onResetFilters,
  skeletonCount = 6,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <LoadingSkeleton key={`skel-${i}`} variant="card" />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id || event._id} event={event} />
      ))}
    </div>
  );
}
