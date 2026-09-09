import React from 'react';
import { ArrowRight, Sparkles, Check, Play } from 'lucide-react';

interface HeroProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  onSeeHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isAuthenticated,
  onGetStarted,
  onSeeHowItWorks,
}) => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center overflow-hidden">
      {/* Subtle Top Ambient Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-radial from-indigo-100/50 via-slate-50/20 to-transparent blur-2xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-xs font-semibold text-indigo-700 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Professional Outreach</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-slate-500 font-normal">Gmail Native</span>
        </div>

        {/* Major Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
          Turn Outreach Into a{' '}
          <span className="text-indigo-600 block sm:inline">
            System.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Create personalized outreach, send through Gmail, schedule campaigns, automate
          follow-ups, and manage every response from one intelligent workspace.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSeeHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Trust / Value Row (No fake statistics, grounded product truths) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Gmail API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>AI Personalization</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Private Document Storage</span>
          </div>
        </div>
      </div>
    </section>
  );
};
