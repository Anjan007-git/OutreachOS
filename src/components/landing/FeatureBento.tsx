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
  Bot,
  ChevronRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Inbox,
  Users,
} from 'lucide-react';

export const FeatureBento: React.FC = () => {
  const workflowSteps = [
    { label: 'Contacts', icon: Users },
    { label: 'Campaigns', icon: Layers },
    { label: 'AI Personalization', icon: Sparkles },
    { label: 'Documents', icon: FileText },
    { label: 'Schedule', icon: Clock },
    { label: 'Gmail', icon: Mail },
    { label: 'Replies', icon: Inbox },
    { label: 'Follow-ups', icon: Repeat },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50/60 dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-700 dark:text-zinc-300 border border-indigo-200/60 dark:border-white/[0.06] mb-4 inline-block">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Everything Needed to Scale Authentic Outreach.
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            From contact research to scheduled Gmail dispatch and automated follow-ups, every capability is purpose-built.
          </p>
        </motion.div>

        {/* Sophisticated Workflow Linear Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mb-14 overflow-x-auto pb-3 scrollbar-none"
        >
          <div className="flex items-center justify-between min-w-[760px] p-3 rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] shadow-2xs">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/70 dark:border-white/[0.05] text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <div className="p-1 rounded-md bg-indigo-50 dark:bg-[#141414] text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{step.label}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="text-slate-300 dark:text-zinc-700 px-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. LARGE CARD: AI-Powered Personalization (Span 2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-white/[0.06] w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-zinc-300 bg-indigo-50 dark:bg-[#0e0e0e] px-2.5 py-1 rounded-md border border-indigo-100 dark:border-white/[0.06]">
                  Context Grounded
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                AI-Powered Personalization
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
                OutreachOS drafts tailored messages grounded directly in the recipient's role, organizational context, and your uploaded background without generic mass-market templates.
              </p>

              {/* Generic Email Composition Preview */}
              <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.05] bg-slate-50/80 dark:bg-[#0a0a0a] p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-200/70 dark:border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">Composition Preview</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 bg-slate-200/70 dark:bg-[#141414] px-1.5 py-0.5 rounded">
                      Grounded Draft
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                    Status: Ready for Review
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Subject: Personalized Outreach — Target Role
                  </p>
                  <div className="bg-white dark:bg-[#020202] p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed space-y-1.5">
                    <p>
                      "Hi [First Name], I reviewed [Target Organization]’s recent work in [Domain/Engineering].
                      Given my experience in [Core Skill], I would welcome the opportunity to connect regarding the [Target Role] opening."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Automatic angle recommendation based on prospect context</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* 2. CARD: Smart Scheduling (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#0e0e0e] text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-white/[0.06] w-fit mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Smart Scheduling
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-5">
                Stagger outreach delivery across recipient business hours with automated timezone detection and quota protections.
              </p>

              {/* Scheduling Visual */}
              <div className="rounded-xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200/80 dark:border-white/[0.05] p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Optimal Window</span>
                  <span className="font-semibold text-indigo-700 dark:text-zinc-300 bg-indigo-50 dark:bg-[#141414] px-2 py-0.5 rounded border border-indigo-100 dark:border-white/[0.06]">
                    09:15 AM Local
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#020202] border border-slate-200/70 dark:border-white/[0.05] text-slate-700 dark:text-zinc-300 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tuesday Morning Queue</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Randomized Jitter: 60–180s</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Safe Sending Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Humanized delivery avoids spam filters
            </div>
          </motion.div>

          {/* 3. CARD: Gmail Integration (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#0e0e0e] text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-white/[0.06] w-fit mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Gmail Integration
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-5">
                Sends directly through authorized Google Workspace OAuth 2.0. Perfect SPF, DKIM, and DMARC alignment with zero third-party relays.
              </p>

              {/* Status Visual */}
              <div className="rounded-xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200/80 dark:border-white/[0.05] p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">OAuth Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#141414] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Gmail Connected ✓
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#020202] border border-slate-200/70 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transport:</span>
                    <span className="font-mono text-slate-800 dark:text-zinc-200">Gmail API v1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Header:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">RFC 2822 Native</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Zero relay headers or marketing tags
            </div>
          </motion.div>

          {/* 4. CARD: Private Documents (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#0e0e0e] text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-white/[0.06] w-fit mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Private Documents
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Securely store resumes and portfolio PDFs in an encrypted private vault. Attached directly to outbound emails with one click.
              </p>

              {/* Document List */}
              <div className="space-y-1.5 text-xs">
                {[
                  { name: 'Resume.pdf', tag: 'Default Resume', size: '248 KB' },
                  { name: 'CV.pdf', tag: 'Academic', size: '185 KB' },
                  { name: 'Portfolio.pdf', tag: 'Work Samples', size: '3.2 MB' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200/70 dark:border-white/[0.05]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-zinc-200 truncate text-[11px]">
                        {doc.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {doc.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Private Blob Storage
              </span>
            </div>
          </motion.div>

          {/* 5. CARD: Reply Intelligence (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-white/[0.06] w-fit mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Reply Intelligence
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Automatically monitors incoming replies, categorizes recipient sentiment, and drafts suggested follow-up responses.
              </p>

              {/* Categorization Visual */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-[#07130c] border border-emerald-200 dark:border-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold text-center">
                    Positive / Interview
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-[#070e17] border border-blue-200 dark:border-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px] font-semibold text-center">
                    Interested
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-[#140e06] border border-amber-200 dark:border-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold text-center">
                    Follow-up
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-zinc-300 text-[11px] font-semibold text-center">
                    No Response
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-zinc-300 leading-snug">
                  "Let's schedule a call for next Tuesday to discuss."
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Instant AI reply drafts with conversation context
            </div>
          </motion.div>

          {/* 6. CARD: Campaign Management (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#0e0e0e] text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-white/[0.06] w-fit mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Campaign Management
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Organize outreach initiatives into distinct campaigns with progress tracking from draft to response.
              </p>

              {/* Campaign Stages Progress */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Q3 Outreach Cycle</span>
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#141414] px-2 py-0.5 rounded font-semibold text-[10px]">
                    Active
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                    <span>Drafted: 12</span>
                    <span>Scheduled: 8</span>
                    <span>Replied: 18</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#1a1a1a] overflow-hidden flex">
                    <div className="w-1/4 bg-slate-400 dark:bg-zinc-600" />
                    <div className="w-1/4 bg-amber-400" />
                    <div className="w-1/2 bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Track delivery and response across teams
            </div>
          </motion.div>

          {/* 7. CARD: Automated Follow-Ups (1 Col) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#0e0e0e] text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-white/[0.06] w-fit mb-4">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Automated Follow-Ups
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                Configure conditional sequences that automatically stop as soon as a recipient replies.
              </p>

              {/* Follow-Up Sequence Diagram */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/[0.05] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                  <span>Initial Outreach</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sent</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-slate-300 dark:border-zinc-800 ml-2" />
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                  <span>Follow-up 1 (+3 days)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Queued</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-slate-300 dark:border-zinc-800 ml-2" />
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                  <span>Follow-up 2 (+5 days)</span>
                  <span>Conditional</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.05] text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Zero double-messaging when prospect replies
            </div>
          </motion.div>

          {/* 8. CARD: OutreachOS AI Copilot (Span 2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-white/[0.14] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-white/[0.06] w-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-zinc-300 bg-indigo-50 dark:bg-[#0e0e0e] px-2.5 py-1 rounded-md border border-indigo-100 dark:border-white/[0.06]">
                  Executive Copilot
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                OutreachOS AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
                Execute complex outreach workflows through natural language. Direct the assistant to find matching contacts, prepare personalized drafts, and stage them for review.
              </p>

              {/* Natural Language Command UI */}
              <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0a0a0a] p-4 space-y-3 font-sans text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                    YOU
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#020202] border border-slate-200 dark:border-white/[0.05] text-slate-800 dark:text-zinc-200 font-medium flex-1">
                    "Prepare an outreach draft for the engineering opening at Target Org and attach my resume."
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-indigo-100 dark:bg-[#141414] text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#020202] border border-slate-200 dark:border-white/[0.05] text-slate-700 dark:text-zinc-300 flex-1 space-y-2">
                    <p className="text-[11px]">
                      "I located your selected resume (<span className="font-semibold text-slate-900 dark:text-white">Resume.pdf</span>) and prepared a grounded outreach draft for your review."
                    </p>
                    <div className="flex gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-[#141414] text-indigo-700 dark:text-zinc-300 font-semibold text-[10px] border border-indigo-200 dark:border-white/[0.06]">
                        Review in Compose
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#141414] text-slate-600 dark:text-zinc-400 font-semibold text-[10px]">
                        Schedule for Tomorrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Always requires explicit user confirmation before sending</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
