import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Clock } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useAuth } from '../auth/AuthProvider';
import { toast } from 'sonner';

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const verifyEmailCode = useMutation(api.auth.verifyEmailCode);

  useEffect(() => {
    if (!email) {
      navigate('/auth/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast.error('Please enter the verification code');
      return;
    }

    if (timeLeft === 0) {
      toast.error('Verification code has expired. Please request a new one.');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, code);
      toast.success('Successfully signed in!');
      navigate('/app');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement resend functionality
      toast.success('New code sent!');
      setTimeLeft(300);
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-brand-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LF</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              Verification code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange focus:z-10 sm:text-sm text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {timeLeft > 0 ? (
                  `Code expires in ${formatTime(timeLeft)}`
                ) : (
                  'Code has expired'
                )}
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || timeLeft === 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify code'
              )}
            </button>
          </div>

          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={timeLeft > 0 || isLoading}
              className="text-sm text-brand-orange hover:text-brand-orange-dark disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend code
            </button>
            
            <div>
              <Link
                to="/auth/login"
                className="font-medium text-brand-orange hover:text-brand-orange-dark inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>
            </div>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            Having trouble?{' '}
            <Link to="/" className="font-medium text-brand-orange hover:text-brand-orange-dark">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
