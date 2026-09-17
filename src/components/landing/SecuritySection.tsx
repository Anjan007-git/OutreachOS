import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MailCheck, Lock, Gauge, KeyRound, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityItems = [
    {
      icon: MailCheck,
      title: 'Direct Gmail API Sending',
      description:
        'Outreach is dispatched natively through official Google Workspace APIs. Your emails carry authentic SPF, DKIM, and DMARC alignment without shared relay headers.',
    },
    {
      icon: ShieldCheck,
      title: 'No Mass Marketing Relays',
      description:
        'Zero bulk-mailing relays, third-party pixel wrappers, or redirect links. Messages look and behave exactly like 1-on-1 human emails to incoming mail filters.',
    },
    {
      icon: Lock,
      title: 'Private Document Storage',
      description:
        'Your uploaded resumes, portfolios, and research papers are stored in encrypted private blob storage with zero public URLs and authenticated server access.',
    },
    {
      icon: Gauge,
      title: 'Safe Daily Sending Limits',
      description:
        'Built-in quota guards enforce conservative daily delivery caps and 60–180s randomized intervals, preventing mailbox suspensions and domain flagging.',
    },
    {
      icon: KeyRound,
      title: 'OAuth 2.0 Authorization',
      description:
        'Directly authorized through Google Identity. We never see or store your Google password. Tokens are stored encrypted and can be revoked at any time.',
    },
  ];

  return (
    <section id="security" className="py-12 sm:py-16 bg-slate-50/60 dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
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
            Security & Trust
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
            Your Outreach Data Stays Yours.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Engineered with strict zero-trust principles, official Google OAuth scopes, and direct mailbox transport so your reputation remains protected.
          </p>
        </motion.div>

        {/* 5 Technical Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {securityItems.slice(0, 3).map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-100/70 dark:border-white/[0.08]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enforced Architecture</span>
                </div>
              </motion.div>
            );
          })}

          {/* Remaining 2 items span nicely across columns */}
          {securityItems.slice(3, 5).map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx + 3}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: (idx + 3) * 0.04 }}
                className="lg:col-span-1 md:col-span-1 rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-100/70 dark:border-white/[0.08]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enforced Architecture</span>
                </div>
              </motion.div>
            );
          })}

          {/* 6th Card: Zero Third-Party Advertising / Privacy Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-100/70 dark:border-white/[0.08]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                User-Level Data Isolation
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                Strict tenant isolation ensures your contacts, customized templates, private documents, and email queues are accessible only by your authenticated session.
              </p>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Strict Data Boundary</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
