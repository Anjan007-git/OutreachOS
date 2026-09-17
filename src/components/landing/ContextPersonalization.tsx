import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Sparkles,
  FileText,
  CheckCircle,
  ArrowRight,
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
    <section className="py-12 sm:py-16 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
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
            Context-Aware Outreach
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
            Personalized by Context, Not Guesswork.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            OutreachOS uses the information you provide to create relevant, high-impact outreach without hallucinations or generic templates.
          </p>
        </motion.div>

        {/* Workflow Progression Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mb-12 overflow-x-auto pb-2 scrollbar-none"
        >
          <div className="flex items-center justify-between min-w-[700px] p-2.5 rounded-xl bg-slate-50 dark:bg-[#060606] border border-slate-200/80 dark:border-white/[0.06] text-xs">
            {steps.map((s, idx) => (
              <React.Fragment key={idx}>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 px-2 py-1 rounded-md bg-white dark:bg-[#0c0c0c] border border-slate-200/60 dark:border-white/[0.05] shadow-2xs">
                  {s}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Split Generic Context Layout */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#020202] p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Context Inputs Provided by User */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Context Inputs You Provide
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-zinc-300 bg-emerald-50 dark:bg-[#0e0e0e] px-2 py-0.5 rounded border border-emerald-200 dark:border-white/[0.06]">
                  Grounded Source
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#060606] border border-slate-200 dark:border-white/[0.06] text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">Recipient</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">Professional Contact</div>
                  <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Engineering Leadership</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#060606] border border-slate-200 dark:border-white/[0.06] text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">Organization</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">Target Organization</div>
                  <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Role: Target Role</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#060606] border border-slate-200 dark:border-white/[0.06] text-xs shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block">Relevant Context</span>
                  <div className="font-medium text-slate-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                    Verified organization focus areas, recent announcements, and specific domain requirements.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#060606] border border-slate-200 dark:border-white/[0.06] text-xs shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-zinc-200 text-[11px]">Your Resume.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Attached</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-zinc-400 italic pt-1">
                Strict rule: Generated draft adheres strictly to the parameters and documents you specify.
              </div>
            </motion.div>

            {/* Center Bridge Indicator (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-slate-300 dark:text-zinc-700">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center shadow-2xs">
                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            {/* Right Column: Generic Generated Outreach */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 bg-white dark:bg-[#060606] rounded-xl border border-indigo-200/80 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Generated Personalized Outreach
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 dark:text-zinc-300 bg-indigo-50 dark:bg-[#0e0e0e] px-2 py-0.5 rounded border border-indigo-100 dark:border-white/[0.06]">
                  Ready to Review
                </span>
              </div>

              <div className="text-xs space-y-3 font-sans text-slate-700 dark:text-zinc-300 leading-relaxed">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subject</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    Personalized Outreach — Target Role
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/[0.05] space-y-2">
                  <p className="dark:text-zinc-200">Hi [Contact Name],</p>
                  <p>
                    I noticed [Target Organization]’s recent focus in [Domain/Engineering]. In my background developing distributed services, I led high-throughput projects focused on system reliability.
                  </p>
                  <p>
                    I would welcome the opportunity to explore how my experience aligns with the [Target Role] opening. My resume is attached for your review.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white pt-1">
                    Would you have time for a brief introductory conversation this week?
                  </p>
                  <p className="pt-2 text-slate-500 dark:text-zinc-400 text-[11px]">
                    Best regards,<br />
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">[Your Name]</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>100% Grounded in your uploaded profile and verified contact details.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
