import React, { useState, useEffect } from 'react';
import { Search, Users, Shield, UserX, UserCheck, Mail } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import LoadingSkeleton from '../../../components/feedback/LoadingSkeleton';
import { useToast } from '../../../context/ToastContext';
import { adminService } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const toast = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers({
        search: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
      if (res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await adminService.updateUserStatus(user._id || user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => ((u._id === user._id || u.id === user.id) ? { ...u, status: nextStatus } : u))
      );
      toast.info(res.message || `Account for ${user.name} set to ${nextStatus.toUpperCase()}.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">
          User Directory & Governance
        </h1>
        <p className="text-xs text-muted">
          Manage campus student accounts, verified club organizers, and platform administrators.
        </p>
      </div>

      {/* Controls Bar */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <FormInput
              placeholder="Search by name, campus email, or department..."
              leftIcon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sm:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 rounded-xl border border-subtle bg-surface px-3 py-2 text-xs text-main font-medium outline-none focus:border-primary"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="organizer">Club Organizers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton variant="row" />
            <LoadingSkeleton variant="row" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-muted text-center py-6">No users match your search criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-subtle text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">User Profile</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-canvas/60">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-main truncate">{u.name}</div>
                          <div className="text-[11px] text-muted truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={u.role} size="sm">
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4 text-muted truncate max-w-[200px]">
                      {u.department || 'Campus Community'}
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active' ? 'bg-status-success' : 'bg-status-danger'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <Button
                          variant={u.status === 'active' ? 'dangerOutline' : 'outline'}
                          size="sm"
                          leftIcon={u.status === 'active' ? UserX : UserCheck}
                          onClick={() => toggleUserStatus(u)}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
