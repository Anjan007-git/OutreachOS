import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Trash2,
  RefreshCw,
  Sliders,
  HelpCircle,
  FolderOpen,
  Calendar,
  X,
  User,
  Building,
} from 'lucide-react';
import { Contact, Campaign, Template, StoredFile, AttachmentRef } from '../types';
import { COMMON_VARIABLES, interpolateVariables } from '../lib/variables.js';

interface ComposeViewProps {
  contacts: Contact[];
  campaigns: Campaign[];
  templates: Template[];
  files: StoredFile[];
  preselectedContact?: Contact | null;
  preselectedCampaign?: Campaign | null;
  initialDraft?: { subject?: string; body?: string } | null;
  onSendMessage: (payload: {
    recipientId?: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    messageBody: string;
    attachments?: AttachmentRef[];
    campaignId?: string;
    campaignName?: string;
    scheduledTime?: string;
    approvalAction: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVE_AND_SCHEDULE';
  }) => Promise<void>;
  onSendNow: (payload: {
    recipientId?: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    messageBody: string;
    attachments?: AttachmentRef[];
    campaignId?: string;
    campaignName?: string;
    forceSendAgain?: boolean;
  }) => Promise<void>;
  onAiImprove: (content: string, instruction: string, contactContext?: any) => Promise<string>;
  onAiSubject: (content: string, role?: string, organization?: string) => Promise<string[]>;
  onAiPersonalize: (template: string, contact: Contact) => Promise<string>;
  onAiSummarizeJD: (jdText: string) => Promise<{ keyRequirements: string[]; recommendedAngle: string }>;
}

