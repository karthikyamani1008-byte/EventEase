import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl sm:text-3xl font-bold text-main">
          {value}
        </h4>
        {trend && (
          <span className="text-xs font-medium text-status-success">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-muted">
          {subtitle}
        </p>
      )}
    </Card>
  );
}
