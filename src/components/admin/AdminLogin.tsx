import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any, token: string) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [email, setEmail] = useState('sumit9354800@gmail.com');
  const [password, setPassword] = useState('ChangeMeInProduction123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center p-4 sm:p-6 text-[#f3f4f6]">
      <div className="w-full max-w-md bg-[#121316] border border-[#22252c] p-6 sm:p-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={onBackToSite}
          id="login-back-to-site"
          className="inline-flex items-center gap-1.5 font-mono-code text-xs text-[#94a3b8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        {/* Brand Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#181b22] border border-[#2e3340] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-mono-code text-xs text-[#717887] uppercase tracking-wider">
              ADMIN CMS AUTHENTICATION
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">
            Sign In to CMS Portal
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Manage projects, skills, real-time hero content, and inquiries.
          </p>
        </div>

        {/* Quick Credentials Demo Helper */}
        <div className="p-3 bg-[#16181f] border border-[#262a34] font-mono-code text-[11px] text-[#cbd5e1] space-y-1">
          <div className="text-white font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
            Default Administrator Credentials
          </div>
          <div>Email: <span className="text-white">sumit9354800@gmail.com</span></div>
          <div>Password: <span className="text-white">ChangeMeInProduction123!</span></div>
        </div>

        {error && (
          <div
            id="login-error-banner"
            className="flex items-center gap-2 p-3 bg-[#ef4444]/10 border border-[#ef4444] text-[#f87171] text-xs font-mono-code"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} id="admin-login-form" className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block font-mono-code text-xs text-[#94a3b8] uppercase"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#717887] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block font-mono-code text-xs text-[#94a3b8] uppercase"
            >
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#717887] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="w-full py-3 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#e2e8f0] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
