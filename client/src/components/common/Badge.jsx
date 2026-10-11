import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  const variants = {
    default: 'bg-canvas text-main border-subtle',
    primary: 'bg-primary-light text-primary-dark border-primary/20',
    accent: 'bg-accent-blue text-accent-blueDark border-blue-200',
    // Event & Booking Statuses
    approved: 'bg-status-successLight text-status-success border-emerald-200',
    pending: 'bg-status-warningLight text-status-warning border-amber-200',
    rejected: 'bg-status-dangerLight text-status-danger border-rose-200',
    cancelled: 'bg-gray-100 text-muted border-gray-200',
    draft: 'bg-gray-100 text-main border-gray-200',
    // Price / Category
    free: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    paid: 'bg-primary-light text-primary-dark border-primary/20',
    // Roles
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    organizer: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const dotColors = {
    approved: 'bg-status-success',
    pending: 'bg-status-warning',
    rejected: 'bg-status-danger',
    cancelled: 'bg-gray-400',
    draft: 'bg-gray-400',
    default: 'bg-muted',
    primary: 'bg-primary',
    accent: 'bg-accent-blueDark',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-current'}`}
        />
      )}
      {children}
    </span>
  );
}
