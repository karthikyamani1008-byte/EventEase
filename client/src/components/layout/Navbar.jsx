import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Menu, X, ArrowRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Events', path: '/events' },
    { name: 'About', path: '/about' },
  ];

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'organizer') return '/organizer';
    return '/student';
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-subtle shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft transition-transform duration-200 group-hover:scale-105">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-main tracking-tight leading-none group-hover:text-primary transition-colors">
                EventEase
              </span>
              <span className="text-[11px] text-muted font-medium tracking-wide">
                Campus Events Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-light text-primary-dark font-semibold'
                      : 'text-main/80 hover:text-main hover:bg-canvas'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Actions (Auth or Dashboard) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath()}>
                  <Button variant="outline" size="sm" leftIcon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-subtle">
                  <span className="text-xs font-semibold text-main">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={onLogout}
                    title="Logout"
                    className="p-2 rounded-lg text-muted hover:text-status-danger hover:bg-status-dangerLight transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-muted hover:text-main hover:bg-canvas focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-subtle bg-surface px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-main hover:bg-canvas"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-subtle flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="md" className="w-full" leftIcon={LayoutDashboard}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  leftIcon={LogOut}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout && onLogout();
                  }}
                >
                  Log Out ({currentUser.name})
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Register Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
