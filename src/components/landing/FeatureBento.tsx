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
  CheckCircle2,
  ShieldCheck,
  Send,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const FeatureBento: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-4 inline-block">
            System Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Everything You Need to Run Professional Outreach.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Eight coordinated modules engineered to turn cold outbound attempts into authentic, high-impact career and business dialogues.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FEATURE 1: AI Personalization (Large Card: 2 Cols on lg) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Contextual AI Personalization
                  </h3>
                  <span className="text-xs text-slate-500">
                    Grounded in real recipient research and specific background context
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                OutreachOS drafts customized opening hooks and value propositions without hallucinating credentials or copying repetitive mass-market templates.
              </p>

              {/* Realistic Email-Generation UI Preview */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/70">
                  <span className="font-semibold text-slate-700">AI Draft Preview</span>
                  <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono font-medium">
                    Model: Gemini 2.5 Grounded
                  </span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p className="font-medium text-slate-900">
                    Subject: Engineering Leadership opening at HyperScale — Anjan Prajapati
                  </p>
                  <p className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
                    "Hi David, I reviewed HyperScale’s recent open-source work on distributed transaction tracing.
                    Given my background scaling real-time distributed pipelines handling 2M+ events/sec, I’d love to connect
                    and share how similar systems were delivered at scale."
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Automatic angle recommendation based on job description</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* FEATURE 2: Gmail Native (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Gmail Native Dispatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Sends directly via Google Workspace OAuth 2.0 with valid SPF, DKIM, and DMARC alignment. No third-party relay markers.
              </p>

              {/* Status Visual */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Delivery Mode</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    RFC 2822 Direct
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Connected Account</span>
                  <span className="font-mono text-slate-700 text-[11px]">Primary Workspace</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Inbox Deliverability Guard Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Zero third-party SMTP server relays
            </div>
          </div>

          {/* FEATURE 3: Smart Scheduling (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 w-fit mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Smart Dispatch Queue
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Schedule outreach across recipient business hours with randomized inter-message jitter to protect account safety.
              </p>

              {/* Timeline Visual */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Dispatch Queue</span>
                  <span className="text-indigo-600 font-mono">3 Pending</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200 text-[11px]">
                    <span className="truncate font-medium text-slate-800">David Ross (VPE)</span>
                    <span className="text-slate-400 font-mono shrink-0">09:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200 text-[11px]">
                    <span className="truncate font-medium text-slate-800">Elena Chen (Director)</span>
                    <span className="text-slate-400 font-mono shrink-0">09:42 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Daily quota safeguards prevent spikes
            </div>
          </div>

          {/* FEATURE 4: Private Document Vault (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Private Document Vault
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Upload verified PDF/DOC files to a private Vercel Blob store. Attached server-side directly into Gmail messages.
              </p>

              {/* Vault Document List */}
              <div className="space-y-1.5">
                {[
                  { name: 'Anjan_Prajapati_Resume.pdf', tag: 'Default Resume', size: '248 KB' },
                  { name: 'Cover_Letter_Engineering.pdf', tag: 'Cover Letter', size: '112 KB' },
                  { name: 'Systems_Portfolio.pdf', tag: 'Private', size: '1.4 MB' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{doc.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0 border border-indigo-200/60">
                      {doc.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Zero public web URLs exposed
            </div>
          </div>

          {/* FEATURE 5: Response Intelligence (2 Cols on lg) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <MessageSquareText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Reply Intelligence & Categorization
                  </h3>
                  <span className="text-xs text-slate-500">
                    Detect incoming responses in Gmail and classify sentiment instantly
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Never lose a prospect in your inbox. OutreachOS continuously syncs incoming replies and categorizes them into actionable stages with suggested AI response drafts.
              </p>

              {/* Reply Classification Interface */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">INTERVIEW</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    "We would love to set up a technical chat with our hiring team this Tuesday..."
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">INTERESTED</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-snug">
                    "Send over your project portfolio and compensation expectations."
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">FOLLOW_UP</span>
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    "Looping in our recruiter Sarah Lin for the upcoming headcount cycle."
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Automatic stop-on-reply protects you from awkward double-sends</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* FEATURE 6: Automated Follow-Ups (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit mb-4">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Automated Follow-Up Rules
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Set non-intrusive follow-up sequences. If no reply is detected after 3–5 days, a gentle polite note is automatically staged.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="text-[11px] text-slate-500">Trigger Condition:</div>
                <div className="text-slate-800 font-medium">IF days_since_sent &gt; 3 AND replies == 0</div>
                <div className="text-indigo-600 text-[11px] font-semibold font-sans pt-1">
                  → Auto-draft threaded follow-up
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Halts immediately if the recipient responds
            </div>
          </div>

          {/* FEATURE 7: Campaigns & Pipeline (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Targeted Outreach Campaigns
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Group prospects into focused campaigns. Monitor delivery, open rates, and reply statuses with zero clutter.
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200/80">
                  <span className="font-semibold text-slate-800">Q3 Tier-1 Engineering</span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    42% Replied
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200/80">
                  <span className="font-semibold text-slate-800">Tech Founders & VCs</span>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Complete audit history on every contact
            </div>
          </div>

          {/* FEATURE 8: OutreachOS AI Copilot (1 Col) */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Natural-Language Copilot
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Instruct the AI drawer in plain English to prepare messages, match resumes, or analyze job descriptions.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="text-[11px] font-semibold text-indigo-700">"Draft a note to Alex at Stripe"</div>
                <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-700 leading-snug">
                  ✓ Found Alex Vance (Principal Eng)<br />
                  ✓ Prepared personalized message<br />
                  ✓ Ready for review in Compose
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Human-in-the-loop review always enforced
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
