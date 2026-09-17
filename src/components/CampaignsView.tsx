import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Plus,
  Play,
  Pause,
  Trash2,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { Campaign, CampaignType, Contact, Template } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  contacts: Contact[];
  templates: Template[];
  onCreateCampaign: (campaign: Partial<Campaign>) => Promise<void>;
  onUpdateStatus: (id: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED') => Promise<void>;
  onDeleteCampaign: (id: string) => Promise<void>;
  onNavigateToCompose: (campaign: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  contacts,
  templates,
  onCreateCampaign,
  onUpdateStatus,
  onDeleteCampaign,
  onNavigateToCompose,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // New Campaign Form
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<CampaignType>('JOB_OUTREACH');
  const [formDailyLimit, setFormDailyLimit] = useState(5);
  const [formSelectedContacts, setFormSelectedContacts] = useState<string[]>([]);
  const [formTemplateId, setFormTemplateId] = useState<string>('');

  const handleOpenCreate = () => {
    setFormName('');
    setFormType('JOB_OUTREACH');
    setFormDailyLimit(5);
    setFormSelectedContacts([]);
    setFormTemplateId(templates[0]?.id || '');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    const selectedTpl = templates.find((t) => t.id === formTemplateId);
    await onCreateCampaign({
      name: formName.trim(),
      description: `Targeted sequence for ${formSelectedContacts.length} recipients.`,
      type: formType,
      recipientIds: formSelectedContacts,
      contactIds: formSelectedContacts,
      dailyLimit: Number(formDailyLimit) || 5,
      dailySendingLimit: Number(formDailyLimit) || 5,
      templateId: formTemplateId,
      subject: selectedTpl?.subject || (formType === 'JOB_OUTREACH' ? 'Job Opportunity Inquiry - {{company}}' : 'Outreach Inquiry'),
      message: selectedTpl?.body || 'Hi {{first_name}},\n\nI hope you are doing well. I would love to connect regarding opportunities at {{company}}.\n\nBest regards,\nAnjan',
      attachments: [],
      delayMinutes: 10,
      scheduleType: 'weekdays',
      scheduleTime: '10:00',
      status: 'ACTIVE',
      sendingTimeWindow: {
        startTime: '09:00',
        endTime: '18:00',
        timezone: 'Asia/Kolkata',
      },
    });

    setIsCreateModalOpen(false);
  };

  const filteredCampaigns = campaigns.filter(
    (c) => filterType === 'ALL' || c.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Outreach Campaigns</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Structure your outreach into dedicated sequences for tech jobs, recruiter networking, and university admissions.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black font-medium text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Campaign Types</option>
            <option value="JOB_OUTREACH">Job Outreach</option>
            <option value="UNIVERSITY_ADMISSIONS">University Admissions</option>
            <option value="CUSTOM">Custom Outreach</option>
          </select>

          <button
            id="btn-create-campaign-modal"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-16 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No campaigns created yet</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Launch targeted job search or academic outreach workflows with automated pacing, personalized variables, and AI templates.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Campaign</span>
            </button>
          </div>
        ) : (
          filteredCampaigns.map((c) => {
            const isJob = c.type === 'JOB_OUTREACH' || (c.type as string) === 'Job Outreach';
            const recipientList = c.recipientIds || c.contactIds || [];
            const totalRecipients = recipientList.length;
            const sentCount = c.sentCount ?? 0;
            const replyCount = c.replyCount ?? 0;
            const pacingLimit = c.dailyLimit ?? c.dailySendingLimit ?? 5;
            const progress = totalRecipients > 0 ? Math.min(100, Math.round((sentCount / totalRecipients) * 100)) : 0;

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isJob
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900'
                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900'
                        }`}
                      >
                        {isJob ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{c.name}</h3>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500">
                          {String(c.type || 'OUTREACH').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : c.status === 'PAUSED'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4 line-clamp-2">
                    {c.description || `Targeted sequence for ${totalRecipients} recipients.`}
                  </p>

                  {/* Metrics Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-zinc-400">
                      <span className="font-medium">Delivery Progress</span>
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {sentCount} / {totalRecipients} ({progress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-zinc-900/70 p-3 rounded-xl border border-slate-100 dark:border-zinc-850 mb-4">
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium uppercase tracking-wider">Responses</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{replyCount} replies</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px] font-medium uppercase tracking-wider">Pacing</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{pacingLimit} emails/day</span>
                    </div>
                  </div>
                </div>

                {/* Campaign Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {c.status === 'ACTIVE' ? (
                      <button
                        onClick={() => onUpdateStatus(c.id, 'PAUSED')}
                        title="Pause Campaign"
                        className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span className="font-semibold text-xs">Pause</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(c.id, 'ACTIVE')}
                        title="Resume Campaign"
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span className="font-semibold text-xs">Resume</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Delete campaign "${c.name}"?`)) {
                          onDeleteCampaign(c.id);
                        }
                      }}
                      title="Delete Campaign"
                      className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onNavigateToCompose(c)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Outreach Campaign</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Senior Cloud Architect Outreach - US & EU"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium bg-slate-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Target Outreach Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CampaignType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
                  >
                    <option value="JOB_OUTREACH">Job Outreach (HR / Recruiters)</option>
                    <option value="UNIVERSITY_ADMISSIONS">Graduate / University Admissions</option>
                    <option value="CUSTOM">Custom Campaign</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Daily Sending Cap</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formDailyLimit}
                    onChange={(e) => setFormDailyLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium bg-slate-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 block">Paced sending to protect deliverability</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Default Template</label>
                <select
                  value={formTemplateId}
                  onChange={(e) => setFormTemplateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
                >
                  <option value="">-- None (Compose Freeform) --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Contacts */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300">
                    Target Contacts ({formSelectedContacts.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formSelectedContacts.length === contacts.length) {
                        setFormSelectedContacts([]);
                      } else {
                        setFormSelectedContacts(contacts.map((c) => c.id));
                      }
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    {formSelectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-zinc-800 rounded-xl p-2.5 space-y-1 bg-slate-50 dark:bg-zinc-900">
                  {contacts.map((c) => {
                    const isChecked = formSelectedContacts.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormSelectedContacts([...formSelectedContacts, c.id]);
                              } else {
                                setFormSelectedContacts(formSelectedContacts.filter((id) => id !== c.id));
                              }
                            }}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-medium text-slate-800 dark:text-zinc-200">{c.name}</span>
                          <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">({c.organization})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">{c.role || c.organizationType}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
