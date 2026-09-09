import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface FinalCTAProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  isAuthenticated,
  onGetStarted,
  onSignIn,
}) => {
  return (
    <section className="relative py-20 sm:py-28 bg-slate-950 text-white overflow-hidden">
      {/* Background Ambient Glow & Subtle Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-radial from-indigo-600/25 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-indigo-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Start Reaching Out Professionally</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Your Next Conversation{' '}
          <span className="text-indigo-400">Starts Here.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Build thoughtful outreach, automate the repetitive work, and spend more time on the conversations that matter.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {!isAuthenticated && (
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Value Micro-Points */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium pt-4">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-indigo-400" />
            <span>Connect your Gmail in seconds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-indigo-400" />
            <span>Zero credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-indigo-400" />
            <span>Private cloud document vault</span>
          </div>
        </div>
      </div>
    </section>
  );
};
