import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Clock,
  Sparkles,
  Sliders,
  History,
  User,
  Shield,
  Trash2,
  RefreshCw,
  Cpu,
  Download,
} from 'lucide-react';
import { UserSettings, AuditLog } from '../types';
import { api } from '../lib/api';

interface SettingsViewProps {
  settings: UserSettings;
  auditLogs: AuditLog[];
  gmailStatus: { isConnected: boolean; email: string | null };
  isAdmin?: boolean;
  onSaveSettings: (settings: UserSettings) => Promise<void>;
  onConnectGmail: () => void;
  onDisconnectGmail: () => void;
  onDataReset?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  auditLogs,
  gmailStatus,
  isAdmin = false,
  onSaveSettings,
  onConnectGmail,
  onDisconnectGmail,
  onDataReset,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetData = async () => {
    const confirmation = window.confirm(
      'WARNING: This will completely wipe all contacts, campaigns, scheduled messages, sent history, responses, templates, documents, and notifications to restore a zero-state fresh installation. Your Gmail integration settings and account configuration will be preserved.\n\nAre you sure you want to proceed?'
    );
    if (!confirmation) return;

    try {
      setIsResetting(true);
      const res = await api.resetSystemData();
      setResetMessage(res.message || 'System data has been completely reset to zero state.');
      if (onDataReset) {
        onDataReset();
      }
    } catch (err: any) {
      alert(`Error resetting data: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const [formData, setFormData] = useState<UserSettings>(() => {
    const s = settings || ({} as Partial<UserSettings>);
    const dailyLimit = s.sendingLimits?.maxEmailsPerDay ?? s.automation?.dailyLimit ?? 5;
    const delaySeconds = s.sendingLimits?.delaySecondsBetweenSends ?? (s.automation?.delayMinutes ? s.automation.delayMinutes * 60 : 600);
    const timezone = s.sendingLimits?.timezone || s.automation?.timezone || 'Asia/Kolkata';
    const sig = s.defaultSignature || s.email?.defaultSignature || '';
    const autoCategorize = s.aiSettings?.autoCategorizeReplies ?? s.ai?.replyClassification ?? true;
    const suggestFollowUp = s.aiSettings?.suggestFollowUpReminders ?? true;

    return {
      profile: {
        name: s.profile?.name || 'Anjan Prajapati',
        title: s.profile?.title || 'Senior Cloud & Systems Engineer',
        email: s.profile?.email || 'anjanp93722@gmail.com',
        phone: s.profile?.phone || '+91 98765 43210',
        linkedin: s.profile?.linkedin || 'https://linkedin.com/in/anjanprajapati',
        github: s.profile?.github || 'https://github.com/anjanprajapati',
        portfolio: s.profile?.portfolio || 'https://anjanprajapati.dev',
        education: s.profile?.education || 'B.Tech in Computer Science and Engineering',
        skills: s.profile?.skills || 'Distributed Systems, Cloud Computing, Kubernetes, TypeScript',
        targetRoles: s.profile?.targetRoles || 'Cloud Engineer, Staff DevOps Engineer',
        targetCountries: s.profile?.targetCountries || 'Ireland, United Kingdom, Netherlands, Germany, United States',
      },
      email: {
        defaultSignature: sig,
      },
      automation: {
        dailyLimit,
        delayMinutes: Math.round(delaySeconds / 60),
        timezone,
        automaticSending: s.automation?.automaticSending ?? true,
        automaticFollowUp: s.automation?.automaticFollowUp ?? true,
      },
      ai: {
        aiAssistance: s.ai?.aiAssistance ?? true,
        personalization: s.ai?.personalization ?? true,
        replyClassification: autoCategorize,
      },
      defaultSignature: sig,
      sendingLimits: {
        maxEmailsPerDay: dailyLimit,
        delaySecondsBetweenSends: delaySeconds,
        timezone,
      },
      aiSettings: {
        autoCategorizeReplies: autoCategorize,
        suggestFollowUpReminders: suggestFollowUp,
      },
    };
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Application Settings & Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure sender identity, daily sending caps, time windows, and audit security logs.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Sender Profile Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.profile.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Professional Title</label>
              <input
                type="text"
                value={formData.profile.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.profile.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium font-mono text-[11px] bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.profile.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, github: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium font-mono text-[11px] bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Sending Safety Limits & Pacing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Sending Limits & Anti-Spam Safeguards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Daily Sending Limit (Emails / Day)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.sendingLimits?.maxEmailsPerDay ?? formData.automation?.dailyLimit ?? 5}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    sendingLimits: {
                      ...formData.sendingLimits,
                      maxEmailsPerDay: val,
                      delaySecondsBetweenSends: formData.sendingLimits?.delaySecondsBetweenSends ?? 600,
                      timezone: formData.sendingLimits?.timezone || 'Asia/Kolkata',
                    },
                    automation: {
                      ...formData.automation,
                      dailyLimit: val,
                    },
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Recommended: 5-15 for high deliverability</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Delay Between Emails (Seconds)
              </label>
              <input
                type="number"
                min={15}
                max={600}
                value={formData.sendingLimits?.delaySecondsBetweenSends ?? 600}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    sendingLimits: {
                      ...formData.sendingLimits,
                      maxEmailsPerDay: formData.sendingLimits?.maxEmailsPerDay ?? 5,
                      delaySecondsBetweenSends: val,
                      timezone: formData.sendingLimits?.timezone || 'Asia/Kolkata',
                    },
                    automation: {
                      ...formData.automation,
                      delayMinutes: Math.round(val / 60),
                    },
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Randomized jitter applied automatically</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
              <input
                type="text"
                readOnly
                value={formData.sendingLimits?.timezone || formData.automation?.timezone || 'Asia/Kolkata'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100/70 font-medium text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Configured to Asia/Kolkata (IST)</span>
            </div>
          </div>
        </div>

        {/* Default Email Signature */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Default Email Signature</span>
          </div>

          <textarea
            rows={4}
            value={formData.defaultSignature ?? formData.email?.defaultSignature ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultSignature: e.target.value,
                email: {
                  ...formData.email,
                  defaultSignature: e.target.value,
                },
              })
            }
            className="w-full p-3.5 font-sans leading-relaxed rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/70"
          />
        </div>

        {/* AI & Automation Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gemini AI Intelligence Settings</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aiSettings?.autoCategorizeReplies ?? formData.ai?.replyClassification ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiSettings: {
                      ...formData.aiSettings,
                      autoCategorizeReplies: e.target.checked,
                      suggestFollowUpReminders: formData.aiSettings?.suggestFollowUpReminders ?? true,
                    },
                    ai: {
                      ...formData.ai,
                      replyClassification: e.target.checked,
                    },
                  })
                }
                className="rounded-md text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Automated Reply Intent Classification
                </span>
                <span className="text-slate-500 text-[11px]">
                  Automatically classify incoming Gmail replies into Interview Requests, Positive, Rejections, etc.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aiSettings?.suggestFollowUpReminders ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiSettings: {
                      ...formData.aiSettings,
                      autoCategorizeReplies: formData.aiSettings?.autoCategorizeReplies ?? true,
                      suggestFollowUpReminders: e.target.checked,
                    },
                  })
                }
                className="rounded-md text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Follow-up Reminder Suggestions
                </span>
                <span className="text-slate-500 text-[11px]">
                  Generate intelligent cadence suggestions based on recruiter company type and history.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Administrator & System Controls */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-5 bg-gradient-to-b from-indigo-50/40 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Administrator Privileges & System Engine</h3>
                <p className="text-xs text-slate-500">
                  Full control over OutreachOS sending engine, system workers, and database state.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
              ADMIN ROLE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Admin Account</div>
              <div className="font-semibold text-slate-800 font-mono text-[11px] truncate">
                {gmailStatus.email || 'anjanp93722@gmail.com'}
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Outreach Engine Limit</div>
              <div className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlimited (No Daily Cap)</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Background Scheduler</div>
              <div className="font-bold text-indigo-600 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Active (15s Polling)</span>
              </div>
            </div>
          </div>

          {resetMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800">Database & System Storage</div>
              <div className="text-[11px] text-slate-500">
                Download a raw JSON database backup or reset all outreach records to start completely fresh.
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/api/db/download"
                download="db.json"
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Download raw db.json file"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download db.json</span>
              </a>
              <button
                type="button"
                onClick={handleResetData}
                disabled={isResetting}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{isResetting ? 'Resetting System Data...' : 'Reset to Zero'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security & Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <History className="w-4 h-4 text-slate-600" />
            <span>Security & Outreach Audit Trail</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Last 15 records</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {auditLogs.slice(0, 15).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mr-2">
                  {log.action}
                </span>
                <span className="text-slate-700 font-medium">{log.details}</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
