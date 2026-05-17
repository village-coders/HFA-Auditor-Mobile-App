/**
 * Login Screen
 * Clean mobile login form with email + password
 * "Remember me" toggle, error states, no registration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function LoginScreen() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      await signIn({ email, password, rememberMe });
      navigate('/home', { replace: true });
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div className="w-20 h-20 rounded-2xl bg-[#1A7A4A] flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Halal Auditor
        </h1>
        <p className="text-gray-500 text-sm">
          Field Audit Management
        </p>
      </div>

      {/* Login Form */}
      <div className="px-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              placeholder="your@email.com"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                placeholder:text-gray-400 transition-all"
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                placeholder="Enter your password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                  focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                  placeholder:text-gray-400 transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  rememberMe
                    ? 'bg-[#1A7A4A] border-[#1A7A4A]'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">Remember me</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-[#1A7A4A] active:opacity-60"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full h-14 bg-[#1A7A4A] text-white font-semibold text-base rounded-xl
              active:scale-[0.98] transition-transform
              disabled:opacity-50 disabled:active:scale-100
              flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo hint */}
          <p className="text-xs text-gray-400 text-center pt-2">
            For demo: Use any email and password (min 4 characters)
          </p>
        </form>
      </div>
    </div>
  );
}
