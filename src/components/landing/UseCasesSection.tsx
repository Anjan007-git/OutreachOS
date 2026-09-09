import React from 'react';
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
    <section id="use-cases" className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mb-4 inline-block">
            Target Audiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Built for High-Impact Outreach.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Designed for engineers, founders, recruiters, and professionals whose critical conversations cannot be trusted to generic automation.
          </p>
        </div>

        {/* 6 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/70">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                  <span>Explore tailored workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
