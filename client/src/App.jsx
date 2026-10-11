import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import ExploreEventsPage from './pages/public/ExploreEventsPage';
import EventDetailsPage from './pages/public/EventDetailsPage';
import AboutPage from './pages/public/AboutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Dashboard Pages
import StudentOverview from './pages/dashboards/student/StudentOverview';
import MyBookingsPage from './pages/dashboards/student/MyBookingsPage';
import StudentProfilePage from './pages/dashboards/student/StudentProfilePage';

// Organizer Dashboard Pages
import OrganizerOverview from './pages/dashboards/organizer/OrganizerOverview';
import OrganizerEventsPage from './pages/dashboards/organizer/OrganizerEventsPage';
import OrganizerAttendeesPage from './pages/dashboards/organizer/OrganizerAttendeesPage';

// Admin Dashboard Pages
import AdminOverview from './pages/dashboards/admin/AdminOverview';
import AdminApprovalsPage from './pages/dashboards/admin/AdminApprovalsPage';
import AdminUsersPage from './pages/dashboards/admin/AdminUsersPage';
import AdminEventsPage from './pages/dashboards/admin/AdminEventsPage';

function AppRoutes() {
  const { currentUser, logout } = useAuth();

  return (
    <Routes>
      {/* Public Website Routes */}
      <Route
        element={
          <MainLayout currentUser={currentUser} onLogout={logout} />
        }
      >
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<ExploreEventsPage />} />
        <Route
          path="/events/:id"
          element={<EventDetailsPage currentUser={currentUser} />}
        />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Dashboard (Protected: student role) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <DashboardLayout currentUser={currentUser} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Organizer Dashboard (Protected: organizer role) */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <DashboardLayout currentUser={currentUser} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<OrganizerOverview />} />
        <Route path="events" element={<OrganizerEventsPage />} />
        <Route path="create" element={<OrganizerEventsPage />} />
        <Route path="attendees" element={<OrganizerAttendeesPage />} />
      </Route>

      {/* Admin Dashboard (Protected: strictly admin role) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout currentUser={currentUser} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="approvals" element={<AdminApprovalsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="events" element={<AdminEventsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
