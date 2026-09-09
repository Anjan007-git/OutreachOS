import React from 'react';
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
    <section className="border-y border-slate-200/80 bg-slate-50/70 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs hover:bg-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
