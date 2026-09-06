import React from 'react';
import {
  Users,
  Clock,
  Send,
  CheckCheck,
  MessageSquareReply,
  Repeat,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Globe2,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { DashboardStats, IncomingMessage, ScheduledMessage } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  onNavigate: (page: string) => void;
  onSyncReplies: () => void;
  isSyncing: boolean;
  recentResponses?: IncomingMessage[];
  upcomingScheduled?: ScheduledMessage[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onNavigate,
  recentResponses = [],
  upcomingScheduled = [],
}) => {
  const effectiveStats: DashboardStats = stats || {
    totalContacts: 0,
    scheduledCount: upcomingScheduled.length,
    sentToday: 0,
    totalSent: 0,
    repliesCount: recentResponses.length,
    followUpsCount: 0,
    failedCount: 0,
    activeCampaigns: 0,
    replyRatePercentage: 0,
    recentActivities: [],
    sentOverTime: [
      { date: 'Mon', sent: 0, replies: 0 },
      { date: 'Tue', sent: 0, replies: 0 },
      { date: 'Wed', sent: 0, replies: 0 },
      { date: 'Thu', sent: 0, replies: 0 },
      { date: 'Fri', sent: 0, replies: 0 },
      { date: 'Sat', sent: 0, replies: 0 },
      { date: 'Sun', sent: 0, replies: 0 },
    ],
    outreachBreakdown: [],
    topCountries: [],
  };

  // Use genuine incoming responses and upcoming scheduled queue items (no mock/sample fallback)
  const displayResponses = recentResponses.slice(0, 5);
  const displayQueue = upcomingScheduled.slice(0, 4);

  const getClassificationBadge = (classification?: string) => {
    if (!classification) {
      return (
        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
          RECEIVED
        </span>
      );
    }
    const normalized = String(classification).toUpperCase().replace(/\s+/g, '_');
    switch (normalized) {
      case 'INTERVIEW_REQUEST':
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
            INTERVIEW REQUEST
          </span>
        );
      case 'REQUEST_FOR_INFORMATION':
      case 'INFO_REQUEST':
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
            INFO REQUEST
          </span>
        );
      case 'MEETING_REQUEST':
      case 'POSITIVE':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
            FOLLOW-UP REQ
          </span>
        );
      case 'REJECTION':
        return (
          <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
            REJECTION
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
            {String(classification).replace(/_/g, ' ')}
          </span>
        );
    }
  };

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const diffHours = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours <= 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const chartData = (effectiveStats.sentOverTime && effectiveStats.sentOverTime.length > 0)
    ? effectiveStats.sentOverTime
    : [
        { date: 'Mon', sent: 0, replies: 0 },
        { date: 'Tue', sent: 0, replies: 0 },
        { date: 'Wed', sent: 0, replies: 0 },
        { date: 'Thu', sent: 0, replies: 0 },
        { date: 'Fri', sent: 0, replies: 0 },
        { date: 'Sat', sent: 0, replies: 0 },
        { date: 'Sun', sent: 0, replies: 0 },
      ];

  const maxChartSent = Math.max(...chartData.map((d) => Math.max(d.sent, d.replies, 1)), 5);

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards (matching Sleek Interface design grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Contacts */}
        <div
          id="stat-total-contacts"
          onClick={() => onNavigate('contacts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Contacts</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{effectiveStats.totalContacts.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium flex items-center justify-between">
            <span>{effectiveStats.totalContacts > 0 ? `${effectiveStats.totalContacts} saved contacts` : '0 saved contacts'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 2: Active Campaigns */}
        <div
          id="stat-active-campaigns"
          onClick={() => onNavigate('campaigns')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Campaigns</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{effectiveStats.activeCampaigns}</div>
          <div className="text-xs text-indigo-600 mt-2 font-medium flex items-center justify-between">
            <span>{effectiveStats.activeCampaigns > 0 ? `${effectiveStats.activeCampaigns} automated runs` : 'Ready to start'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 3: Reply Rate */}
        <div
          id="stat-replies"
          onClick={() => onNavigate('responses')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Reply Rate</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{effectiveStats.replyRatePercentage}%</div>
          <div className="text-xs text-slate-500 mt-2 font-medium flex items-center justify-between">
            <span>Avg. 3 days response</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 4: Total Sent */}
        <div
          id="stat-total-sent"
          onClick={() => onNavigate('sent')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Sent</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{effectiveStats.totalSent.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium flex items-center justify-between">
            <span>Total outreaches</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Secondary Operational Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('scheduled')}
          className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Outbound Queue</div>
            <div className="text-lg font-bold text-slate-900">{effectiveStats.scheduledCount} queued</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('sent')}
          className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sent Today</div>
            <div className="text-lg font-bold text-slate-900">{effectiveStats.sentToday} emails</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('followups')}
          className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Follow-ups Active</div>
            <div className="text-lg font-bold text-slate-900">{effectiveStats.followUpsCount} cadence</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('scheduled')}
          className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Safety Status</div>
            <div className="text-lg font-bold text-slate-900">
              {effectiveStats.failedCount > 0 ? `${effectiveStats.failedCount} failed` : 'Zero Duplicates'}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${effectiveStats.failedCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            <CheckCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main 2-Column + 1-Column Layout (Matching Sleek Interface Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Responses & Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Responses Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-base">Recent Responses</h2>
              <button
                onClick={() => onNavigate('responses')}
                className="text-indigo-600 text-sm font-medium hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Campaign</th>
                    <th className="px-6 py-3">AI Classification</th>
                    <th className="px-6 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayResponses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        <MessageSquareReply className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-700 text-sm">No incoming responses yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          Incoming recruiter and university replies will appear and be AI-classified here automatically.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayResponses.map((item: any) => {
                      const senderName = item.contactName || item.senderName || item.contactEmail || item.senderEmail || 'Contact';
                      const senderEmail = item.contactEmail || item.senderEmail || '';
                      const campaignTitle = item.campaignName || item.campaignTitle || 'Direct Outreach';
                      const classification = item.classification || item.aiClassification;
                      const receivedTime = item.receivedDate || item.receivedAt;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => onNavigate('responses')}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{senderName}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[180px]">{senderEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">
                            {campaignTitle}
                          </td>
                          <td className="px-6 py-4">
                            {getClassificationBadge(classification)}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 font-medium text-xs">
                            {formatRelativeTime(receivedTime)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outreach & Replies Over Time Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Outreach & Replies Over Time</h2>
                <p className="text-xs text-slate-500">Last 7 days delivery and response metrics</p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span className="text-slate-600 font-medium">Sent</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-purple-500" />
                  <span className="text-slate-600 font-medium">Replies</span>
                </div>
              </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
              {chartData.map((item, idx) => {
                const sentHeight = (item.sent / maxChartSent) * 100;
                const replyHeight = (item.replies / maxChartSent) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      <div
                        style={{ height: `${Math.max(sentHeight, 8)}%` }}
                        className="w-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-t-xs transition-all relative group"
                        title={`${item.date}: ${item.sent} sent`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-10 transition-opacity">
                          {item.sent} sent
                        </span>
                      </div>
                      <div
                        style={{ height: `${Math.max(replyHeight, 6)}%` }}
                        className="w-3.5 bg-purple-500 hover:bg-purple-600 rounded-t-xs transition-all relative group"
                        title={`${item.date}: ${item.replies} replies`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-10 transition-opacity">
                          {item.replies} replied
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Overall reply rate: <strong className="text-purple-600 font-semibold">{effectiveStats.replyRatePercentage}%</strong></span>
              <button
                onClick={() => onNavigate('responses')}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <span>View Response Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Upcoming Queue & Quick Action & Distribution */}
        <div className="space-y-6">
          {/* Upcoming Queue Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-base">Upcoming Queue</h2>
              <button
                onClick={() => onNavigate('scheduled')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {displayQueue.length === 0 ? (
                <div className="py-8 px-4 text-center border border-dashed border-slate-200 rounded-xl">
                  <Clock className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                  <div className="text-xs font-semibold text-slate-700">Outbound queue is clear</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    No scheduled messages waiting for dispatch.
                  </div>
                </div>
              ) : (
                displayQueue.map((item: any, idx: number) => {
                  const isFirst = idx === 0;
                  return (
                    <div
                      key={item.id || idx}
                      className={`relative pl-4 border-l-2 ${isFirst ? 'border-indigo-200' : 'border-slate-100'}`}
                    >
                      <div
                        className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${
                          isFirst ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}
                      />
                      <div className={`text-xs font-bold mb-0.5 ${isFirst ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {item.scheduledFor || 'Scheduled'}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {item.subject || (item.contactName ? `Outreach to ${item.contactName}` : 'Scheduled Outreach')}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {item.recipientText || (item.recipientEmail ? `To: ${item.recipientEmail}` : 'Target Recipient')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Action Callout Box */}
            <div className="bg-indigo-900 rounded-xl p-4 text-white flex flex-col gap-2 shadow-sm">
              <div className="text-xs opacity-75 font-medium">Quick Action</div>
              <button
                onClick={() => onNavigate('campaigns')}
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 text-white transition-all cursor-pointer text-center"
              >
                + Create New Campaign
              </button>
              <button
                onClick={() => onNavigate('compose')}
                className="w-full py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer text-center"
              >
                Write Custom Message
              </button>
            </div>
          </div>

          {/* Outreach Distribution Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Outreach Distribution</h2>
            <p className="text-xs text-slate-500 mb-4">By target category and geography</p>

            {/* Category Breakdown */}
            <div className="space-y-3 mb-5">
              {(effectiveStats.outreachBreakdown || []).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 flex items-center space-x-1.5">
                      {item.name.includes('Job') ? (
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span>{item.name}</span>
                    </span>
                    <span className="font-semibold text-slate-900">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(10, (item.count / (effectiveStats.totalContacts || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Countries */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-2.5">
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Geographies</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(effectiveStats.topCountries || []).map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {c.country}: <strong className="ml-1 text-slate-900">{c.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
