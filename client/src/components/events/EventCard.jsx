import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';

export default function EventCard({ event }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
  const isFull = event.availableSeats <= 0;
  const isFewLeft = event.availableSeats > 0 && event.availableSeats <= 10;

  return (
    <article className="group bg-surface border border-subtle rounded-2xl shadow-soft transition-all duration-200 hover:shadow-soft-lg hover:border-primary/40 hover:-translate-y-1 flex flex-col overflow-hidden">
      {/* Image Banner with Category & Price Tags */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas">
        <img
          src={imgError ? fallbackImage : (event.bannerImage || fallbackImage)}
          alt={event.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-main/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge
            variant={event.category || 'default'}
            size="sm"
            className="uppercase tracking-wider font-bold bg-white/95 backdrop-blur-sm shadow-soft-sm text-main border-none"
          >
            {event.category}
          </Badge>
          <Badge
            variant={event.isFree || event.price === 0 ? 'free' : 'paid'}
            size="sm"
            className="font-bold shadow-soft-sm"
          >
            {formatCurrency(event.price)}
          </Badge>
        </div>

        {/* Seat Availability Tag on Image */}
        <div className="absolute bottom-3 left-3">
          {isFull ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600/90 text-white backdrop-blur-sm shadow-sm">
              Sold Out
            </span>
          ) : isFewLeft ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-sm shadow-sm">
              Only {event.availableSeats} seats left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-main/80 text-white backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-primary-light" />
              {event.availableSeats} seats available
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{formatDate(event.startDateTime)}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatTime(event.startDateTime)}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-main group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            <Link to={`/events/${event.id || event._id}`} className="focus:outline-none">
              {event.title}
            </Link>
          </h3>

          {/* Venue & Location */}
          <p className="mt-2 text-xs text-muted flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
            <span>{event.venue}</span>
          </p>
        </div>

        {/* Card Footer: Organizer & Action Link */}
        <div className="pt-3 border-t border-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {event.organizer?.avatar ? (
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                {event.organizer?.name ? event.organizer.name.charAt(0) : 'O'}
              </div>
            )}
            <span className="text-xs text-muted truncate">
              {event.organizer?.name || 'Campus Organizer'}
            </span>
          </div>

          <Link
            to={`/events/${event.id || event._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark group/link"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
