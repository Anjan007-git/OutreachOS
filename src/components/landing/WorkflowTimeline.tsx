import React from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Users,
  Sparkles,
  FileText,
  Send,
  Inbox,
  Repeat,
} from 'lucide-react';

export const WorkflowTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Mail,
      title: 'Connect Gmail',
      description: 'Authorize your Google Workspace mailbox directly with official OAuth 2.0 in seconds.',
    },
    {
      num: '02',
      icon: Users,
      title: 'Add Contacts',
      description: 'Import targeted decision-makers with organization details, roles, and personalized context.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Personalize with AI',
      description: 'Generate authentic, context-grounded outreach drafts without generic templates.',
    },
    {
      num: '04',
      icon: FileText,
      title: 'Attach Documents',
      description: 'Link your default resume or portfolio from your secure private document vault.',
    },
    {
      num: '05',
      icon: Send,
      title: 'Send or Schedule',
      description: 'Dispatch immediately or queue delivery across recipient business hours with safety rate limits.',
    },
    {
      num: '06',
      icon: Inbox,
      title: 'Track Replies',
      description: 'Automatically monitor incoming responses, categorize sentiment, and alert you.',
    },
    {
      num: '07',
      icon: Repeat,
      title: 'Follow Up',
      description: 'Trigger automated, multi-stage follow-ups that automatically cancel once a reply is detected.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-black border-t border-slate-200/80 dark:border-zinc-850 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 mb-4 inline-block">
            Proven Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            From Contact to Conversation.
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            A linear, dependable seven-step operational pipeline that removes busywork and maximizes response quality.
          </p>
        </motion.div>

        {/* 7-Step Grid Layout with staggered scroll entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-850 p-5 shadow-2xs hover:border-indigo-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Number Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-zinc-300 bg-indigo-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-indigo-100 dark:border-zinc-800">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-850 text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                  Step {step.num} of 07
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
