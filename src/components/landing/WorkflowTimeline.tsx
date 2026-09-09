import React from 'react';
import { Mail, Users, Sparkles, Send, MessageSquareText } from 'lucide-react';

export const WorkflowTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Mail,
      title: 'Connect Gmail',
      description: 'Authorize your Google Workspace mailbox directly with official OAuth 2.0 in one click.',
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
      description: 'Generate authentic, context-grounded outreach drafts without generic mass templates.',
    },
    {
      num: '04',
      icon: Send,
      title: 'Send or Schedule',
      description: 'Dispatch immediately or queue delivery across recipient business hours with rate limits.',
    },
    {
      num: '05',
      icon: MessageSquareText,
      title: 'Track Replies',
      description: 'Automatically detect incoming responses, categorize intent, and prepare follow-up notes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mb-4 inline-block">
            Proven Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            From Contact to Conversation.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            A linear, dependable five-step operational pipeline that removes busywork and maximizes response quality.
          </p>
        </div>

        {/* Timeline Desktop Horizontal / Mobile Vertical */}
        <div className="relative">
          {/* Subtle Connecting Line on Desktop */}
          <div className="hidden lg:block absolute top-14 left-10 right-10 h-0.5 bg-slate-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Number Badge & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                    Step {step.num} of 05
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
