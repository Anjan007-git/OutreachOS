import React, { useState } from 'react';
import {
  MessageSquareReply,
  RefreshCw,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  Calendar,
  Eye,
  X,
  Building,
  User,
} from 'lucide-react';
import { IncomingMessage, ReplyClassification } from '../types';

interface ResponsesViewProps {
  responses: IncomingMessage[];
  onSyncReplies: () => Promise<void>;
  onUpdateStatus: (id: string, status: 'PENDING' | 'DRAFTED' | 'SENT' | 'IGNORED') => Promise<void>;
  onDraftAiResponse: (incoming: IncomingMessage) => Promise<string>;
  onReplyToMessage: (incoming: IncomingMessage, initialDraft?: string) => void;
  isSyncing: boolean;
}

const classificationBadgeConfig: Record<
  ReplyClassification,
  { label: string; color: string; icon: React.FC<{ className?: string }> }
> = {
  'Interview Request': {
    label: 'Interview Request',
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: Calendar,
  },
  'Meeting Request': {
    label: 'Meeting Request',
    color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: Calendar,
  },
  Positive: {
    label: 'Positive / Interested',
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    icon: CheckCircle2,
  },
  'Request for Information': {
    label: 'Request for Info',
    color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    icon: HelpCircle,
  },
  'Application Confirmation': {
    label: 'Application Received',
    color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    icon: CheckCircle2,
  },
  Rejection: {
    label: 'Rejection',
    color: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
    icon: XCircle,
  },
  'Follow-up Required': {
    label: 'Follow-up Required',
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  'Automated Reply': {
    label: 'Out of Office / Auto',
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  Unclear: {
    label: 'Neutral / Review',
    color: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
    icon: HelpCircle,
  },
};

export const ResponsesView: React.FC<ResponsesViewProps> = ({
  responses,
  onSyncReplies,
  onUpdateStatus,
  onDraftAiResponse,
  onReplyToMessage,
  isSyncing,
}) => {
  const [selectedResponse, setSelectedResponse] = useState<IncomingMessage | null>(null);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filtered = responses.filter((r) => {
    if (filterClass === 'ALL') return true;
    return r.classification === filterClass;
  });

  const handleGenerateDraft = async (incoming: IncomingMessage) => {
    setAiDraftLoading(true);
    try {
      const draft = await onDraftAiResponse(incoming);
      setGeneratedDraft(draft);
    } catch (err: any) {
      alert('Failed to generate response draft: ' + err.message);
    } finally {
      setAiDraftLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Incoming Responses & Reply Monitor</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time Gmail inbox matching, automated Gemini classification, and follow-up halting.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Categories ({responses.length})</option>
            <option value="Interview Request">Interview Requests</option>
            <option value="Meeting Request">Meeting Requests</option>
            <option value="Positive">Positive / Interested</option>
            <option value="Request for Information">Request for Info</option>
            <option value="Rejection">Rejections</option>
            <option value="Automated Reply">Automated / OOO</option>
          </select>

          <button
            id="btn-sync-replies-view"
            onClick={onSyncReplies}
            disabled={isSyncing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Gmail Now'}</span>
          </button>
        </div>
      </div>

      {/* Response Cards / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-12 text-center text-slate-400 dark:text-zinc-500 shadow-sm">
            <MessageSquareReply className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-zinc-300">No incoming replies yet</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-md mx-auto">
              Replies from recruiters and university contacts to your outreach will be detected and classified here.
            </p>
          </div>
        ) : (
          filtered.map((r) => {
            const config =
              (r.classification && classificationBadgeConfig[r.classification]) ||
              classificationBadgeConfig.Unclear;
            const Icon = config.icon;

            return (
              <div
                key={r.id}
                className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300 text-xs border border-slate-200 dark:border-zinc-800">
                      {(r.contactName || 'Recipient').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {r.contactName || r.contactEmail}
                        </span>
                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">&lt;{r.contactEmail}&gt;</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center space-x-2 mt-0.5">
                        <span>{r.organization || 'Target Organization'}</span>
                        {r.campaignName && (
                          <>
                            <span>&bull;</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Campaign: {r.campaignName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Classification badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.color}`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1" />
                      <span>{config.label}</span>
                    </span>

                    {/* Status badge */}
                    <select
                      value={r.userResponseStatus}
                      onChange={(e) =>
                        onUpdateStatus(
                          r.id,
                          e.target.value as 'PENDING' | 'DRAFTED' | 'SENT' | 'IGNORED'
                        )
                      }
                      className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 font-medium cursor-pointer"
                    >
                      <option value="PENDING">Pending Reply</option>
                      <option value="DRAFTED">Drafted</option>
                      <option value="SENT">Replied / Sent</option>
                      <option value="IGNORED">Ignored</option>
                    </select>
                  </div>
                </div>

                {/* Subject & Snippet */}
                <div className="space-y-1.5 mb-3.5">
                  <div className="font-semibold text-slate-800 dark:text-zinc-100 text-xs">{r.subject}</div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 bg-slate-50/80 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-850 font-sans">
                    {r.snippet || r.bodyText}
                  </p>
                </div>

                {/* Classification Explanation & Matched Outreach */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-3 border-t border-slate-100 dark:border-zinc-850 gap-2">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-zinc-400 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>AI Reasoning: {r.classificationReason || 'Analyzed intent from reply body.'}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedResponse(r);
                        setGeneratedDraft(null);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Thread</span>
                    </button>

                    <button
                      onClick={() => onReplyToMessage(r)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Response & AI Draft Inspection Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-zinc-850 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-850">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Email Response Inspector</h3>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Received from {selectedResponse.contactName} &bull; {selectedResponse.contactEmail}
                </span>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Matched Original Outreach Snippet */}
            {selectedResponse.originalOutreachSnippet && (
              <div className="bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                  Original Sent Outreach (Matched Thread):
                </span>
                <p className="text-slate-600 dark:text-zinc-400 italic line-clamp-3">
                  "{selectedResponse.originalOutreachSnippet}..."
                </p>
              </div>
            )}

            {/* Incoming Reply Full Text */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                Incoming Reply: "{selectedResponse.subject}"
              </span>
              <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-zinc-100 leading-relaxed max-h-56 overflow-y-auto">
                {selectedResponse.bodyText || selectedResponse.snippet}
              </div>
            </div>

            {/* AI Assistant Generate Draft */}
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Gemini Suggested Response</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerateDraft(selectedResponse)}
                  disabled={aiDraftLoading}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiDraftLoading ? 'Drafting...' : 'Generate AI Draft'}</span>
                </button>
              </div>

              {generatedDraft && (
                <div className="space-y-2">
                  <div className="p-3.5 bg-white dark:bg-black border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-sans text-slate-800 dark:text-zinc-100 whitespace-pre-wrap">
                    {generatedDraft}
                  </div>
                  <button
                    onClick={() => {
                      const initialDraft = generatedDraft;
                      setSelectedResponse(null);
                      onReplyToMessage(selectedResponse, initialDraft);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Insert into Email Composer & Reply</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-850 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
