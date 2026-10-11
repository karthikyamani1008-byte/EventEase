import React from 'react';

export default function LoadingSkeleton({ className = '', variant = 'text' }) {
  if (variant === 'card') {
    return (
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-soft animate-pulse flex flex-col gap-4">
        <div className="w-full h-44 bg-canvas rounded-xl" />
        <div className="h-4 bg-canvas rounded w-1/3" />
        <div className="h-6 bg-canvas rounded w-3/4" />
        <div className="h-4 bg-canvas rounded w-1/2" />
        <div className="pt-3 border-t border-subtle flex justify-between items-center">
          <div className="h-5 bg-canvas rounded w-1/4" />
          <div className="h-8 bg-canvas rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-soft animate-pulse">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-canvas rounded w-24" />
          <div className="w-10 h-10 bg-canvas rounded-xl" />
        </div>
        <div className="h-8 bg-canvas rounded w-16 mb-2" />
        <div className="h-3 bg-canvas rounded w-32" />
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="p-4 border-b border-subtle animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-canvas rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-canvas rounded w-1/3" />
            <div className="h-3 bg-canvas rounded w-1/4" />
          </div>
        </div>
        <div className="h-8 bg-canvas rounded w-24" />
      </div>
    );
  }

  return (
    <div
      className={`bg-canvas/80 animate-pulse rounded-lg ${className || 'h-4 w-full'}`}
    />
  );
}