export const ComposeView: React.FC<ComposeViewProps> = ({
  contacts,
  campaigns,
  templates,
  files,
  preselectedContact,
  preselectedCampaign,
  initialDraft,
  onSendMessage,
  onSendNow,
  onAiImprove,
  onAiSubject,
  onAiPersonalize,
  onAiSummarizeJD,
}) => {
  // Selected recipient & campaign
  const [selectedContactId, setSelectedContactId] = useState<string>(preselectedContact?.id || '');
  const [customEmail, setCustomEmail] = useState(preselectedContact?.email || '');
  const [customName, setCustomName] = useState(preselectedContact?.name || '');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(preselectedCampaign?.id || '');

  // Message fields
  const [subject, setSubject] = useState(initialDraft?.subject || '');
  const [messageBody, setMessageBody] = useState(initialDraft?.body || '');
  const [selectedAttachments, setSelectedAttachments] = useState<AttachmentRef[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)
  );

  // View & AI states
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSubjects, setAiSubjects] = useState<string[]>([]);
  const [showAiToolbar, setShowAiToolbar] = useState(false);
  const [showJdModal, setShowJdModal] = useState(false);
  const [jdInput, setJdInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Current active contact object
  const activeContact = contacts.find((c) => c.id === selectedContactId) || preselectedContact || null;
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || preselectedCampaign || null;

  // When preselected props change
  useEffect(() => {
    if (preselectedContact) {
      setSelectedContactId(preselectedContact.id);
      setCustomEmail(preselectedContact.email);
      setCustomName(preselectedContact.name);
    }
  }, [preselectedContact]);

  useEffect(() => {
    if (preselectedCampaign) {
      setSelectedCampaignId(preselectedCampaign.id);
    }
  }, [preselectedCampaign]);

  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.subject) setSubject(initialDraft.subject);
      if (initialDraft.body) setMessageBody(initialDraft.body);
    }
  }, [initialDraft]);

  // Insert template
  const handleSelectTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    setSubject(tpl.subject);
    setMessageBody(tpl.body);
  };

  // Variable replacement logic
  const renderPreviewText = (text?: string) => {
    if (!text) return '';
    return interpolateVariables(
      text,
      {
        contact: activeContact,
        customName,
        customEmail,
      },
      false
    );
  };

  const handleInsertVariable = (varKey: string) => {
    setMessageBody((prev) => {
      if (!prev) return varKey;
      const needsSpace = !prev.endsWith(' ') && !prev.endsWith('\n');
      return prev + (needsSpace ? ' ' : '') + varKey;
    });
  };

  // AI Actions
  const handleRunAiImprove = async (instruction: string) => {
    if (!messageBody.trim()) {
      alert('Please enter a draft message first');
      return;
    }
    setIsAiLoading(true);
    setStatusFeedback(null);
    try {
      const improved = await onAiImprove(messageBody, instruction, activeContact);
      setMessageBody(improved);
      setStatusFeedback({ type: 'success', text: `Message updated (${instruction})` });
    } catch (err: any) {
      setStatusFeedback({ type: 'error', text: err.message || 'AI request failed' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateAiSubjects = async () => {
    if (!messageBody.trim() && !subject.trim()) {
      alert('Please provide some context or message body first');
      return;
    }
    setIsAiLoading(true);
    try {
      const suggestions = await onAiSubject(
        messageBody || subject,
        activeContact?.role,
        activeContact?.organization
      );
      setAiSubjects(suggestions);
    } catch (err: any) {
      alert('Failed to generate subject lines: ' + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTailorForContact = async () => {
    if (!activeContact) {
      alert('Please select a recipient contact to tailor the message.');
      return;
    }
    setIsAiLoading(true);
    try {
      const tailored = await onAiPersonalize(messageBody, activeContact);
      setMessageBody(tailored);
      setStatusFeedback({
        type: 'success',
        text: `Personalized email for ${activeContact.name} at ${activeContact.organization}`,
      });
    } catch (err: any) {
      setStatusFeedback({ type: 'error', text: err.message || 'Personalization failed' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleJdAnalysis = async () => {
    if (!jdInput.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await onAiSummarizeJD(jdInput);
      setShowJdModal(false);
      // Auto-tailor body with angle
      const tailoredInstruction = `Emphasize these key requirements from the job description: ${result.keyRequirements.join(
        ', '
      )}. Angle: ${result.recommendedAngle}`;
      const improved = await onAiImprove(messageBody, tailoredInstruction, activeContact);
      setMessageBody(improved);
      setStatusFeedback({ type: 'success', text: 'Tailored message with key JD requirements.' });
    } catch (err: any) {
      alert('JD analysis failed: ' + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit Handlers
  const handleSaveApprovalWorkflow = async (
    action: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVE_AND_SCHEDULE'
  ) => {
    const finalEmail = activeContact?.email || customEmail;
    if (!finalEmail) {
      alert('Please provide a recipient email.');
      return;
    }
    if (!subject.trim() || !messageBody.trim()) {
      alert('Please provide a subject line and email body.');
      return;
    }

    setIsSending(true);
    setStatusFeedback(null);
    try {
      await onSendMessage({
        recipientId: activeContact?.id || 'custom',
        recipientEmail: finalEmail,
        recipientName: activeContact?.name || customName || finalEmail,
        subject: renderPreviewText(subject),
        messageBody: renderPreviewText(messageBody),
        attachments: selectedAttachments,
        campaignId: activeCampaign?.id,
        campaignName: activeCampaign?.name,
        scheduledTime:
          action === 'APPROVE_AND_SCHEDULE' ? new Date(scheduledDate).toISOString() : undefined,
        approvalAction: action,
      });

      setStatusFeedback({
        type: 'success',
        text:
          action === 'APPROVE_AND_SCHEDULE'
            ? 'Approved & Queued in Outbound Scheduler'
            : action === 'READY_FOR_REVIEW'
            ? 'Saved & Marked as Ready for Review'
            : 'Saved as Draft',
      });
    } catch (err: any) {
      setStatusFeedback({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSending(false);
    }
  };

  const handleTriggerSendNow = async () => {
    const finalEmail = activeContact?.email || customEmail;
    if (!finalEmail) {
      alert('Please provide a recipient email.');
      return;
    }
    if (!subject.trim() || !messageBody.trim()) {
      alert('Please provide a subject line and email body.');
      return;
    }

    if (!confirm(`Send email to ${finalEmail} immediately via connected Gmail account?`)) {
      return;
    }

    setIsSending(true);
    setStatusFeedback(null);
    try {
      await onSendNow({
        recipientId: activeContact?.id || 'custom',
        recipientEmail: finalEmail,
        recipientName: activeContact?.name || customName || finalEmail,
        subject: renderPreviewText(subject),
        messageBody: renderPreviewText(messageBody),
        attachments: selectedAttachments,
        campaignId: activeCampaign?.id,
        campaignName: activeCampaign?.name,
      });

      setStatusFeedback({
        type: 'success',
        text: `Email successfully delivered to ${finalEmail} via Gmail API!`,
      });
    } catch (err: any) {
      setStatusFeedback({ type: 'error', text: err.message || 'Send failed' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Email Composer & Review</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Write, personalize with AI, attach documents, and route through the user approval workflow.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Preview Mode Toggle */}
          <button
            id="btn-toggle-preview-mode"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-colors cursor-pointer ${
              isPreviewMode
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview Variables'}</span>
          </button>
        </div>
      </div>

      {statusFeedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            statusFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusFeedback.text}</span>
          </div>
          <button onClick={() => setStatusFeedback(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Composer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            {/* Recipient & Campaign Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Contact
                </label>
                <select
                  id="select-compose-recipient"
                  value={selectedContactId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setSelectedContactId(cid);
                    const found = contacts.find((c) => c.id === cid);
                    if (found) {
                      setCustomEmail(found.email);
                      setCustomName(found.name);
                    }
                  }}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 font-medium text-slate-800 cursor-pointer"
                >
                  <option value="">-- Manual Recipient --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.organization} ({c.role || c.organizationType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign to Campaign (Optional)
                </label>
                <select
                  id="select-compose-campaign"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 font-medium text-slate-800 cursor-pointer"
                >
                  <option value="">-- No Campaign (One-off Outreach) --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({String(c.type || 'OUTREACH').replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual email/name inputs if no contact selected */}
            {!selectedContactId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email *</label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="recruiter@targetcompany.com"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            {/* Subject Line Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Subject Line *</label>
                <button
                  type="button"
                  onClick={handleGenerateAiSubjects}
                  disabled={isAiLoading}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Suggest AI Subjects</span>
                </button>
              </div>
              <input
                id="input-compose-subject"
                type="text"
                required
                value={isPreviewMode ? renderPreviewText(subject) : subject}
                readOnly={isPreviewMode}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Experienced Cloud Architect — Inquiry regarding {{role}} at {{organization}}"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium ${
                  isPreviewMode ? 'bg-slate-50 text-slate-800' : 'bg-slate-50/50'
                }`}
              />

              {/* AI Subject Suggestions */}
              {aiSubjects.length > 0 && (
                <div className="mt-2.5 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                    Select AI Suggested Subject:
                  </span>
                  {aiSubjects.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSubject(s);
                        setAiSubjects([]);
                      }}
                      className="text-xs p-2 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-800 cursor-pointer font-medium transition-colors shadow-2xs"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Assistant Toolbar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gemini Assistant Tools</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJdModal(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Analyze Job Description
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleRunAiImprove('Make it more professional, confident, and persuasive')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  Professional Tone
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAiImprove('Make it concise, punchy, and under 150 words')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  Make Concise
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAiImprove('Fix any grammar or punctuation mistakes while keeping my style')}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  Fix Grammar
                </button>
                <button
                  type="button"
                  onClick={handleTailorForContact}
                  disabled={isAiLoading || !activeContact}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  Personalize for {activeContact ? activeContact.organization : 'Recipient'}
                </button>
              </div>

              {isAiLoading && (
                <div className="flex items-center space-x-2 text-xs text-indigo-600 pt-1 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini is refining your message...</span>
                </div>
              )}
            </div>

            {/* Message Body Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Message Body *</label>
                <span className="text-[11px] text-slate-400">
                  {messageBody.length} characters &bull; {messageBody.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Variable Quick Insert Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 text-[11px] text-slate-500 scrollbar-thin">
                <span className="font-semibold text-slate-600 shrink-0 text-[10px] uppercase tracking-wider">
                  Insert Tag:
                </span>
                {COMMON_VARIABLES.slice(0, 6).map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => handleInsertVariable(v.key)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md font-mono text-[10px] text-slate-700 transition-colors cursor-pointer shrink-0"
                    title={`Insert ${v.label} (e.g. ${v.example})`}
                  >
                    {v.key}
                  </button>
                ))}
              </div>

              <textarea
                id="textarea-compose-body"
                rows={12}
                required
                value={isPreviewMode ? renderPreviewText(messageBody) : messageBody}
                readOnly={isPreviewMode}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={`Dear {{first_name}},\n\nI hope this email finds you well.\n\nI am writing to express my strong interest in joining {{organization}} as a {{role}}...\n\nBest regards,\n{{my_name}}`}
                className={`w-full text-xs p-3.5 font-sans leading-relaxed rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  isPreviewMode ? 'bg-slate-50 text-slate-800' : 'bg-slate-50/50'
                }`}
              />
            </div>

            {/* Selected Attachments Display */}
            {selectedAttachments.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Attached Documents ({selectedAttachments.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAttachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span>{att.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAttachments(selectedAttachments.filter((_, i) => i !== idx))
                        }
                        className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Workflow Actions & Templates & Attachments */}
        <div className="space-y-6">
          {/* Approval Workflow Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Outreach Approval Workflow
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Emails require explicit user approval before entering the sending queue.
              </p>
            </div>

            {/* Schedule Time Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Schedule For (Asia/Kolkata):</span>
              </label>
              <input
                id="input-schedule-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <button
                id="btn-approve-and-schedule"
                type="button"
                onClick={() => handleSaveApprovalWorkflow('APPROVE_AND_SCHEDULE')}
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Approve & Queue for Schedule</span>
              </button>

              <button
                id="btn-trigger-send-now"
                type="button"
                onClick={handleTriggerSendNow}
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>Send Immediately (Gmail API)</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="btn-mark-ready-review"
                  type="button"
                  onClick={() => handleSaveApprovalWorkflow('READY_FOR_REVIEW')}
                  disabled={isSending}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Ready for Review
                </button>
                <button
                  id="btn-save-draft"
                  type="button"
                  onClick={() => handleSaveApprovalWorkflow('DRAFT')}
                  disabled={isSending}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Load Outreach Template
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                    {tpl.title || tpl.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{tpl.subject}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Attach Documents Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Attach Documents
            </span>
            <p className="text-xs text-slate-500">
              Select verified PDF/DOC documents from your repository:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file) => {
                const isSelected = selectedAttachments.some((a) => a.fileId === file.id);
                return (
                  <label
                    key={file.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAttachments([
                              ...selectedAttachments,
                              {
                                name: file.name,
                                fileId: file.id,
                                driveFileId: file.driveFileId,
                                mimeType: file.mimeType,
                              },
                            ]);
                          } else {
                            setSelectedAttachments(
                              selectedAttachments.filter((a) => a.fileId !== file.id)
                            );
                          }
                        }}
                        className="rounded-md text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{file.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">{file.category}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Analyzer Modal */}
      {showJdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Analyze Job Description</h3>
              </div>
              <button onClick={() => setShowJdModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Paste the target job description or requirements. Gemini will extract key skills and adapt
              your message angle accordingly.
            </p>

            <textarea
              rows={8}
              value={jdInput}
              onChange={(e) => setJdInput(e.target.value)}
              placeholder="Paste job description text here..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
            />

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowJdModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJdAnalysis}
                disabled={!jdInput.trim() || isAiLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extract Angle & Polish Body</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
