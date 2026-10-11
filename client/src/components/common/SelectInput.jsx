import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function SelectInput({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // [{ label: 'Option', value: 'opt' }]
  placeholder = 'Select an option',
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

      <div className="relative">
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none rounded-xl border bg-surface py-2.5 pl-3.5 pr-10 text-sm text-main transition-all duration-150 outline-none
            ${
              error
                ? 'border-status-danger focus:border-status-danger focus:ring-2 focus:ring-status-danger/20'
                : 'border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${disabled ? 'bg-canvas opacity-70 cursor-not-allowed' : 'hover:border-primary/40 cursor-pointer'}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="text-main">
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

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
