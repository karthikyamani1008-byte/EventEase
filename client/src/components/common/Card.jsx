import React from 'react';

export default function Card({
  children,
  className = '',
  interactive = false,
  padding = 'normal', // 'none' | 'sm' | 'normal' | 'lg'
  onClick,
  ...props
}) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:shadow-soft-lg hover:border-primary/40 hover:-translate-y-0.5'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-subtle rounded-2xl shadow-soft ${paddings[padding] || paddings.normal} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
