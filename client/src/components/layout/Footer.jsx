import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-subtle mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-main">EventEase</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Discover, organize, and experience premier college events, hackathons, and academic seminars in one unified hub.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Built for campus innovators & leaders</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-primary transition-colors">Explore All Events</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About the Platform</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">Create Free Account</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main mb-4">
              Event Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/events?category=technology" className="hover:text-primary transition-colors">Technology & AI</Link>
              </li>
              <li>
                <Link to="/events?category=hackathons" className="hover:text-primary transition-colors">National Hackathons</Link>
              </li>
              <li>
                <Link to="/events?category=workshops" className="hover:text-primary transition-colors">Skill Workshops</Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="hover:text-primary transition-colors">Cultural & Arts Fests</Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-primary transition-colors">Athletics & Sports</Link>
              </li>
            </ul>
          </div>

          {/* Campus Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-main mb-4">
              Campus Support
            </h4>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Student Activities Center, Campus Central Complex</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:support@eventease.campus.edu" className="hover:text-primary">
                  support@eventease.campus.edu
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-muted pt-2 border-t border-subtle">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Verified Official College Platform</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} EventEase. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus students and organizers
          </p>
        </div>
      </div>
    </footer>
  );
}
