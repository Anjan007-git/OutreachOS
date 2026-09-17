import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Trash2,
  Eye,
  Send,
  X,
  RefreshCw,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ScheduledMessage } from '../types';

interface ScheduledViewProps {
  messages: ScheduledMessage[];
  onApproveMessage: (id: string) => Promise<void>;
  onCancelMessage: (id: string) => Promise<void>;
  onSendNow: (msg: ScheduledMessage) => Promise<void>;
  onRetryMessage?: (id: string) => Promise<void>;
}

export const ScheduledView: React.FC<ScheduledViewProps> = ({
  messages,
  onApproveMessage,
  onCancelMessage,
  onSendNow,
  onRetryMessage,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [inspectMessage, setInspectMessage] = useState<ScheduledMessage | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === 'ALL') return true;
    return m.status === filterStatus;
  });

  const getStatusBadge = (status: ScheduledMessage['status']) => {
    switch (status) {
      case 'QUEUED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-3 h-3 mr-1" />
            Queued
          </span>
        );
      case 'READY_FOR_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Review
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
            Draft
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Sent
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 line-through">
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Outbound Queue & Scheduled Messages</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Server-side scheduled outreach queue adhering to daily rate limits and Asia/Kolkata timezone windows.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Statuses ({messages.length})</option>
            <option value="QUEUED">Queued for Send</option>
            <option value="READY_FOR_REVIEW">Ready for Review</option>
            <option value="DRAFT">Drafts</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-850 text-slate-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Subject & Campaign</th>
                <th className="py-3.5 px-4">Scheduled For (IST)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Retries</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                    <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-zinc-300">No scheduled messages found</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                      Compose a message or schedule a campaign to populate the outbound queue.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{m.recipientName}</div>
                      <div className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">{m.recipientEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{m.subject}</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                        {m.campaignName || 'Individual Outreach'} &bull;{' '}
                        {m.attachments?.length ? `${m.attachments.length} attachments` : 'No files'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 font-medium whitespace-nowrap">
                      {new Date(m.scheduledTime).toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">IST</span>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(m.status)}</td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 font-mono">
                      {m.retryCount || 0}
                      {m.error && (
                        <span className="block text-[10px] text-rose-600 dark:text-rose-400 truncate max-w-[140px]" title={m.error}>
                          {m.error}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setInspectMessage(m)}
                          title="View Message Details"
                          className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {(m.status === 'DRAFT' || m.status === 'READY_FOR_REVIEW') && (
                          <button
                            onClick={async () => {
                              setLoadingId(m.id);
                              await onApproveMessage(m.id);
                              setLoadingId(null);
                            }}
                            disabled={loadingId === m.id}
                            title="Approve & Schedule"
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {m.status === 'QUEUED' && (
                          <button
                            onClick={async () => {
                              setLoadingId(m.id);
                              await onSendNow(m);
                              setLoadingId(null);
                            }}
                            disabled={loadingId === m.id}
                            title="Send Immediately via Gmail"
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Now</span>
                          </button>
                        )}

                        {m.status === 'FAILED' && onRetryMessage && (
                          <button
                            onClick={async () => {
                              setLoadingId(m.id);
                              await onRetryMessage(m.id);
                              setLoadingId(null);
                            }}
                            disabled={loadingId === m.id}
                            title="Retry Sending via Gmail"
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <RefreshCw className={`w-3 h-3 ${loadingId === m.id ? 'animate-spin' : ''}`} />
                            <span>Retry</span>
                          </button>
                        )}

                        {m.status !== 'SENT' && m.status !== 'CANCELLED' && (
                          <button
                            onClick={async () => {
                              if (confirm('Cancel this scheduled message?')) {
                                await onCancelMessage(m.id);
                              }
                            }}
                            title="Cancel Message"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Inspection Drawer/Modal */}
      {inspectMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-zinc-850 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Message Details</h3>
                <span className="text-xs text-slate-500 dark:text-zinc-400">ID: {inspectMessage.id}</span>
              </div>
              <button
                onClick={() => setInspectMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-1.5">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500">To: </span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">
                    {inspectMessage.recipientName} &lt;{inspectMessage.recipientEmail}&gt;
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500">Subject: </span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{inspectMessage.subject}</span>
                </div>
                <div className="flex items-center space-x-2 pt-0.5">
                  <span className="text-slate-400 dark:text-zinc-500">Status: </span>
                  {getStatusBadge(inspectMessage.status)}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Body Content:</span>
                <div className="p-4 bg-slate-50/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl whitespace-pre-wrap font-sans text-slate-800 dark:text-zinc-200 leading-relaxed max-h-60 overflow-y-auto">
                  {inspectMessage.messageBody}
                </div>
              </div>

              {inspectMessage.attachments?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Attached Files:</span>
                  <div className="flex flex-wrap gap-2">
                    {inspectMessage.attachments.map((a, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-700 dark:text-zinc-300 font-medium text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1 text-slate-500 dark:text-zinc-400" />
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setInspectMessage(null)}
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
