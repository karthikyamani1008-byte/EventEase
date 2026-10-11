import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventFilters from '../../components/events/EventFilters';
import EventGrid from '../../components/events/EventGrid';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { eventService } from '../../services/eventService';
import { useToast } from '../../context/ToastContext';

const ITEMS_PER_PAGE = 6;

export default function ExploreEventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'upcoming');
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change externally
  useEffect(() => {
    const querySearch = searchParams.get('search');
    if (querySearch !== null && querySearch !== searchTerm) {
      setSearchTerm(querySearch);
    }
    const queryCat = searchParams.get('category');
    if (queryCat !== null && queryCat !== selectedCategory) {
      setSelectedCategory(queryCat);
    }
  }, [searchParams]);

  // Fetch live events from backend API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: locationTerm || undefined,
          price: priceFilter !== 'all' ? priceFilter : undefined,
          sort: sortBy,
        };

        const res = await eventService.getEvents(params);
        if (res.data) {
          setEvents(res.data.events || []);
          setTotalCount(res.data.pagination?.total || 0);
          setTotalPages(res.data.pagination?.pages || 1);
        }
      } catch (err) {
        toast.error('Failed to load live events from server. Check backend connection.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEvents();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, locationTerm, selectedCategory, priceFilter, sortBy, currentPage]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 'upcoming') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    updateUrlParams({ category: cat });
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateUrlParams({ search: term });
  };

  const handleLocationChange = (loc) => {
    setLocationTerm(loc);
    setCurrentPage(1);
    updateUrlParams({ location: loc });
  };

  const handlePriceFilterChange = (price) => {
    setPriceFilter(price);
    setCurrentPage(1);
    updateUrlParams({ price });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateUrlParams({ sort });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setSelectedCategory('all');
    setPriceFilter('all');
    setSortBy('upcoming');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Campus Catalog (Live API)
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight">
            Explore Campus Events
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Find and register for academic workshops, technical hackathons, cultural festivals, and more.
          </p>
        </div>
        <div className="text-xs text-muted font-medium bg-surface px-3 py-1.5 rounded-xl border border-subtle">
          Showing <span className="font-bold text-main">{totalCount}</span> live events
        </div>
      </div>

      {/* Filters Bar */}
      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        locationTerm={locationTerm}
        onLocationChange={handleLocationChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceFilter={priceFilter}
        onPriceFilterChange={handlePriceFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
      />

      {/* Events Grid with Live Data */}
      <EventGrid
        events={events}
        isLoading={isLoading}
        emptyTitle="No matching events found"
        emptyDescription="We couldn't find any events matching your active search or filters. Try clearing some filters."
        onResetFilters={handleResetFilters}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}
