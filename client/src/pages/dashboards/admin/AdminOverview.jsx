import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Calendar,
  BookmarkCheck,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { adminService } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalBookings: 0,
    pendingEvents: 0,
  });
  const [pendingQueue, setPendingQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const [dashRes, pendingRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getPendingEvents(),
        ]);

        if (dashRes.data?.stats) {
          setStats(dashRes.data.stats);
        }
        if (pendingRes.data?.events) {
          setPendingQueue(pendingRes.data.events);
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-primary-light to-canvas border border-purple-200 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-sm">
        <div className="space-y-2">
          <Badge variant="admin" size="sm">System Administration</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-sm text-muted max-w-xl">
            You have <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">{stats.pendingEvents} events pending review</span> before they can appear on the public campus catalog.
          </p>
        </div>
        <Link to="/admin/approvals">
          <Button variant="primary" size="lg" leftIcon={FileCheck}>
            Review Pending Submissions
          </Button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          subtitle="Students & faculty"
          icon={Users}
        />
        <StatCard
          title="Campus Organizers"
          value={stats.totalOrganizers}
          subtitle="Approved clubs"
          icon={Building2}
        />
        <StatCard
          title="Total Platform Events"
          value={stats.totalEvents}
          subtitle="Active & archive"
          icon={Calendar}
        />
        <StatCard
          title="All-Time Bookings"
          value={stats.totalBookings}
          subtitle="Confirmed passes"
          icon={BookmarkCheck}
        />
      </div>

      {/* Grid: Pending Approvals Queue & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Approvals Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-main uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pending Event Approvals ({pendingQueue.length})</span>
            </h2>
            <Link to="/admin/approvals" className="text-xs font-semibold text-primary hover:underline">
              Process All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="row" />
              <LoadingSkeleton variant="row" />
            </div>
          ) : pendingQueue.length === 0 ? (
            <Card className="p-6 text-center text-xs text-muted">
              No pending event submissions waiting for review. All clear!
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingQueue.map((pe) => (
                <Card key={pe._id || pe.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-amber-200">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="pending" size="sm" dot>Pending Review</Badge>
                      <Badge variant={pe.category} size="sm">{pe.category}</Badge>
                      <span className="text-xs text-muted">Submitted by {pe.organizer?.name}</span>
                    </div>
                    <h3 className="font-bold text-base text-main truncate">
                      {pe.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-1">
                      {pe.venue} • {formatDate(pe.startDateTime)} • Capacity: {pe.capacity} seats
                    </p>
                  </div>

                  <Link to="/admin/approvals" className="shrink-0">
                    <Button variant="primary" size="sm">
                      Review Proposal
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-main uppercase tracking-wider">
              Quick Administrative Tasks
            </h3>
            <div className="space-y-2">
              <Link to="/admin/users" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={Users}>
                  Manage User Directory
                </Button>
              </Link>
              <Link to="/admin/events" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={Calendar}>
                  Audit Platform Events
                </Button>
              </Link>
              <Link to="/events" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={Calendar}>
                  View Public Student View
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-canvas border border-subtle space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Security Notice</span>
            <p className="text-xs text-muted leading-relaxed">
              Administrative role cannot be self-assigned through public registration. All admin sessions are protected with strict RBAC guards.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
