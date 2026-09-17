import React from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Sparkles,
  Lock,
  FileText,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Check,
  Layers,
  ShieldCheck,
  Repeat,
  Zap,
  Sliders,
} from 'lucide-react';

export const HeroProductVisual: React.FC = () => {
  const workflowSteps = [
    { label: 'Target Context', num: '01' },
    { label: 'Intelligence Match', num: '02' },
    { label: 'Personalized Composer', num: '03' },
    { label: 'Document Attach', num: '04' },
    { label: 'Safety Guardrails', num: '05' },
    { label: 'Gmail Dispatch', num: '06' },
    { label: 'Smart Follow-Up', num: '07' },
  ];

  return (
    <section id="hero-visual" className="relative pt-4 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Subtle Radial Ambient Glow behind the Product Mockup in Light Mode Only */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-96 bg-radial from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10 dark:hidden" />

      {/* 1. Section Header: UNIFIED OUTREACH ARCHITECTURE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50/90 dark:bg-zinc-900 border border-indigo-200/70 dark:border-zinc-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Unified Outreach Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-4">
          One Workspace for the Entire Outreach Workflow.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Unify deep recipient context, AI personalization, deliverability safety rules, document attachments, and native Gmail dispatch inside a single coordinated architecture.
        </p>
      </motion.div>

      {/* Interactive / Visual Pipeline Ribbon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 overflow-x-auto pb-2 scrollbar-none"
      >
        <div className="flex items-center justify-between min-w-[820px] px-5 py-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-850 shadow-2xs">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-zinc-900 border border-indigo-200/70 dark:border-zinc-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="flex items-center text-slate-300 dark:text-zinc-700 px-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* 2. Product Visualization: Large Premium Browser / Workspace Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-slate-200/90 dark:border-zinc-850 bg-white dark:bg-zinc-950 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
      >
        {/* Browser Chrome Header */}
        <div className="h-12 bg-slate-100/90 dark:bg-zinc-900/90 border-b border-slate-200/80 dark:border-zinc-850 px-4 sm:px-6 flex items-center justify-between text-xs select-none">
          {/* Browser Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>

          {/* Browser URL Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-md bg-white dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-[11px] font-mono shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>app.outreachos.com/compose</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans px-1 bg-slate-100 dark:bg-zinc-800 rounded">
              Verified TLS 1.3
            </span>
          </div>

          {/* Top Status Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Status */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-zinc-900 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-zinc-800">
              <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>AI PERSONALIZATION</span>
              <span className="text-indigo-500 dark:text-indigo-400 font-normal">• Ready</span>
            </div>

            {/* Gmail Status */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200/70 dark:border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gmail API</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-normal">• Connected</span>
            </div>
          </div>
        </div>

        {/* Interior Application Workspace: Bento Composition */}
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-black/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Left/Center Panel: Dominant Composer Cockpit */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/90 dark:border-zinc-850 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header: COMPOSE PERSONALIZED OUTREACH */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-850">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-zinc-800">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        COMPOSE PERSONALIZED OUTREACH
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Context-grounded personalized email composer with verified deliverability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-zinc-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-zinc-800">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>98% Relevance Match</span>
                  </div>
                </div>

                {/* Recipient Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                      Target Recipient & Context
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Domain & MX Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-zinc-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                        SJ
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Sarah Jenkins
                        </span>
                        <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                          s.jenkins@cloudscale-tech.example
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                        Role: VP of Platform Infrastructure
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                        Company: CloudScale Technologies
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                    Subject Line
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 font-medium text-slate-900 dark:text-white text-xs flex items-center justify-between">
                    <span>High-throughput platform resilience & cross-cluster scaling</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2 py-0.5 rounded font-semibold border border-emerald-200/60 dark:border-zinc-800">
                      Zero Spam Trigger
                    </span>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                    Personalized Message Content
                  </span>
                  <div className="rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 font-sans shadow-2xs">
                    <p className="font-semibold text-slate-900 dark:text-white">Hi Sarah,</p>
                    <p>
                      I noticed CloudScale's recent engineering benchmark on multi-region Kubernetes failover and your team's expansion in platform reliability. Having architected distributed pipelines processing 250k+ events/sec, I put together a brief technical breakdown on eliminating cross-cluster ingress latency.
                    </p>
                    <p>
                      I've attached my technical portfolio and systems architecture case study for your review. Would you be open to a brief 10-minute technical exchange next Tuesday at 10:00 AM PST?
                    </p>
                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-850">
                      <p className="text-slate-500 dark:text-zinc-400">Best regards,</p>
                      <p className="font-semibold text-slate-900 dark:text-white">Alex Morgan</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Principal Systems Architect</p>
                    </div>
                  </div>
                </div>

                {/* Document / Resume Attachment Card */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-zinc-800 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Principal_Systems_Architect_Case_Study.pdf
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                        1.4 MB • Cryptographically Verified & Embedded
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2.5 py-1 rounded border border-emerald-200/60 dark:border-zinc-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Attached</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium">Scheduled for Tuesday, 10:00 AM (Recipient Timezone)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 text-xs font-semibold shadow-2xs hover:bg-slate-50 pointer-events-none"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-2xs hover:bg-indigo-700 pointer-events-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via Gmail</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Supporting Bento Stack */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              
              {/* 1. Target Context Card */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/90 dark:border-zinc-850 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-850">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      TARGET CONTEXT
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-zinc-800">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    VERIFIED
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      ORGANIZATION
                    </span>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      CloudScale Technologies (Series D • 450+ Eng)
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      TARGET ROLE
                    </span>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      VP of Platform Infrastructure
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      GROUNDED CONTEXT
                    </span>
                    <div className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed mt-0.5">
                      Specializes in multi-region Kubernetes, zero-downtime deployments, and distributed systems.
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Safety & Limits Card */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/90 dark:border-zinc-850 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-850">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      SAFETY & LIMITS
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-zinc-800">
                    Active Shield
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Daily Outbox Cap:</span>
                    <span className="font-bold text-slate-900 dark:text-white">14 / 25 emails (Safe threshold)</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Dispatch Spacing:</span>
                    <span className="font-bold text-slate-900 dark:text-white">10–15 min adaptive jitter</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Deliverability Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">99.4% (Clean SPF / DKIM)</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">Human-in-the-Loop:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Review before dispatch</span>
                  </div>
                </div>
              </div>

              {/* 3. Follow-Up Rule Card */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/90 dark:border-zinc-850 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-850">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      FOLLOW-UP RULE
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-zinc-800">
                    Automated Thread
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">Step 2 Trigger Condition:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">After 3 business days</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                      Sends a threaded 3-sentence note referencing the technical case study if no reply is detected.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Auto-pauses sequence immediately upon recipient reply</span>
                  </div>
                </div>
              </div>

              {/* 4. Verified Gmail Connection Card */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/90 dark:border-zinc-850 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-850">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      GMAIL PROTOCOL
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-zinc-800">
                    OAuth 2.0
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-zinc-300 py-1">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Draft</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Review</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Schedule</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gmail</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Follow-Up</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug pt-1 border-t border-slate-100 dark:border-zinc-850">
                  Official Google Workspace API integration. Direct from your mailbox with zero third-party branding.
                </p>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
