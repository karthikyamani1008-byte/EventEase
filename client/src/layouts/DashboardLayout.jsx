import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  Compass,
  BookmarkCheck,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Layers,
  Settings,
  ArrowLeft
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function DashboardLayout({ currentUser, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback demo user if not logged in
  const user = currentUser || {
    name: 'Alex Johnson',
    email: 'alex.johnson@campus.edu',
    role: location.pathname.startsWith('/admin')
      ? 'admin'
      : location.pathname.startsWith('/organizer')
      ? 'organizer'
      : 'student',
  };

  // Role-specific navigation items
  const studentNav = [
    { label: 'Overview', path: '/student', icon: LayoutDashboard, end: true },
    { label: 'My Bookings', path: '/student/bookings', icon: BookmarkCheck },
    { label: 'Explore Events', path: '/events', icon: Compass },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const organizerNav = [
    { label: 'Overview', path: '/organizer', icon: LayoutDashboard, end: true },
    { label: 'My Events', path: '/organizer/events', icon: Calendar },
    { label: 'Create Event', path: '/organizer/create', icon: PlusCircle },
    { label: 'Attendees & Roster', path: '/organizer/attendees', icon: Users },
    { label: 'Public Catalog', path: '/events', icon: Compass },
  ];

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Event Approvals', path: '/admin/approvals', icon: FileCheck, badge: '2' },
    { label: 'Manage Events', path: '/admin/events', icon: Layers },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Public Catalog', path: '/events', icon: Compass },
  ];

  const currentNav =
    user.role === 'admin'
      ? adminNav
      : user.role === 'organizer'
      ? organizerNav
      : studentNav;

  return (
    <div className="min-h-screen bg-canvas text-main flex">
      {/* 1. Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-main/30 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Left Sidebar (Fixed on Desktop, Drawer on Mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-subtle flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-soft-lg' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 sm:h-20 px-6 border-b border-subtle flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-main leading-tight">EventEase</span>
                <span className="text-[10px] text-muted font-medium capitalize">
                  {user.role} Portal
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-muted hover:text-main rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">
              Navigation
            </div>
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-light text-primary-dark font-semibold shadow-soft-sm'
                        : 'text-main/80 hover:text-main hover:bg-canvas'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Profile Info & Logout) */}
        <div className="p-4 border-t border-subtle space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-canvas rounded-xl border border-subtle">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary font-bold text-sm flex items-center justify-center shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-main truncate">{user.name}</p>
              <p className="text-[11px] text-muted truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-main"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                onLogout && onLogout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-status-danger hover:underline"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Main Dashboard Workspace (Pushed 64 cols on Desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 sm:h-20 bg-surface/90 backdrop-blur-md border-b border-subtle px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-main hover:bg-canvas"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-main tracking-tight capitalize">
                {user.role} Dashboard
              </h2>
              <p className="text-xs text-muted hidden sm:block">
                Welcome back, {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={user.role} size="md" dot>
              {user.role.toUpperCase()}
            </Badge>
            <Link to="/events" className="hidden sm:block">
              <span className="text-xs font-semibold text-primary hover:underline">
                View Public Catalog
              </span>
            </Link>
          </div>
        </header>

        {/* Nested Page Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
