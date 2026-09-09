import React from 'react';
import {
  ShieldCheck,
  Building,
  User,
  Briefcase,
  Sparkles,
  FileText,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const ContextPersonalization: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-4 inline-block">
            Deterministic Grounding
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Personalized by Context. Not Guesswork.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            OutreachOS strictly conditions output on verified prospect data and your real background. No fabricated achievements or fake familiarity.
          </p>
        </div>

        {/* Split Interactive-style Context Layout */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Verified Context */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Verified Context Inputs
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Grounded Source
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Prospect</span>
                  <div className="font-semibold text-slate-800">Sarah Lin • Staff Engineering Manager</div>
                  <div className="text-slate-500 text-[11px]">CloudScale Technologies</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Company Context</span>
                  <div className="font-medium text-slate-700 text-[11px] leading-relaxed">
                    Recent press release: "Scaling telemetry pipelines across 12 distributed AWS/GCP regions."
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Verified Background</span>
                  <div className="font-medium text-slate-700 text-[11px] leading-relaxed">
                    6+ years backend systems, Go/Rust, Kafka telemetry, Kubernetes clusters.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px]">Anjan_Prajapati_Resume.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Attached</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic pt-1">
                Strict rule: Model generates copy grounded only in the facts above.
              </div>
            </div>

            {/* Center Bridge Indicator (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-slate-300">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            {/* Right Column: Generated Outreach */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-indigo-200/80 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Generated Personalized Outreach
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Ready to Dispatch
                </span>
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 leading-relaxed">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subject</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Staff Systems Engineer role at CloudScale — Anjan Prajapati
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <p>Hi Sarah,</p>
                  <p>
                    I noticed CloudScale’s recent milestone scaling telemetry across 12 distributed regions.
                    In my past 6 years building distributed backend infrastructure, I led the migration
                    of multi-region Kafka data streams processing millions of events per second with 99.99% uptime.
                  </p>
                  <p>
                    I’d love to explore how my hands-on background can help your core platform team as you continue scaling.
                    I’ve attached my resume for quick review.
                  </p>
                  <p className="font-semibold text-slate-900 pt-1">
                    Would you be open to a brief introductory chat this week?
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Grounded in your uploaded profile and verified contact details.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
