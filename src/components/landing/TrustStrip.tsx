import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Clock, ShieldCheck, MessageSquareText } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const items = [
    {
      icon: Sparkles,
      label: 'AI Personalization',
      sublabel: 'Grounded in real context',
    },
    {
      icon: Mail,
      label: 'Gmail Native',
      sublabel: 'Direct Google Workspace OAuth',
    },
    {
      icon: Clock,
      label: 'Smart Scheduling',
      sublabel: 'Timezone-aware queueing',
    },
    {
      icon: ShieldCheck,
      label: 'Private Documents',
      sublabel: 'Encrypted Vercel Blob store',
    },
    {
      icon: MessageSquareText,
      label: 'Reply Intelligence',
      sublabel: 'Automatic categorization',
    },
  ];

  return (
    <section className="border-y border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-black py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 dark:bg-[#060606] border border-slate-200/60 dark:border-white/[0.05] shadow-2xs hover:bg-white dark:hover:bg-[#0c0c0c] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100/80 dark:border-white/[0.06]">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
