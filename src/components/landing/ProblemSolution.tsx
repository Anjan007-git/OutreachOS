import React from 'react';
import { motion } from 'motion/react';
import {
  XCircle,
  CheckCircle2,
  Table,
  Clock,
  FileWarning,
  Paperclip,
  Inbox,
  Users,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Brain,
  ArrowRight,
} from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const painPoints = [
    {
      icon: Table,
      title: 'Scattered spreadsheets',
      description: 'Lost contact histories, duplicate sends, and untracked conversation threads across multiple sheets.',
    },
    {
      icon: Clock,
      title: 'Manual follow-ups',
      description: 'Remembering when to nudge each prospect by hand often leads to forgotten leads and lost deals.',
    },
    {
      icon: FileWarning,
      title: 'Generic emails',
      description: 'Cold mass copy-paste templates that get ignored, marked as spam, or damage your domain sender reputation.',
    },
    {
      icon: Paperclip,
      title: 'Outdated attachments',
      description: 'Manually uploading old CV or portfolio revisions with broken links or oversized email limits.',
    },
    {
      icon: Inbox,
      title: 'Lost replies',
      description: 'Important incoming replies buried under general inbox clutter without categorization or quick response drafting.',
    },
  ];

  const solutions = [
    {
      icon: Users,
      title: 'Centralized contacts',
      description: 'Structured database with role, organization, timezone, tags, and complete historical dispatch logs.',
    },
    {
      icon: CalendarCheck,
      title: 'Scheduled campaigns',
      description: 'Automated staggered dispatch queue with randomized intervals and daily safety limits.',
    },
    {
      icon: Sparkles,
      title: 'AI-personalized outreach',
      description: 'Grounded in real recipient context and company news without generic template hallucinations.',
    },
    {
      icon: ShieldCheck,
      title: 'Private document repository',
      description: 'One-click default resume attachment directly linked to private Vercel Blob store with 25MB Gmail limits.',
    },
    {
      icon: Brain,
      title: 'Reply intelligence',
      description: 'Real-time Gmail inbox sync categorizing responses into Interview, Interested, or Follow-up with AI drafting.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-white/[0.08] mb-3 inline-block">
            The Engineered Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
            A System Engineered for Modern Professional Outreach.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop juggling fragmented tools and unorganized mailboxes. Replace friction with an intelligent, end-to-end outreach engine.
          </p>
        </motion.div>

        {/* Comparison Split Cards with scroll slide-in animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative items-stretch">
          {/* LEFT: Without OutreachOS */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-rose-200/70 dark:border-rose-950/40 bg-rose-50/20 dark:bg-[#070304] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Without OutreachOS
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-100/80 dark:bg-[#150709] px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-950/50">
                  Fragmented & Manual
                </span>
              </div>

              <div className="space-y-5">
                {painPoints.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3.5 group">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-[#020202] border border-rose-200/80 dark:border-rose-950/40 text-rose-500 dark:text-rose-400 shrink-0 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-rose-100/80 dark:border-white/[0.05] text-xs text-rose-700/80 dark:text-rose-400/80 font-medium italic">
              Result: Low response rates, missed opportunities, and hours wasted on repetitive busywork.
            </div>
          </motion.div>

          {/* RIGHT: With OutreachOS */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border-2 border-indigo-500/80 dark:border-white/[0.08] bg-white dark:bg-[#060606] p-6 sm:p-8 shadow-xl shadow-indigo-100/30 dark:shadow-none flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Accent Pill */}
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-bl-xl shadow-2xs">
              Engineered Architecture
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    With OutreachOS
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-indigo-700 dark:text-zinc-300 bg-indigo-50 dark:bg-[#0e0e0e] px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-white/[0.08]">
                  Intelligent & Native
                </span>
              </div>

              <div className="space-y-5">
                {solutions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-50 dark:bg-[#0a0a0a] border border-indigo-200 dark:border-white/[0.06] text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-indigo-100 dark:border-white/[0.05] text-xs text-indigo-900 dark:text-zinc-300 font-semibold flex items-center justify-between">
              <span>Result: Authentic high-converting conversations sent with surgical precision.</span>
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
