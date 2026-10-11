import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Mail, Lock, User, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState('student'); // Strictly 'student' or 'organizer'
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        department,
        studentId,
      });

      toast.success(`Welcome to EventEase, ${user.name}!`);

      if (user.role === 'organizer') {
        navigate('/organizer', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-main">EventEase</span>
          </Link>
          <h2 className="text-2xl font-bold text-main tracking-tight">
            Create Your Campus Account
          </h2>
          <p className="text-xs text-muted">
            Join students and campus club organizers on EventEase.
          </p>
        </div>

        <Card className="p-6 sm:p-8 shadow-soft-lg border-subtle">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-main uppercase tracking-wider mb-1.5">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                    role === 'student'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-canvas text-muted border-subtle hover:text-main'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('organizer')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                    role === 'organizer'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-canvas text-muted border-subtle hover:text-main'
                  }`}
                >
                  Club Organizer
                </button>
              </div>
            </div>

            <FormInput
              label="Full Name"
              placeholder="Alex Johnson"
              leftIcon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormInput
              label="Campus Email"
              type="email"
              placeholder="alex@campus.edu"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              leftIcon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {role === 'student' ? (
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Student ID"
                  placeholder="CS-2024-001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <FormInput
                  label="Department"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            ) : (
              <FormInput
                label="Department / Faculty Body"
                placeholder="School of Engineering & Technology"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            )}

            <div className="text-[11px] text-muted flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Admin accounts are strictly provisioned by system seeds.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-subtle text-center text-xs text-muted">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
