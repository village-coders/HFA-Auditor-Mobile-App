import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Key, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  // Extract token from URL if present
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    setSuccessMessage('');

    if (!token.trim()) {
      setValidationError('Please enter your reset token or code.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessMessage('Password reset successful! You can now log in with your new password.');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex items-center">
        <button
          onClick={() => { clearError(); navigate('/login'); }}
          className="flex items-center gap-1 text-gray-500 active:opacity-60 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back to Login</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-[#1A7A4A]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Please enter your reset code/token and choose a secure new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error States */}
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error || validationError}</p>
            </div>
          )}

          {/* Success State */}
          {successMessage && (
            <div className="space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full h-14 bg-[#1A7A4A] text-white font-semibold text-base rounded-xl
                  active:scale-[0.98] transition-transform shadow-md flex items-center justify-center"
              >
                Go to Sign In
              </button>
            </div>
          )}

          {!successMessage && (
            <>
              {/* Reset Token Input */}
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reset Token / Code
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setValidationError(''); clearError(); }}
                  placeholder="Paste or enter the token from email"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                    placeholder:text-gray-400 transition-all font-mono text-sm"
                />
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setValidationError(''); clearError(); }}
                    placeholder="At least 6 characters"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                      focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                      placeholder:text-gray-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(''); clearError(); }}
                  placeholder="Re-enter your new password"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1A7A4A] focus:border-transparent
                    placeholder:text-gray-400 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !token.trim() || !password.trim() || !confirmPassword.trim()}
                className="w-full h-14 bg-[#1A7A4A] text-white font-semibold text-base rounded-xl
                  active:scale-[0.98] transition-transform
                  disabled:opacity-50 disabled:active:scale-100
                  flex items-center justify-center gap-2 shadow-md pt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
