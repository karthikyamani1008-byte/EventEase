import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'organizer') {
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

  // Quick fill helper for convenience during development/portfolio review
  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
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
            Sign In to Your Account
          </h2>
          <p className="text-xs text-muted">
            Enter your campus credentials to access events and manage bookings.
          </p>
        </div>

        <Card className="p-6 sm:p-8 shadow-soft-lg border-subtle">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Campus Email"
              type="email"
              placeholder="name@campus.edu"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Pill Bar */}
          <div className="mt-6 pt-5 border-t border-subtle space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted uppercase tracking-wider">
              <span>Quick Demo Logins</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@eventease.com', 'AdminSecurePass123!')}
                className="p-1.5 rounded-lg border border-purple-200 bg-purple-50/60 text-purple-900 font-medium hover:bg-purple-100 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('gdsc.lead@campus.edu', 'OrganizerPass123!')}
                className="p-1.5 rounded-lg border border-blue-200 bg-blue-50/60 text-blue-900 font-medium hover:bg-blue-100 transition-colors"
              >
                Organizer
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('alex.johnson@campus.edu', 'StudentPass123!')}
                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-emerald-900 font-medium hover:bg-emerald-100 transition-colors"
              >
                Student
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-subtle text-center text-xs text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
