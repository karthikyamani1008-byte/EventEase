import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../feedback/LoadingSkeleton';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <LoadingSkeleton variant="stat" />
          <LoadingSkeleton variant="text" />
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check -> if user role is not authorized, redirect to their home portal
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'organizer') return <Navigate to="/organizer" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
}
