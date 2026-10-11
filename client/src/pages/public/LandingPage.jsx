import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Ticket,
  Clock,
  Compass,
  Laptop,
  Lightbulb,
  Music,
  Trophy,
  Code
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import EventCard from '../../components/events/EventCard';
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton';
import { sampleCategories } from '../../data/sampleEvents';
import { eventService } from '../../services/eventService';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLandingEvents = async () => {
      try {
        const res = await eventService.getEvents({ limit: 6, sort: 'upcoming' });
        if (res.data?.events) {
          setFeaturedEvents(res.data.events);
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        setIsLoading(false);
      }
    };
    fetchLandingEvents();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const categoryIcons = {
    technology: Laptop,
    workshops: Lightbulb,
    hackathons: Code,
    cultural: Music,
    sports: Trophy,
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-light/60 via-accent-blue/30 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary-dark text-xs font-semibold mb-6 shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Official Campus Events & Activities Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-main tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Discover Events. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Create Experiences.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            The unified platform for campus life. Find hackathons, tech workshops, cultural fests, and guest lectures — reserve your seat instantly with zero hassle.
          </p>

          {/* Quick Search */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto bg-surface p-2 sm:p-2.5 rounded-2xl border border-subtle shadow-soft-lg flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hackathons, AI workshops, guest seminars..."
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-main placeholder:text-muted/60 outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shrink-0 shadow-sm"
              rightIcon={ArrowRight}
            >
              Explore Events
            </Button>
          </form>

          {/* Social Proof */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-muted">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-success" />
              <span>100% Free for Campus Students</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Verified Campus Organizers</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-accent-blueDark" />
              <span>Instant Digital Booking Pass</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse By Topic</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-main mt-1">Explore Categories</h2>
          </div>
          <Link to="/events" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {sampleCategories.filter(c => c.id !== 'all').map((cat) => {
            const Icon = categoryIcons[cat.id] || Compass;
            return (
              <Link
                key={cat.id}
                to={`/events?category=${cat.id}`}
                className="group bg-surface border border-subtle rounded-2xl p-5 shadow-soft hover:shadow-soft-lg hover:border-primary/50 transition-all duration-200 flex flex-col items-center text-center hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-main group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. LIVE FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Campus Programs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-main mt-1">Upcoming Events</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 6).map((evt) => (
              <EventCard key={evt._id || evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-subtle rounded-3xl p-8 sm:p-12 lg:p-16 shadow-soft">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Seamless Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-main mt-1">How EventEase Works</h2>
            <p className="mt-2 text-sm text-muted">
              From finding exciting opportunities to walking through the auditorium doors in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center shadow-soft">
                01
              </div>
              <h3 className="font-bold text-base text-main">Discover Programs</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Filter by academic domain, hackathons, or cultural fests happening across your college campus.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-dark font-bold text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-base text-main">Reserve Seats</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Book instantly with your student profile. Capacity is updated atomically so you never get bumped.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent-blue text-accent-blueDark font-bold text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-base text-main">Get Digital Pass</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Receive a unique booking reference and view all your confirmed events on your student dashboard.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="font-bold text-base text-main">Attend & Connect</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Show your digital pass at the entrance, network with fellow students, and earn verified participation credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 sm:p-10 border-primary/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-main mb-2">For Students</h3>
              <p className="text-sm text-muted mb-6">
                Never miss an exciting workshop, hackathon prize, or cultural night because of scattered WhatsApp groups.
              </p>

              <ul className="space-y-3 text-sm text-main">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                  <span>Centralized discovery for all college clubs, labs, and sports</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                  <span>One-click booking with unique digital reference codes</span>
                </li>
              </ul>
            </div>
            <div className="pt-8 mt-6 border-t border-subtle">
              <Link to="/events">
                <Button variant="primary" size="md" rightIcon={ArrowRight}>
                  Discover Student Events
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 sm:p-10 border-blue-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-blue text-accent-blueDark flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-main mb-2">For Club Organizers</h3>
              <p className="text-sm text-muted mb-6">
                Manage registrations, enforce venue capacity rules, and streamline administrative approvals.
              </p>

              <ul className="space-y-3 text-sm text-main">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blueDark shrink-0 mt-0.5" />
                  <span>Effortless event creation with venue and capacity controls</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blueDark shrink-0 mt-0.5" />
                  <span>Real-time attendee rosters and live seat availability metrics</span>
                </li>
              </ul>
            </div>
            <div className="pt-8 mt-6 border-t border-subtle">
              <Link to="/register">
                <Button variant="secondary" size="md" rightIcon={ArrowRight}>
                  Host an Event on EventEase
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
