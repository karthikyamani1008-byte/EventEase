import React from 'react';
import { Calendar, Shield, Sparkles, Users, Award, Heart, Mail, MapPin } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">About EventEase</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-main tracking-tight">
          Empowering Campus Life Through Seamless Events
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          EventEase was founded to bridge the gap between enthusiastic campus students and passionate student club organizers, transforming how college events are discovered, coordinated, and celebrated.
        </p>
      </div>

      {/* Pillars / Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-main">Centralized Discovery</h3>
          <p className="text-sm text-muted leading-relaxed">
            No more scattered noticeboards or missed announcements. Every workshop, hackathon, and guest talk is indexed in one beautiful hub.
          </p>
        </Card>

        <Card className="p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue text-accent-blueDark flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-main">Fair & Atomic Booking</h3>
          <p className="text-sm text-muted leading-relaxed">
            Our booking engine enforces strict capacity safeguards and eliminates overbooking, giving every student equal opportunity.
          </p>
        </Card>

        <Card className="p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-main">Community-Driven</h3>
          <p className="text-sm text-muted leading-relaxed">
            Built by students, for students. Empowering club leads to track rosters effortlessly and platform admins to verify quality.
          </p>
        </Card>
      </div>

      {/* Campus Context & Stats */}
      <div className="bg-surface border border-subtle rounded-3xl p-8 sm:p-12 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Campus Story</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-main">
              Built for Engineering & Creative Campus Excellence
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              From high-stakes hackathons to cultural musical nights, campus activities shape collegiate life. EventEase provides modern digital infrastructure so faculty advisors and student councils can collaborate transparently.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-main">
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-primary" /> Verified Student Access</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> Inclusive Programs</span>
            </div>
          </div>

          <div className="bg-canvas border border-subtle rounded-2xl p-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-surface rounded-xl border border-subtle">
              <div className="text-3xl font-extrabold text-main">100+</div>
              <div className="text-xs text-muted mt-1">Campus Programs</div>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-subtle">
              <div className="text-3xl font-extrabold text-main">5,000+</div>
              <div className="text-xs text-muted mt-1">Student Participants</div>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-subtle">
              <div className="text-3xl font-extrabold text-main">25+</div>
              <div className="text-xs text-muted mt-1">Active Campus Clubs</div>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-subtle">
              <div className="text-3xl font-extrabold text-main">99.9%</div>
              <div className="text-xs text-muted mt-1">Booking Reliability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
