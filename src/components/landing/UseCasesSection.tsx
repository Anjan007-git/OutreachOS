import React from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  UserCheck,
  Users,
  TrendingUp,
  GraduationCap,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface UseCasesSectionProps {
  onSelectUseCase?: (title: string) => void;
}

export const UseCasesSection: React.FC<UseCasesSectionProps> = ({ onSelectUseCase }) => {
  const cases = [
    {
      icon: Briefcase,
      title: 'Job Applications',
      tag: 'Career & Tech',
      description:
        'Target engineering managers and recruiters directly with tailored pitches, verified CV attachments, and morning dispatch schedules.',
    },
    {
      icon: UserCheck,
      title: 'Recruiting Outreach',
      tag: 'Talent Acquisition',
      description:
        'Source passive engineering and leadership talent with personalized technical hooks, role briefs, and tracked reply statuses.',
    },
    {
      icon: Users,
      title: 'Professional Networking',
      tag: 'Founders & Execs',
      description:
        'Connect with industry peers, mentors, podcast guests, and alumni with authentic notes that respect the recipient’s time.',
    },
    {
      icon: TrendingUp,
      title: 'Business Development',
      tag: 'B2B Sales',
      description:
        'Initiate enterprise conversations and partnership inquiries without sounding like spam or triggering spam filters.',
    },
    {
      icon: GraduationCap,
      title: 'University Outreach',
      tag: 'Research & Academia',
      description:
        'Contact professors, researchers, and lab directors with custom statements of intent, research interests, and attached transcripts.',
    },
    {
      icon: Building2,
      title: 'Client Outreach',
      tag: 'Agencies & Consultancies',
      description:
        'Engage prospective clients, share tailored case studies, and follow up systematically to close high-value service contracts.',
    },
  ];

  return (
    <section id="use-cases" className="py-12 sm:py-16 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
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
            Target Audiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
            Built for High-Impact Outreach.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Designed for engineers, founders, recruiters, and professionals whose critical conversations cannot be trusted to generic automation.
          </p>
        </motion.div>

        {/* 6 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                onClick={() => onSelectUseCase?.(item.title)}
                className="rounded-2xl bg-white dark:bg-[#070707] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/70 dark:border-white/[0.08]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/70 dark:border-white/[0.06]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-5 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-semibold text-slate-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Explore workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
