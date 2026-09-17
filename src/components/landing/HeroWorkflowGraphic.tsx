import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Sparkles,
  Layers,
  Mail,
  Clock,
  Inbox,
  Repeat,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  name: string;
  label: string;
  icon: React.ElementType;
  metric: string;
  colSpan?: string;
}

export const HeroWorkflowGraphic: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes: WorkflowNode[] = [
    {
      id: 'contacts',
      name: 'Contacts',
      label: 'Verified Targets',
      icon: Users,
      metric: 'Target Match',
    },
    {
      id: 'ai',
      name: 'AI Personalization',
      label: 'Grounded Context',
      icon: Sparkles,
      metric: '100% Unique',
    },
    {
      id: 'campaigns',
      name: 'Campaigns',
      label: 'Cohort Sequences',
      icon: Layers,
      metric: 'Multi-Stage',
    },
    {
      id: 'gmail',
      name: 'Gmail Native',
      label: 'Official OAuth 2.0',
      icon: Mail,
      metric: 'Direct Inbox',
    },
    {
      id: 'scheduling',
      name: 'Smart Scheduling',
      label: 'Timezone Paced',
      icon: Clock,
      metric: 'Safe Windows',
    },
    {
      id: 'responses',
      name: 'Responses',
      label: 'Intent Detection',
      icon: Inbox,
      metric: 'Real-Time',
    },
    {
      id: 'followups',
      name: 'Follow-Ups',
      label: 'Auto-Stop on Reply',
      icon: Repeat,
      metric: 'Zero Spam',
    },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#070707] p-4 sm:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none overflow-hidden select-none">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header of the System Canvas */}
      <div className="relative flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase tracking-wider">
            OutreachOS Execution Pipeline
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200/70 dark:border-white/[0.05]">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Active Pipeline</span>
        </div>
      </div>

      {/* Central Architecture Hub Layout */}
      <div className="relative space-y-3">
        {/* Core Hub Element */}
        <div className="relative p-3.5 rounded-xl bg-slate-900 dark:bg-[#0d0d0d] text-white border border-slate-800 dark:border-white/[0.12] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight">OutreachOS Core Engine</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Coordinates intelligence, safeguards & Gmail delivery</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-[10px] text-zinc-400 font-mono">
            <span className="text-emerald-400 font-semibold">Ready to Send</span>
            <span>Gmail API v1</span>
          </div>
        </div>

        {/* 7 Workflow Nodes arranged in a tight, structured bento flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {nodes.slice(0, 6).map((node) => {
            const Icon = node.icon;
            const isHovered = activeNode === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                className={`relative p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-default ${
                  isHovered
                    ? 'border-indigo-400/80 dark:border-white/25 bg-indigo-50/40 dark:bg-zinc-900/60 -translate-y-0.5 shadow-xs'
                    : 'border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0b0b0b] hover:border-slate-300 dark:hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-[#141414] text-slate-800 dark:text-zinc-200 border border-slate-200/60 dark:border-white/[0.08]">
                    <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-400 bg-white/80 dark:bg-black/40 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-white/[0.05]">
                    {node.metric}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  {node.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Follow-Ups Spanning Card */}
        {nodes[6] && (
          <div
            onMouseEnter={() => setActiveNode(nodes[6].id)}
            onMouseLeave={() => setActiveNode(null)}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
              activeNode === nodes[6].id
                ? 'border-indigo-400/80 dark:border-white/25 bg-indigo-50/40 dark:bg-zinc-900/60 -translate-y-0.5'
                : 'border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#0b0b0b]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white dark:bg-[#141414] text-slate-800 dark:text-zinc-200 border border-slate-200/60 dark:border-white/[0.08]">
                <Repeat className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {nodes[6].name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                  {nodes[6].label}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                Condition: If no reply in 3 days
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                Autonomous
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Status Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Single unified pipeline</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">Zero multi-tool fragmentation</span>
      </div>
    </div>
  );
};
