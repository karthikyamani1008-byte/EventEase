import React from 'react';
import { CalendarSearch } from 'lucide-react';
import Button from '../common/Button';

export default function EmptyState({
  icon: Icon = CalendarSearch,
  title = 'No items found',
  description = 'There are no items matching your criteria at this moment.',
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface border border-dashed border-subtle rounded-2xl ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4 shadow-soft-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-main mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted max-w-sm mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
