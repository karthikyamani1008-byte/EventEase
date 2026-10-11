import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Button from '../common/Button';
import { sampleCategories } from '../../data/sampleEvents';

export default function EventFilters({
  searchTerm,
  onSearchChange,
  locationTerm,
  onLocationChange,
  selectedCategory,
  onCategoryChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortChange,
  onReset,
}) {
  const hasActiveFilters =
    searchTerm || locationTerm || selectedCategory !== 'all' || priceFilter !== 'all' || sortBy !== 'upcoming';

  return (
    <div className="bg-surface border border-subtle rounded-2xl p-4 sm:p-6 shadow-soft space-y-4">
      {/* Search Input Bar (Keyword + Location) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by event title, topic, or keyword..."
            className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-2.5 text-sm text-main placeholder:text-muted/60 transition-all duration-150 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
          />
        </div>

        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={locationTerm}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Filter by venue or location..."
            className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-2.5 text-sm text-main placeholder:text-muted/60 transition-all duration-150 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sampleCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border
                ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-canvas text-muted border-subtle hover:text-main hover:border-primary/40'
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls: Price, Sort & Reset */}
      <div className="pt-3 border-t border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Price selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted font-medium">Pricing:</span>
            <select
              value={priceFilter}
              onChange={(e) => onPriceFilterChange(e.target.value)}
              className="rounded-lg border border-subtle bg-surface px-2.5 py-1.5 text-xs text-main font-medium outline-none focus:border-primary cursor-pointer hover:border-primary/40"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid Only</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-lg border border-subtle bg-surface px-2.5 py-1.5 text-xs text-main font-medium outline-none focus:border-primary cursor-pointer hover:border-primary/40"
            >
              <option value="upcoming">Upcoming Date (Earliest first)</option>
              <option value="title">Alphabetical (A - Z)</option>
              <option value="seats">Available Seats</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-status-danger hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
