import React from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  CheckCircle2,
  Clock,
  Mail,
  ArrowRight,
} from 'lucide-react';

interface AIAssistantSectionProps {
  onExploreAI?: () => void;
}

export const AIAssistantSection: React.FC<AIAssistantSectionProps> = () => {
  return (
    <section id="ai-assistant" className="py-12 sm:py-16 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Positioning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-white/[0.08] inline-block">
              OutreachOS AI
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              Tell It What You Want.{' '}
              <span className="text-indigo-600 dark:text-indigo-400 block">
                It Handles the Workflow.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
              Instead of manually filling out repetitive forms, direct the built-in OutreachOS Assistant.
              It looks up contacts, references your private document repository, extracts relevant organizational context, and stages personalized drafts in seconds.
            </p>

            {/* Human-in-the-loop Trust Guarantee */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Human-in-the-Loop Safeguard</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                OutreachOS AI prepares actions, drafts, and attachments, but sending and scheduling <strong>always require your explicit review and confirmation</strong>. Your reputation is never put on autopilot.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Conversational Assistant Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#070707] shadow-lg shadow-slate-200/30 dark:shadow-none overflow-hidden">
              {/* Window Header */}
              <div className="h-11 bg-slate-900 dark:bg-[#0d0d0d] text-white px-4 sm:px-5 flex items-center justify-between border-b border-slate-800 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-none">OutreachOS Assistant</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Context-Aware AI Copilot</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready
                </span>
              </div>

              {/* Chat Thread */}
              <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-[#020202] space-y-4 font-sans text-xs">
                {/* User Message */}
                <div className="flex items-start gap-2.5 justify-end">
                  <div className="max-w-md p-3 rounded-xl rounded-tr-none bg-slate-900 dark:bg-zinc-800 text-white shadow-2xs leading-relaxed font-medium">
                    Prepare a concise outreach email for a hiring manager.
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-300 shrink-0 font-bold text-[10px]">
                    <User className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-300" />
                  </div>
                </div>

                {/* AI Assistant Response */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-700 dark:text-zinc-300 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="max-w-xl space-y-2.5 w-full">
                    {/* Status Ack */}
                    <div className="p-3 rounded-xl rounded-tl-none bg-white dark:bg-[#090909] border border-slate-200/90 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Draft prepared</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                          Confidence 99%
                        </span>
                      </div>

                      {/* Subject Line */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                          Subject:
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5">
                          Cloud & Data Engineering Internship Inquiry
                        </div>
                      </div>

                      {/* Draft Body Snippet */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200/70 dark:border-white/[0.06] text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
                        "Hi [Hiring Manager], I've been following your engineering team's work on cloud architecture and distributed data infrastructure. Having developed scalable backend services and streaming pipelines, I've attached my technical resume for consideration for your team's internship openings."
                      </div>

                      {/* Document Attachment Note */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200/70 dark:border-white/[0.06] text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-slate-900 dark:text-white">Resume.pdf</span>
                          <span className="text-[10px] text-slate-400">(Selected from vault)</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Attached</span>
                      </div>

                      {/* Exact 4 Required Status Indicators */}
                      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-indigo-50 dark:bg-zinc-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-white/[0.06] text-[10px] font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>Personalized</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-emerald-50 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-white/[0.06] text-[10px] font-semibold">
                            <Mail className="w-3 h-3" />
                            <span>Gmail Ready</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-blue-50 dark:bg-zinc-900 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-white/[0.06] text-[10px] font-semibold">
                            <FileText className="w-3 h-3" />
                            <span>Attachment Ready</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-amber-50 dark:bg-zinc-900 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-white/[0.06] text-[10px] font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>Awaiting Review</span>
                          </div>
                        </div>
                      </div>

                      {/* Review Buttons: Demonstrating Explicit Human Review */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Requires confirmation before dispatch
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            tabIndex={-1}
                            className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 font-semibold text-[10px] pointer-events-none"
                          >
                            Adjust Tone
                          </button>
                          <button
                            type="button"
                            tabIndex={-1}
                            className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-semibold text-[10px] pointer-events-none flex items-center gap-1"
                          >
                            <span>Review Draft</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
