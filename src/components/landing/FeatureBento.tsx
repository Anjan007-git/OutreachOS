import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Mail,
  Clock,
  FileText,
  MessageSquareText,
  Repeat,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Tag,
} from 'lucide-react';

export const FeatureBento: React.FC = () => {
  return (
    <section id="features" className="py-12 sm:py-16 bg-slate-50/60 dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
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
            Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
            Everything Needed to Scale Authentic Outreach.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            From contact research to scheduled Gmail dispatch and automated follow-ups, every capability is purpose-built.
          </p>
        </motion.div>

        {/* Sophisticated Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. LARGE HERO CARD: AI Personalization (Span 2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Context-Grounded Engine
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-white/[0.08]">
                  Zero Spam Archetype
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                AI Personalization
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-5 max-w-2xl">
                OutreachOS drafts tailored messages grounded directly in the recipient's role, organizational context, and your uploaded background without generic mass-market templates.
              </p>

              {/* Realistic Email Composition UI Preview */}
              <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#0c0c0c] p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/70 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">Generated Output</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.06]">
                      Target: VP Engineering
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Context Aligned
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Subject: High-throughput platform resilience & cross-cluster scaling
                  </div>
                  <div className="bg-white dark:bg-[#050505] p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.06] text-xs text-slate-600 dark:text-zinc-300 leading-relaxed space-y-1.5">
                    <p>
                      "Hi Sarah, I noticed CloudScale's recent benchmark on multi-region Kubernetes failover. Having built distributed pipelines processing 250k+ events/sec, I put together a brief technical breakdown on eliminating cross-cluster ingress latency."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 font-medium">
              <span>Automatic angle recommendation based on prospect context</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                Explore Engine <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* 2. CARD: Contact Management (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Target Directory
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Contact Management
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Structured recipient records with role context, past engagement logs, and custom research notes.
              </p>

              {/* Mini Contact List UI */}
              <div className="space-y-1.5">
                {[
                  { name: 'Sarah Jenkins', role: 'VP Infrastructure', org: 'CloudScale', status: 'Active' },
                  { name: 'David Chen', role: 'Head of Recruiting', org: 'Apex Labs', status: 'Replied' },
                  { name: 'Elena Rostova', role: 'Director of AI', org: 'Synthetix', status: 'Queued' },
                ].map((c, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/70 dark:border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-zinc-100 text-[11px]">{c.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400">{c.role} • {c.org}</div>
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-zinc-300">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              CSV import & instant variable mapping
            </div>
          </motion.div>

          {/* 3. CARD: Campaign Management (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Multi-Cohort Workflows
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Campaign Management
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Organize outreach initiatives into distinct cohorts with progress tracking from draft to response.
              </p>

              {/* Mini Campaign Tracker */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">Q3 Enterprise Outreach</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">68% Replied</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex">
                  <div className="w-1/4 bg-slate-400 dark:bg-zinc-600" />
                  <div className="w-1/4 bg-amber-400" />
                  <div className="w-1/2 bg-emerald-500" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 pt-0.5">
                  <span>14 Drafted</span>
                  <span>10 Queued</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">22 Responses</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              Segment by role, seniority & domain
            </div>
          </motion.div>

          {/* 4. CARD: Smart Scheduling (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Safe Sending Windows
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Smart Scheduling
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Stagger delivery across recipient business hours with automated timezone detection and quota protections.
              </p>

              {/* Schedule UI Snippet */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-zinc-400">Target Window</span>
                  <span className="font-semibold text-slate-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.06]">
                    09:15 AM PST
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-zinc-400">Adaptive Jitter</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    60–180s randomized
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-zinc-400">Daily Cap Shield</span>
                  <span className="text-slate-900 dark:text-white font-semibold">14 / 25 emails</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              Prevents spam flag triggers automatically
            </div>
          </motion.div>

          {/* 5. CARD: Automated Follow-Ups (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                  <Repeat className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Conditional Cadence
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Automated Follow-Ups
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Configure thoughtful, multi-stage reminders that immediately cancel the moment a recipient responds.
              </p>

              {/* Follow-up Sequence Mini Flow */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">Stage 1: Primary Email</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Dispatched</span>
                </div>
                <div className="h-2.5 border-l-2 border-slate-200 dark:border-zinc-800 ml-2" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 dark:text-zinc-300">Stage 2: +3 Business Days</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">Queued</span>
                </div>
                <div className="h-2.5 border-l-2 border-slate-200 dark:border-zinc-800 ml-2" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-zinc-500">Auto-Halt on Reply</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Protected</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              Zero embarrassing duplicate emails
            </div>
          </motion.div>

          {/* 6. CARD: Response Intelligence (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100/70 dark:border-white/[0.08]">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Intent Categorization
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Response Intelligence
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Automatically monitors incoming replies, tags positive interest, and prepares one-click response drafts.
              </p>

              {/* Categorization Badges */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold text-center border border-emerald-200 dark:border-emerald-800/30">
                    Interview / Call
                  </span>
                  <span className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-[10px] font-semibold text-center border border-blue-200 dark:border-blue-800/30">
                    Interested
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/70 dark:border-white/[0.06] text-[11px] text-slate-600 dark:text-zinc-300">
                  "Let's schedule a call next Tuesday at 10 AM."
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              Instant AI reply suggestions ready to review
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
