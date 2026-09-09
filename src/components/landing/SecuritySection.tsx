import React from 'react';
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
    <section id="security" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mb-4 inline-block">
            Security & Privacy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Your Outreach Data Stays Yours.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Engineered with strict zero-trust principles, official Google OAuth scopes, and private cloud storage so you always maintain complete ownership of your communications.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Enforced by Architecture</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
