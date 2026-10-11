import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function TextArea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl border bg-surface p-3 text-sm text-main placeholder:text-muted/60 transition-all duration-150 outline-none resize-y
          ${
            error
              ? 'border-status-danger focus:border-status-danger focus:ring-2 focus:ring-status-danger/20'
              : 'border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
          ${disabled ? 'bg-canvas opacity-70 cursor-not-allowed' : 'hover:border-primary/40'}
        `}
        {...props}
      />

      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-status-danger">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
