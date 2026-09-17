import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Check, Play, ChevronDown } from 'lucide-react';

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
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 text-center overflow-hidden">
      {/* Subtle Top Ambient Gradient in Light Mode Only; Hidden in Dark to guarantee pure black */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-radial from-indigo-100/50 via-slate-50/20 to-transparent blur-2xl pointer-events-none -z-10 dark:hidden" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Badge with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/90 dark:bg-zinc-900 border border-indigo-200/60 dark:border-zinc-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Professional Outreach</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400 dark:bg-indigo-500" />
          <span className="text-slate-500 dark:text-zinc-400 font-normal">Gmail Native</span>
        </motion.div>

        {/* Major Headline with smooth entrance */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6"
        >
          Turn Outreach Into a{' '}
          <span className="text-indigo-600 dark:text-indigo-400 block sm:inline">
            System.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8"
        >
          Create personalized outreach, send through Gmail, schedule campaigns, automate
          follow-ups, and manage every response from one intelligent workspace.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8"
        >
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSeeHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-sm font-semibold border border-slate-200 dark:border-zinc-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
            <span>See How It Works</span>
          </button>
        </motion.div>

        {/* Trust / Value Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-zinc-400 font-medium pt-2 mb-6"
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Gmail API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI Personalization</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Private Document Storage</span>
          </div>
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-4 flex flex-col items-center justify-center"
        >
          <a
            href="#hero-visual"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('hero-visual')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer text-xs font-medium"
          >
            <span className="tracking-wide text-[11px] uppercase font-semibold">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-indigo-500 group-hover:translate-y-0.5 transition-transform" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
