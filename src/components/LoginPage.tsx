import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Inbox,
  Calendar,
  FileText,
} from 'lucide-react';
import { signInWithGoogleBasic } from '../lib/auth';
import { api } from '../lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; name: string; role: string; isAdmin: boolean }) => void;
  onNavigateHome: () => void;
  redirectPath?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
  redirectPath = '/dashboard',
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { email, name } = await signInWithGoogleBasic();
      const res = await api.login(email, name);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        throw new Error('Failed to establish application session.');
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      // If popup was blocked or user closed it, provide clear guidance
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed. Please try again or use direct login below.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups or use direct email login.');
      } else {
        setErrorMessage(err?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (email: string, name: string, role = 'ADMIN') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.login(email, name, role);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        throw new Error('Failed to sign in.');
      }
    } catch (err: any) {
      console.error('Demo login error:', err);
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMessage('Please enter a valid professional email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const trimmed = emailInput.trim();
      const name = trimmed.split('@')[0];
      const res = await api.login(trimmed, name);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        throw new Error('Failed to sign in with email.');
      }
    } catch (err: any) {
      console.error('Email login error:', err);
      setErrorMessage(err?.message || 'Failed to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Simple Navigation */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-2xs">
            O
          </div>
          <span className="text-base font-bold tracking-tight text-slate-800">OutreachOS</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Professional Outreach Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign In to OutreachOS
            </h1>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Access your automated campaigns, personalized drafts, and intelligent outreach tools.
            </p>
          </div>

          {/* Core Sign-In Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-7 sm:p-8 space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Primary Google Sign-In */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-3 shadow-2xs cursor-pointer hover:border-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Quick-Access Workspace Option (Senior Systems Engineer) */}
              <button
                type="button"
                onClick={() =>
                  handleDemoSignIn('anjanp93722@gmail.com', 'Anjan Prajapati', 'ADMIN')
                }
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2.5 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-indigo-200" />
                    <span>Open Workspace as Anjan Prajapati</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-indigo-300" />
                  </>
                )}
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 shrink-0">
                Or sign in with email
              </span>
            </div>

            {/* Email Input Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Work or Personal Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@company.com"
                    disabled={isLoading}
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors bg-white disabled:bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                ) : (
                  <span>Sign In with Email</span>
                )}
              </button>
            </form>

            {/* Logical Separation Clarification Banner */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Account Login & Gmail Separation</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Application login simply authenticates your OutreachOS workspace. You can connect,
                switch, or verify your Gmail sending account inside <strong>Settings</strong> at any
                time without re-authenticating here.
              </p>
            </div>
          </div>

          {/* Security Assurance Footer */}
          <div className="text-center space-y-2 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1.5 text-slate-600">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Official Google OAuth 2.0 & encrypted Upstash Redis storage</span>
            </div>
            <p className="text-[11px] text-slate-400">
              By signing in, you agree to the OutreachOS terms and privacy policies.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-500">
        <p>© 2026 OutreachOS. The Outreach Operating System.</p>
      </footer>
    </div>
  );
};
