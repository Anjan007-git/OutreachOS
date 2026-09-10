import React from 'react';
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
  Check,
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
    <section id="features" className="py-20 sm:py-28 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-4 inline-block">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Everything Needed to Scale Authentic Outreach.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            From contact research to scheduled Gmail dispatch and automated follow-ups, every capability is purpose-built.
          </p>
        </div>

        {/* Sophisticated Workflow Linear Ribbon */}
        <div className="mb-14 overflow-x-auto pb-3">
          <div className="flex items-center justify-between min-w-[760px] p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
                    <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{step.label}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="text-slate-300 px-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. LARGE CARD: AI-Powered Personalization (Span 2 on lg) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Context Grounded
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                AI-Powered Personalization
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                OutreachOS drafts tailored messages grounded directly in the recipient's role, organizational context, and your uploaded background without generic mass-market templates.
              </p>

              {/* Generic Email Composition Preview */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Composition Preview</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                      Grounded Draft
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-mono font-medium">
                    Status: Ready for Review
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p className="font-semibold text-slate-900">
                    Subject: Personalized Outreach — Target Role
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed space-y-1.5">
                    <p>
                      "Hi [First Name], I reviewed [Target Organization]’s recent work in [Domain/Engineering].
                      Given my experience in [Core Skill], I would welcome the opportunity to connect regarding the [Target Role] opening."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Automatic angle recommendation based on prospect context</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 2. CARD: Smart Scheduling (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 w-fit mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Smart Scheduling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Stagger outreach delivery across recipient business hours with automated timezone detection and quota protections.
              </p>

              {/* Scheduling Visual */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Optimal Window</span>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    09:15 AM Local
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/70 text-slate-700 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tuesday Morning Queue</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Randomized Jitter: 60–180s</span>
                  <span className="text-emerald-600 font-medium">Safe Sending Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Humanized delivery avoids spam filters
            </div>
          </div>

          {/* 3. CARD: Gmail Integration (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Gmail Integration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Sends directly through authorized Google Workspace OAuth 2.0. Perfect SPF, DKIM, and DMARC alignment with zero third-party relays.
              </p>

              {/* Status Visual - Zero personal email displayed */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">OAuth Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Gmail Connected ✓
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transport:</span>
                    <span className="font-mono text-slate-800">Gmail API v1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Header:</span>
                    <span className="font-mono text-emerald-600">RFC 2822 Native</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Zero relay headers or marketing tags
            </div>
          </div>

          {/* 4. CARD: Private Documents (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 w-fit mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Private Documents
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Securely store resumes and portfolio PDFs in an encrypted private vault. Attached directly to outbound emails with one click.
              </p>

              {/* Generic Document List */}
              <div className="space-y-1.5 text-xs">
                {[
                  { name: 'Resume.pdf', tag: 'Default Resume', size: '248 KB' },
                  { name: 'CV.pdf', tag: 'Academic', size: '185 KB' },
                  { name: 'Portfolio.pdf', tag: 'Work Samples', size: '3.2 MB' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate text-[11px]">
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

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Private Blob Storage
              </span>
            </div>
          </div>

          {/* 5. CARD: Reply Intelligence (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Reply Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Automatically monitors incoming replies, categorizes recipient sentiment, and drafts suggested follow-up responses.
              </p>

              {/* Generic Categorization Visual */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold text-center">
                    Positive / Interview
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold text-center">
                    Interested
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold text-center">
                    Follow-up
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold text-center">
                    No Response
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-snug">
                  "Let's schedule a call for next Tuesday to discuss."
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Instant AI reply drafts with conversation context
            </div>
          </div>

          {/* 6. CARD: Campaign Management (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 w-fit mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Campaign Management
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Organize outreach initiatives into distinct campaigns with progress tracking from draft to response.
              </p>

              {/* Campaign Stages Progress */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-800">Q3 Outreach Cycle</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                    Active
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Drafted: 12</span>
                    <span>Scheduled: 8</span>
                    <span>Replied: 18</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden flex">
                    <div className="w-1/4 bg-slate-400" />
                    <div className="w-1/4 bg-amber-400" />
                    <div className="w-1/2 bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Track delivery and response across teams
            </div>
          </div>

          {/* 7. CARD: Automated Follow-Ups (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 w-fit mb-4">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Automated Follow-Ups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Configure conditional sequences that automatically stop as soon as a recipient replies.
              </p>

              {/* Follow-Up Sequence Diagram */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                  <span>Initial Outreach</span>
                  <span className="text-emerald-600 font-semibold">Sent</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-slate-300 ml-2" />
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                  <span>Follow-up 1 (+3 days)</span>
                  <span className="text-indigo-600 font-semibold">Queued</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-slate-300 ml-2" />
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <span>Follow-up 2 (+5 days)</span>
                  <span>Conditional</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Zero double-messaging when prospect replies
            </div>
          </div>

          {/* 8. CARD: OutreachOS AI Copilot (Span 2 on lg) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Executive Copilot
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                OutreachOS AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Execute complex outreach workflows through natural language. Direct the assistant to find matching contacts, prepare personalized drafts, and stage them for review.
              </p>

              {/* Natural Language Command UI */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-4 space-y-3 font-sans text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                    YOU
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium flex-1">
                    "Prepare an outreach draft for the engineering opening at Target Org and attach my resume."
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-indigo-100 text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 flex-1 space-y-2">
                    <p className="text-[11px]">
                      "I located your selected resume (<span className="font-semibold text-slate-900">Resume.pdf</span>) and prepared a grounded outreach draft for your review."
                    </p>
                    <div className="flex gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-200">
                        Review in Compose
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        Schedule for Tomorrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Always requires explicit user confirmation before sending</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
