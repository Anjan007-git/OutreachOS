import React, { useState } from 'react';
import {
  CheckCheck,
  Search,
  Eye,
  Send,
  MessageSquareReply,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { SentMessage } from '../types';

interface SentViewProps {
  sentMessages: SentMessage[];
  onComposeFollowUp: (sent: SentMessage) => void;
  onSendAgain: (sent: SentMessage) => void;
}

export const SentView: React.FC<SentViewProps> = ({
  sentMessages,
  onComposeFollowUp,
  onSendAgain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);

  const filtered = sentMessages.filter(
    (m) =>
      m.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.campaignName && m.campaignName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sent Outreach Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all emails successfully sent through your authorized Gmail account.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sent emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Sent Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Subject & Campaign</th>
                <th className="py-3.5 px-4">Sent Time (IST)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Gmail Identifiers</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No sent messages found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Emails sent directly or via the outbound scheduler will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.recipientName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{s.recipientEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{s.subject}</div>
                      <div className="text-[11px] text-slate-400">
                        {s.campaignName || 'One-off Message'} &bull;{' '}
                        {s.attachments?.length ? `${s.attachments.length} files` : 'No attachments'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {new Date(s.sentAt).toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      <span className="text-[10px] text-slate-400">IST</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'REPLIED'
                            ? 'bg-purple-100 text-purple-700'
                            : s.status === 'BOUNCED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {s.status === 'REPLIED' ? (
                          <>
                            <MessageSquareReply className="w-3 h-3 mr-1" />
                            Replied
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Delivered
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                      <div>Msg: {s.gmailMessageId?.slice(0, 14)}...</div>
                      <div className="text-slate-400">Thd: {s.gmailThreadId?.slice(0, 14)}...</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedMessage(s)}
                          title="View Message"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onComposeFollowUp(s)}
                          title="Compose Follow-up"
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Follow-up</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sent Email Verification</h3>
                <span className="text-xs text-slate-500 font-mono">
                  Gmail ID: {selectedMessage.gmailMessageId}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div>
                  <span className="text-slate-400">To: </span>
                  <span className="font-bold text-slate-800">
                    {selectedMessage.recipientName} &lt;{selectedMessage.recipientEmail}&gt;
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Subject: </span>
                  <span className="font-bold text-slate-800">{selectedMessage.subject}</span>
                </div>
                <div>
                  <span className="text-slate-400">Sent At: </span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedMessage.sentAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata',
                    })}{' '}
                    IST
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Delivered Email Body:</span>
                <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl whitespace-pre-wrap font-sans text-slate-800 leading-relaxed max-h-64 overflow-y-auto">
                  {selectedMessage.messageBody}
                </div>
              </div>

              {selectedMessage.attachments?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Delivered Attachments:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.attachments.map((a, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1 text-slate-500" />
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  onSendAgain(selectedMessage);
                }}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Send Again (Override Duplicate Protection)</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
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
