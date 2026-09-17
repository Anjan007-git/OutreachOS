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
    <section id="use-cases" className="py-20 sm:py-28 bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
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
            Target Audiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            Built for High-Impact Outreach.
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Designed for engineers, founders, recruiters, and professionals whose critical conversations cannot be trusted to generic automation.
          </p>
        </motion.div>

        {/* 6 Use Cases Grid with staggered entrance on scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => onSelectUseCase?.(item.title)}
                className="rounded-2xl bg-white dark:bg-[#060606] border border-slate-200/90 dark:border-white/[0.06] p-6 shadow-2xs hover:border-indigo-300 dark:hover:border-white/[0.14] hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#0e0e0e] text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-white/[0.06]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#0c0c0c] text-slate-600 dark:text-zinc-400 border border-slate-200/70 dark:border-white/[0.05]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/[0.05] text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Explore tailored workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
