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
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Calendar,
  },
  'Meeting Request': {
    label: 'Meeting Request',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Calendar,
  },
  Positive: {
    label: 'Positive / Interested',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: CheckCircle2,
  },
  'Request for Information': {
    label: 'Request for Info',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: HelpCircle,
  },
  'Application Confirmation': {
    label: 'Application Received',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: CheckCircle2,
  },
  Rejection: {
    label: 'Rejection',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: XCircle,
  },
  'Follow-up Required': {
    label: 'Follow-up Required',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  'Automated Reply': {
    label: 'Out of Office / Auto',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  Unclear: {
    label: 'Neutral / Review',
    color: 'bg-slate-50 text-slate-600 border-slate-200',
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Incoming Responses & Reply Monitor</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Gmail inbox matching, automated Gemini classification, and follow-up halting.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
            <MessageSquareReply className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No incoming replies yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
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
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200">
                      {(r.contactName || 'Recipient').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {r.contactName || r.contactEmail}
                        </span>
                        <span className="text-slate-400 font-mono text-xs">&lt;{r.contactEmail}&gt;</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{r.organization || 'Target Organization'}</span>
                        {r.campaignName && (
                          <>
                            <span>&bull;</span>
                            <span className="text-indigo-600 font-medium">Campaign: {r.campaignName}</span>
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
                      className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium cursor-pointer"
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
                  <div className="font-semibold text-slate-800 text-xs">{r.subject}</div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 font-sans">
                    {r.snippet || r.bodyText}
                  </p>
                </div>

                {/* Classification Explanation & Matched Outreach */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
                  <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>AI Reasoning: {r.classificationReason || 'Analyzed intent from reply body.'}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedResponse(r);
                        setGeneratedDraft(null);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Email Response Inspector</h3>
                <span className="text-xs text-slate-500">
                  Received from {selectedResponse.contactName} &bull; {selectedResponse.contactEmail}
                </span>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Matched Original Outreach Snippet */}
            {selectedResponse.originalOutreachSnippet && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  Original Sent Outreach (Matched Thread):
                </span>
                <p className="text-slate-600 italic line-clamp-3">
                  "{selectedResponse.originalOutreachSnippet}..."
                </p>
              </div>
            )}

            {/* Incoming Reply Full Text */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800">
                Incoming Reply: "{selectedResponse.subject}"
              </span>
              <div className="p-4 bg-white border border-slate-200 rounded-xl whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed max-h-56 overflow-y-auto">
                {selectedResponse.bodyText || selectedResponse.snippet}
              </div>
            </div>

            {/* AI Assistant Generate Draft */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-950">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
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
                  <div className="p-3.5 bg-white border border-indigo-200 rounded-xl text-xs font-sans text-slate-800 whitespace-pre-wrap">
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

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
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
