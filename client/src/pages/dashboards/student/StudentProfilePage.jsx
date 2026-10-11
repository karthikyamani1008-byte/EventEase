import React, { useState } from 'react';
import { User, Mail, GraduationCap, Shield, Save } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import Badge from '../../../components/common/Badge';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function StudentProfilePage() {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || 'Alex Johnson');
  const [email] = useState(currentUser?.email || 'alex.johnson@campus.edu');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'CS-2023-049');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Student profile preferences saved.');
    }, 400);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-main tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs text-muted">
          Your personal academic credentials associated with EventEase registrations.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-subtle">
          <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary font-bold text-2xl flex items-center justify-center">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-main">{name}</h2>
              <Badge variant={currentUser?.role || 'student'} size="sm">
                {(currentUser?.role || 'student').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted mt-0.5">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={User}
              required
            />
            <FormInput
              label="Campus Email"
              value={email}
              disabled
              leftIcon={Mail}
              helperText="Managed by campus SSO"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Department / Major"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              leftIcon={GraduationCap}
            />
            <FormInput
              label="Student ID / Roll No."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              leftIcon={Shield}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={Save}
              isLoading={isSaving}
            >
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
