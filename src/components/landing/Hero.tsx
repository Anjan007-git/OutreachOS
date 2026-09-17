import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Play, ChevronDown, Check, ShieldCheck, Mail, Clock, Lock } from 'lucide-react';
import { HeroWorkflowGraphic } from './HeroWorkflowGraphic';

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
    <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-part Hero Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Messaging & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-white/[0.08] text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              <span className="font-semibold text-slate-900 dark:text-white">OutreachOS 2.0</span>
              <span className="text-slate-300 dark:text-zinc-700">|</span>
              <span className="text-slate-600 dark:text-zinc-400">The Outreach Operating System</span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]"
            >
              Turn Outreach Into a{' '}
              <span className="text-indigo-600 dark:text-indigo-400">
                System.
              </span>
            </motion.h1>

            {/* Supporting Copy with controlled line length */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-[54ch] font-normal leading-relaxed"
            >
              Create personalized outreach, send through Gmail, schedule campaigns, automate follow-ups, and manage every response from one intelligent workspace.
            </motion.p>

            {/* Compact, Premium CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
            >
              <button
                id="hero-primary-cta"
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 text-sm font-semibold shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-[0.99]"
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-secondary-cta"
                onClick={onSeeHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0c0c0c] hover:bg-slate-50 dark:hover:bg-[#141414] text-slate-700 dark:text-zinc-200 text-sm font-medium border border-slate-200/90 dark:border-white/[0.08] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-slate-500 fill-slate-500" />
                <span>See How It Works</span>
              </button>
            </motion.div>

            {/* Compact Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="pt-2 border-t border-slate-100 dark:border-white/[0.06]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="whitespace-nowrap">Gmail Native</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="whitespace-nowrap">AI Personalization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="whitespace-nowrap">Smart Scheduling</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="whitespace-nowrap">Private Vault</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sophisticated OutreachOS Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 w-full"
          >
            <HeroWorkflowGraphic />
          </motion.div>
        </div>

        {/* Compact, Subtle Scroll Indicator */}
        <div className="mt-8 pt-2 flex justify-center">
          <a
            href="#hero-visual"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('hero-visual')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors group cursor-pointer text-xs font-medium py-1 px-2.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-zinc-900/80"
          >
            <span className="text-[11px] uppercase tracking-wider font-semibold">Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
