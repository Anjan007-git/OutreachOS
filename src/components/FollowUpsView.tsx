import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import { FollowUpRule, FollowUpInstance, Campaign } from '../types';

interface FollowUpsViewProps {
  rules: FollowUpRule[];
  instances: FollowUpInstance[];
  campaigns: Campaign[];
  onCreateRule: (rule: Partial<FollowUpRule>) => Promise<void>;
  onToggleRule: (id: string) => Promise<void>;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  rules,
  instances,
  campaigns,
  onCreateRule,
  onToggleRule,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [stepNumber, setStepNumber] = useState<number>(1);
  const [daysAfterPrevious, setDaysAfterPrevious] = useState<number>(5);
  const [subjectTemplate, setSubjectTemplate] = useState('Following up: {{role}} inquiry at {{organization}}');
  const [messageTemplate, setMessageTemplate] = useState(
    `Hi {{first_name}},\n\nI wanted to follow up on my previous note regarding the {{role}} opening at {{organization}}.\n\nI understand your schedule is busy, so I wanted to briefly reiterate my strong interest and attach my resume for convenience.\n\nBest regards,\nAnjan Prajapati`
  );

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const camp = campaigns.find((c) => c.id === selectedCampaignId);
    await onCreateRule({
      campaignId: selectedCampaignId || 'general',
      campaignName: camp?.name || 'General Outreach Follow-up',
      stepNumber: Number(stepNumber) || 1,
      daysAfterPrevious: Number(daysAfterPrevious) || 5,
      subjectTemplate,
      messageTemplate,
      stopOnReply: true,
      status: 'ACTIVE',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Follow-up Automation Rules</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define multi-step cadences. Sequences automatically abort the moment a reply is detected.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Follow-up Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
            <Repeat className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No follow-up sequences active</p>
            <p className="text-xs text-slate-400 mt-1">
              Add rules to automatically schedule polite reminders after 3-7 days of no reply.
            </p>
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    Step {rule.stepNumber} &bull; +{rule.daysAfterPrevious} Days
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      rule.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rule.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{rule.campaignName}</h3>
                <div className="text-xs font-semibold text-slate-700 truncate mb-2">
                  {rule.subjectTemplate}
                </div>

                <div className="text-xs text-slate-500 line-clamp-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 font-sans mb-3.5">
                  {rule.messageTemplate}
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Auto-stops if recipient replies</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Rule ID: {rule.id.slice(-6)}</span>
                <button
                  onClick={() => onToggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                    rule.status === 'ACTIVE'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {rule.status === 'ACTIVE' ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scheduled Follow-up Instances Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Pending Follow-up Instances</h2>
            <p className="text-xs text-slate-500">Live tracker of queued recipient follow-ups</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total active: {instances.filter((i) => i.status === 'SCHEDULED').length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Due Date (IST)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instances.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    No follow-ups currently pending.
                  </td>
                </tr>
              ) : (
                instances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.contactName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{item.contactEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {new Date(item.scheduledFor).toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      IST
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'STOPPED_REPLY_RECEIVED'
                            ? 'bg-purple-100 text-purple-700'
                            : item.status === 'SENT'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {item.status === 'STOPPED_REPLY_RECEIVED'
                          ? 'Halted (Reply Received)'
                          : item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Create Follow-up Cadence Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Campaign</label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium cursor-pointer"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days After Previous</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={daysAfterPrevious}
                    onChange={(e) => setDaysAfterPrevious(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Line Template</label>
                <input
                  type="text"
                  required
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Body Template</label>
                <textarea
                  rows={6}
                  required
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full p-3 font-sans leading-relaxed rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/70"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
