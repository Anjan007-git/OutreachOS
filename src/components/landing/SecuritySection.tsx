import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, KeyRound, Lock, UserCheck } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityCards = [
    {
      icon: ShieldCheck,
      title: 'Google OAuth 2.0',
      description:
        'Direct, scoped Gmail authorization. We never see or store your Google password. Access tokens are encrypted and refreshed securely.',
    },
    {
      icon: KeyRound,
      title: 'Server-Side Secrets',
      description:
        'All API tokens, database keys, and Gemini credentials live exclusively in protected server environments and are never exposed to the browser.',
    },
    {
      icon: Lock,
      title: 'Private Document Storage',
      description:
        'Uploaded resumes and portfolios are stored in private Vercel Blob object storage with zero public URLs. Files are fetched strictly server-side.',
    },
    {
      icon: UserCheck,
      title: 'User-Level Isolation',
      description:
        'Strict tenant boundaries ensure each user only accesses their own contacts, templates, documents, and dispatch queues with session authorization.',
    },
  ];

  return (
    <section id="security" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0e0e0e] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.06] mb-4 inline-block">
            Security & Privacy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Your Outreach Data Stays Yours.
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Engineered with strict zero-trust principles, official Google OAuth scopes, and private cloud storage so you always maintain complete ownership of your communications.
          </p>
        </motion.div>

        {/* 4 Cards Grid with staggered scroll entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs hover:border-indigo-300 dark:hover:border-white/[0.14] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-100 dark:border-white/[0.06]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/[0.05] text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified Architecture</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
