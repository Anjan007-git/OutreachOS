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
} from 'lucide-react';

export const HeroProductVisual: React.FC = () => {
  const workflowSteps = [
    { label: 'Contact', num: '01' },
    { label: 'Context', num: '02' },
    { label: 'AI Personalization', num: '03' },
    { label: 'Document', num: '04' },
    { label: 'Review', num: '05' },
    { label: 'Schedule', num: '06' },
    { label: 'Gmail', num: '07' },
    { label: 'Follow-Up', num: '08' },
  ];

  return (
    <section id="hero-visual" className="relative pt-4 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Subtle Radial Ambient Glow behind the Product Mockup */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-96 bg-radial from-indigo-100/50 via-purple-50/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. Section Header: THE OUTREACHOS WORKSPACE */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>The OutreachOS Workspace</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.14] mb-4">
          One Workspace for the Entire Outreach Workflow.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Bring contacts, context, AI personalization, documents, scheduling, Gmail, and follow-ups into one connected workflow.
        </p>
      </div>

      {/* 11. Visual Connections Rail (Contact → Context → AI → Document → Review → Schedule → Gmail → Follow-Up) */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-between min-w-[780px] px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="flex items-center text-slate-300 px-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. Product Visualization: Large Premium Browser Mockup */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Browser Chrome Header */}
        <div className="h-12 bg-slate-100/90 border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between text-xs select-none">
          {/* Browser Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>

          {/* Browser URL Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-md bg-white border border-slate-200/70 text-slate-500 text-[11px] font-mono shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>app.outreachos.com/compose</span>
            <span className="text-[10px] text-slate-400 font-sans px-1 bg-slate-100 rounded">
              Verified
            </span>
          </div>

          {/* Top Status Indicators: AI Status & Gmail Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 8. AI Status */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-700 bg-indigo-50 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>AI PERSONALIZATION</span>
              <span className="text-indigo-500 font-normal">• Ready</span>
            </div>

            {/* 9. Gmail Status (Generic, No user email) */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gmail</span>
              <span className="text-emerald-600 font-normal">• Connected</span>
            </div>
          </div>
        </div>

        {/* 13. Interior Application Workspace: Bento Composition */}
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 3. Main Left/Center Panel (Dominant Composer) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header: COMPOSE PERSONALIZED OUTREACH */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                        COMPOSE PERSONALIZED OUTREACH
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Context-grounded personalized email preview
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Personalization Ready</span>
                  </div>
                </div>

                {/* Recipient Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Recipient
                    </span>
                    <span className="text-[11px] text-indigo-600 font-medium">
                      Target Role • Target Organization
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span className="font-semibold text-slate-900">Professional Contact</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        contact@example.com
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        Role: Target Role
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        Company: Target Organization
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Subject
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-medium text-slate-900 text-xs flex items-center justify-between">
                    <span>Personalized Outreach — Target Role</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/60">
                      High Relevance Score
                    </span>
                  </div>
                </div>

                {/* Message Preview (Exact Prompt Requirements) */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Message Preview
                  </span>
                  <div className="rounded-lg bg-white border border-slate-200 p-4 sm:p-5 text-xs text-slate-800 leading-relaxed space-y-3 font-sans shadow-2xs">
                    <p className="font-medium text-slate-900">Hi [Contact Name],</p>
                    <p>
                      I’m reaching out regarding the <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">Target Role</span> at <span className="font-semibold text-slate-900">Target Organization</span>. I’d love to explore how my relevant experience could contribute to the team.
                    </p>
                    <div className="pt-2">
                      <p>Best regards,</p>
                      <p className="font-semibold text-slate-900">[Your Name]</p>
                    </div>
                  </div>
                </div>

                {/* 6. Document Context preview inside composer */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">Your Resume.pdf</span>
                      <span className="text-[10px] text-slate-500">Private Document • Ready to attach</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attached</span>
                  </div>
                </div>
              </div>

              {/* 10. Bottom Action Bar (Visual Only) */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium">Scheduled for 09:15 AM (Recipient Timezone)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 pointer-events-none"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 pointer-events-none"
                  >
                    Schedule
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

            {/* Right Supporting Bento Cards (lg:col-span-5 xl:col-span-4) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              
              {/* 5. Target Context Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    TARGET CONTEXT
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    <Check className="w-3 h-3 text-emerald-600" />
                    VERIFIED
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      ORGANIZATION
                    </span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      Target Organization
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      ROLE
                    </span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      Target Role
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      RELEVANT CONTEXT
                    </span>
                    <div className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                      Skills, responsibilities and role-specific context
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Outreach Intelligence Card (Replaces "Safety & Limits" completely!) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      OUTREACH INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">Recipient Context</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">Role Relevance</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">Verified Information</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">Personalized Messaging</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
                  OutreachOS combines the context you provide to create relevant, professional outreach.
                </p>
              </div>

              {/* 6. Document Context Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    DOCUMENT CONTEXT
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Attached
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">Your Resume.pdf</div>
                      <div className="text-[10px] text-slate-500">Private Document</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Ready to attach
                  </span>
                </div>
              </div>

              {/* 7. Delivery Plan Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    DELIVERY PLAN
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    5-Stage
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 py-1">
                  <span className="text-indigo-600 font-bold">Draft</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="text-indigo-600 font-bold">Review</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="text-indigo-600 font-bold">Schedule</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="text-indigo-600 font-bold">Gmail</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="text-indigo-600 font-bold">Follow Up</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
                  Plan every outreach step from one workspace.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

