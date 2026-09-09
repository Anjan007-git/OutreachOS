import React from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Clock,
  CheckCircle2,
  Lock,
  Calendar,
  FileText,
  Sliders,
  ShieldCheck,
  ChevronDown,
  Mail,
} from 'lucide-react';

export const HeroProductVisual: React.FC = () => {
  return (
    <section id="hero-visual" className="relative pb-16 sm:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Visual Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-radial from-indigo-200/40 via-purple-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Mockup Container with Browser Window Frame */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Browser Chrome Header */}
        <div className="h-11 bg-slate-100/90 border-b border-slate-200/80 px-4 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200/70 text-slate-500 text-[11px] font-mono shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>app.outreachos.com/compose</span>
            <span className="text-[10px] text-slate-400 font-sans px-1 bg-slate-100 rounded">
              Verified
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gmail API Connected
            </span>
          </div>
        </div>

        {/* Application Interior Workspace */}
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Realistic Message Composer */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              {/* Header Bar inside composer */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Compose Personalized Outreach
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Grounded in verified contact and role context
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 bg-indigo-50 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Copilot Active</span>
                </div>
              </div>

              {/* Recipient Field */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                <label className="sm:col-span-2 font-semibold text-slate-500">Recipient:</label>
                <div className="sm:col-span-10 flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="font-semibold text-slate-900">Sarah Lin</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    &lt;s.lin@cloudscale-tech.com&gt;
                  </span>
                  <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 border border-indigo-200/60">
                    Staff Engineering Manager • CloudScale
                  </span>
                </div>
              </div>

              {/* Subject Field */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                <label className="sm:col-span-2 font-semibold text-slate-500">Subject:</label>
                <div className="sm:col-span-10 p-2 rounded-lg bg-slate-50 border border-slate-200/80 font-medium text-slate-800 text-xs">
                  Staff Systems Engineer role at CloudScale — Anjan Prajapati
                </div>
              </div>

              {/* Realistic Email Body with Grounded Tokens */}
              <div className="rounded-lg bg-white border border-slate-200/80 p-4 text-xs font-sans text-slate-700 leading-relaxed space-y-3">
                <p>Hi Sarah,</p>
                <p>
                  I’ve been closely following CloudScale’s recent technical updates on scaling
                  distributed telemetry across multi-region Kubernetes clusters.
                </p>
                <p>
                  With 6+ years architecting high-throughput backend services, resilient queuing
                  pipelines, and cloud infrastructure, I would love to explore how my experience aligns
                  with your{' '}
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                    Staff Systems Engineer
                  </span>{' '}
                  opening.
                </p>
                <p>
                  I’ve attached my verified resume below for quick reference. Would you have 10 minutes
                  this Thursday or Friday for an introductory conversation?
                </p>
                <div className="pt-2 text-slate-900 font-medium">
                  Best regards,<br />
                  <span className="font-semibold">Anjan Prajapati</span>
                </div>
              </div>

              {/* Attached Resume Component */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">
                      Anjan_Prajapati_Resume.pdf
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      248 KB • Verified Private Blob
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resume Attached</span>
                </div>
              </div>

              {/* Controls & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scheduled for 09:15 AM (Recipient Timezone)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs">
                    Save Draft
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-all">
                    <Send className="w-3.5 h-3.5" />
                    <span>Schedule Dispatch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Context & Intelligence Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              {/* Card 1: Verified Target Context */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Target Context
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Company</span>
                    <div className="font-semibold text-slate-800">CloudScale Technologies</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Role Opening</span>
                    <div className="font-semibold text-slate-800">Staff Systems Engineer</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Matched Angle</span>
                    <div className="text-slate-600 text-[11px] leading-snug">
                      Distributed microservices, Kubernetes telemetry, high-availability architecture.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Dispatch Safety & Queue */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Safety & Limits
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Gmail v1</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Daily Quota</span>
                    <span className="font-semibold text-slate-900">24 / 50 sent today</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-1/2 h-full bg-indigo-600 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Safety Delay Interval</span>
                    <span className="font-mono font-medium text-slate-700">60–180s randomized</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Automated Follow-Up Rule */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Follow-Up Rule
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-600">
                  If no reply received after <strong className="text-slate-800">3 business days</strong>,
                  queue gentle inquiry follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating UI Badges for Realistic Depth */}
      <div className="hidden md:flex absolute -bottom-5 left-10 items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-800 animate-in fade-in">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Gmail Authorized • Zero Third-Party Relays</span>
      </div>

      <div className="hidden md:flex absolute -top-4 right-12 items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-800 animate-in fade-in">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span>Gemini Model Grounded • Contextual Hooks</span>
      </div>
    </section>
  );
};
