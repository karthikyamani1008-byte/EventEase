import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-status-dangerLight/40 border border-rose-200 rounded-2xl ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-status-danger mb-4 shadow-soft-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-main mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          leftIcon={RotateCcw}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
