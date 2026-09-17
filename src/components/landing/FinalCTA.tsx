import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Check, Mail, Lock } from 'lucide-react';

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
    <section className="relative py-12 sm:py-16 bg-slate-950 dark:bg-black text-white border-t border-slate-200/80 dark:border-white/[0.08] overflow-hidden transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
      >
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-zinc-900 border border-white/15 dark:border-white/[0.08] text-xs font-medium text-zinc-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Intelligent Email Orchestration</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Ready to build a better outreach system?
        </h2>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          Create, personalize, schedule, and manage outreach from one workspace.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            id="final-cta-btn"
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-slate-950 text-sm font-semibold shadow-xs transition-all cursor-pointer hover:shadow-sm"
          >
            <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {!isAuthenticated && (
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 text-sm font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-zinc-400 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Connect your Gmail in seconds</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero credit card required</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Private document vault</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
