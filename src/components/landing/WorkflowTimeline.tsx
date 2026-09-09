import React from 'react';
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
            A linear, dependable seven-step operational pipeline that removes busywork and maximizes response quality.
          </p>
        </div>

        {/* 7-Step Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  Step {step.num} of 07
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
