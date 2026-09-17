import React from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
} from 'lucide-react';

interface AIAssistantSectionProps {
  onExploreAI?: () => void;
}

export const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({ onExploreAI }) => {
  return (
    <section id="ai-assistant" className="py-20 sm:py-28 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Positioning with smooth scroll entrance */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-700 dark:text-zinc-300 border border-indigo-200/60 dark:border-white/[0.06] inline-block">
              OutreachOS AI
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Tell It What You Want.{' '}
              <span className="text-indigo-600 dark:text-indigo-400 block">
                It Handles the Workflow.
              </span>
            </h2>

            <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
              Instead of manually filling out repetitive forms, direct the built-in OutreachOS Assistant.
              It looks up contacts, references your private document repository, extracts relevant organizational context, and stages personalized drafts in seconds.
            </p>

            {/* Human-in-the-loop Trust Guarantee */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Human-in-the-Loop Safeguard</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                OutreachOS AI prepares actions, drafts, and attachments, but sending and scheduling <strong>always require your explicit review and confirmation</strong>. Your reputation is never put on autopilot.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Conversational Interface with smooth entrance on scroll */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#060606] shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
              {/* Window Header */}
              <div className="h-12 bg-slate-900 dark:bg-[#080808] text-white px-5 flex items-center justify-between border-b border-slate-800 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-none">OutreachOS Assistant</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Context-Aware AI Copilot</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready
                </span>
              </div>

              {/* Chat Thread */}
              <div className="p-6 bg-slate-50/60 dark:bg-[#020202] space-y-5 font-sans text-xs">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="max-w-md p-3.5 rounded-2xl rounded-tr-none bg-indigo-600 text-white shadow-2xs leading-relaxed font-medium">
                    Prepare an outreach email for a software engineering role and attach my resume.
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#0c0c0c] flex items-center justify-center text-slate-700 dark:text-zinc-300 shrink-0 font-bold text-[10px]">
                    <User className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
                  </div>
                </div>

                {/* AI Assistant Response */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-[#0c0c0c] flex items-center justify-center text-indigo-700 dark:text-zinc-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="max-w-xl space-y-3">
                    <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-[#060606] border border-slate-200 dark:border-white/[0.05] text-slate-700 dark:text-zinc-300 shadow-2xs leading-relaxed space-y-2">
                      <p>
                        I found your selected resume (<strong className="text-slate-900 dark:text-white">Your Resume.pdf</strong>) and prepared a personalized draft.
                      </p>
                    </div>

                    {/* Staged Draft Action Card */}
                    <div className="rounded-xl border border-indigo-200 dark:border-white/[0.06] bg-white dark:bg-[#060606] p-4 shadow-sm space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-0.5">
                          Subject Line
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          Software Engineering Role — Personalized Outreach
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/[0.05] text-slate-800 dark:text-zinc-200">
                        <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="font-medium truncate text-[11px]">
                          Your Resume.pdf
                        </span>
                        <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#141414] px-1.5 py-0.5 rounded border border-emerald-200 dark:border-white/[0.06] font-semibold">
                          Private Document
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50/80 dark:bg-[#0a0a0a] border border-slate-200/80 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                        "Hi [Contact Name], I noticed your team’s recent engineering initiatives in distributed systems. With a strong background in software engineering..."
                      </div>

                      {/* Action Confirmation Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={onExploreAI}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                        >
                          Review in Compose
                        </button>
                        <button
                          onClick={onExploreAI}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0c] hover:bg-slate-50 dark:hover:bg-[#141414] text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Schedule for Tomorrow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Simulated Input Bar */}
              <div className="p-3 bg-white dark:bg-[#060606] border-t border-slate-200 dark:border-white/[0.06] flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-100 dark:bg-[#0c0c0c] rounded text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                  Type instructions or select a quick action...
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
