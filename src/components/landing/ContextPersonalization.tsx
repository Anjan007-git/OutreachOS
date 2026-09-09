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
  Layers,
} from 'lucide-react';

export const ContextPersonalization: React.FC = () => {
  const steps = [
    'Recipient',
    'Role',
    'Company',
    'Relevant Context',
    'User Documents',
    'AI Draft',
    'Review',
    'Send',
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-4 inline-block">
            Context-Aware Outreach
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Personalized by Context, Not Guesswork.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            OutreachOS uses the information you provide to create relevant, high-impact outreach without hallucinations or generic templates.
          </p>
        </div>

        {/* Workflow Progression Ribbon */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[700px] p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            {steps.map((s, idx) => (
              <React.Fragment key={idx}>
                <span className="font-semibold text-slate-700 px-2 py-1 rounded-md bg-white border border-slate-200/60 shadow-2xs">
                  {s}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Split Generic Context Layout */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Context Inputs Provided by User */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Context Inputs You Provide
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Grounded Source
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Recipient</span>
                  <div className="font-semibold text-slate-800">Professional Contact</div>
                  <div className="text-slate-500 text-[11px]">Engineering Leadership</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Organization</span>
                  <div className="font-semibold text-slate-800">Target Organization</div>
                  <div className="text-slate-500 text-[11px]">Role: Target Role</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Relevant Context</span>
                  <div className="font-medium text-slate-700 text-[11px] leading-relaxed">
                    Verified organization focus areas, recent announcements, and specific domain requirements.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px]">Your Resume.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Attached</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic pt-1">
                Strict rule: Generated draft adheres strictly to the parameters and documents you specify.
              </div>
            </div>

            {/* Center Bridge Indicator (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-slate-300">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            {/* Right Column: Generic Generated Outreach */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-indigo-200/80 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Generated Personalized Outreach
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Ready to Review
                </span>
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 leading-relaxed">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subject</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Personalized Outreach — Target Role
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <p>Hi [Contact Name],</p>
                  <p>
                    I noticed [Target Organization]’s recent focus in [Domain/Engineering]. In my background developing distributed services, I led high-throughput projects focused on system reliability.
                  </p>
                  <p>
                    I would welcome the opportunity to explore how my experience aligns with the [Target Role] opening. My resume is attached for your review.
                  </p>
                  <p className="font-semibold text-slate-900 pt-1">
                    Would you have time for a brief introductory conversation this week?
                  </p>
                  <p className="pt-2 text-slate-500 text-[11px]">
                    Best regards,<br />
                    <span className="font-semibold text-slate-700">[Your Name]</span>
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
