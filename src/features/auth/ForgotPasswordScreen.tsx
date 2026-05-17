import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, AlertCircle, CheckCircle2, Loader2, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');

    if (!email.trim()) return;

    try {
      await forgotPassword(email);
      setSuccessMessage('A password reset link and token have been sent to your email.');
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
      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#1A7A4A]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Enter your registered email address below and we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success State */}
          {successMessage && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="w-full h-12 border border-[#1A7A4A] text-[#1A7A4A] font-semibold text-sm rounded-xl
                  active:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                Enter Password Reset Code
              </button>
            </div>
          )}

          {!successMessage && (
            <>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full h-14 bg-[#1A7A4A] text-white font-semibold text-base rounded-xl
                  active:scale-[0.98] transition-transform
                  disabled:opacity-50 disabled:active:scale-100
                  flex items-center justify-center gap-2 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
