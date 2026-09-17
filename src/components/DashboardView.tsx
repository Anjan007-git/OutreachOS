import React from 'react';
import {
  Clock,
  Send,
  CheckCheck,
  MessageSquareReply,
  Repeat,
  ArrowUpRight,
  Globe2,
  Briefcase,
  GraduationCap,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { DashboardStats, IncomingMessage, ScheduledMessage } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onNavigate: (page: string) => void;
  onSyncReplies: () => void;
  isSyncing: boolean;
  recentResponses?: IncomingMessage[];
  upcomingScheduled?: ScheduledMessage[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  isLoading = false,
  error = null,
  onRetry,
  onNavigate,
  recentResponses = [],
  upcomingScheduled = [],
}) => {
  // If there's an error and no stats available, display clean, actionable error state
  if (error && !stats) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-zinc-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm text-center space-y-4" id="dashboard-error-state">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Unable to Load Dashboard Data</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">{error}</p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // If loading or stats haven't arrived from server yet, display comprehensive skeletons
  if (isLoading || !stats) {
    return (
      <div className="space-y-6" id="dashboard-loading-skeletons">
        {/* Top 4 Primary Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-850 shadow-sm animate-pulse"
            >
              <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md mb-3" />
              <div className="h-8 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md mb-3" />
              <div className="h-3.5 w-32 bg-slate-100 dark:bg-zinc-850 rounded-md" />
            </div>
          ))}
        </div>

        {/* 4 Secondary Operational Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-black px-4 py-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-850 shadow-2xs animate-pulse flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-850" />
            </div>
          ))}
        </div>

        {/* Main Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeletons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table Skeleton */}
            <div className="bg-white dark:bg-black rounded-2xl border border-slate-200/80 dark:border-zinc-850 shadow-sm overflow-hidden animate-pulse p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="h-5 w-36 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-850/60 last:border-0">
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      <div className="h-3 w-48 bg-slate-100 dark:bg-zinc-850 rounded-md" />
                    </div>
                    <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-6 w-24 bg-slate-100 dark:bg-zinc-850 rounded-md" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Skeleton */}
            <div className="bg-white dark:bg-black rounded-2xl border border-slate-200/80 dark:border-zinc-850 shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <div className="h-4 w-44 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                  <div className="h-3 w-56 bg-slate-100 dark:bg-zinc-850 rounded-md" />
                </div>
                <div className="flex gap-4">
                  <div className="h-3 w-12 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                  <div className="h-3 w-12 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                </div>
              </div>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-zinc-850 pb-2">
                {[40, 65, 30, 80, 50, 70, 90].map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      <div style={{ height: `${h}%` }} className="w-3.5 bg-slate-200 dark:bg-zinc-800 rounded-t-xs" />
                      <div style={{ height: `${Math.max(15, h - 25)}%` }} className="w-3.5 bg-slate-100 dark:bg-zinc-850 rounded-t-xs" />
                    </div>
                    <div className="h-2.5 w-6 bg-slate-200 dark:bg-zinc-800 rounded-xs" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeletons */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-black rounded-2xl border border-slate-200/80 dark:border-zinc-850 shadow-sm p-6 animate-pulse space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((q) => (
                  <div key={q} className="pl-4 border-l-2 border-slate-200 dark:border-zinc-800 space-y-1.5">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-4 w-36 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-3 w-28 bg-slate-100 dark:bg-zinc-850 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-2xl border border-slate-200/80 dark:border-zinc-850 shadow-sm p-6 animate-pulse space-y-4">
              <div className="h-4 w-36 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-zinc-850 rounded-md mb-2" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-3 w-8 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-850 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loaded real-time calculated metrics directly from server-side JOIN
  const effectiveStats = stats;
  const displayResponses = recentResponses.slice(0, 5);
  const displayQueue = upcomingScheduled.slice(0, 4);

  const getClassificationBadge = (classification?: string) => {
    if (!classification) {
      return (
        <span className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
          RECEIVED
        </span>
      );
    }
    const normalized = String(classification).toUpperCase().replace(/\s+/g, '_');
    switch (normalized) {
      case 'INTERVIEW_REQUEST':
        return (
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
            INTERVIEW REQUEST
          </span>
        );
      case 'REQUEST_FOR_INFORMATION':
      case 'INFO_REQUEST':
        return (
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
            INFO REQUEST
          </span>
        );
      case 'MEETING_REQUEST':
      case 'POSITIVE':
        return (
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
            FOLLOW-UP REQ
          </span>
        );
      case 'REJECTION':
        return (
          <span className="px-2 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
            REJECTION
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
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
    <div className="space-y-6" id="dashboard-realtime-view">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Contacts */}
        <div
          id="stat-total-contacts"
          onClick={() => onNavigate('contacts')}
          className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Contacts</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{effectiveStats.totalContacts.toLocaleString()}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-2 font-medium flex items-center justify-between">
            <span>{effectiveStats.totalContacts > 0 ? `${effectiveStats.totalContacts} saved contacts` : '0 saved contacts'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </div>
        </div>

        {/* Card 2: Active Campaigns */}
        <div
          id="stat-active-campaigns"
          onClick={() => onNavigate('campaigns')}
          className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Active Campaigns</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{effectiveStats.activeCampaigns}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium flex items-center justify-between">
            <span>{effectiveStats.activeCampaigns > 0 ? `${effectiveStats.activeCampaigns} automated runs` : 'Ready to start'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
          </div>
        </div>

        {/* Card 3: Reply Rate */}
        <div
          id="stat-replies"
          onClick={() => onNavigate('responses')}
          className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Reply Rate</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{effectiveStats.replyRatePercentage}%</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-2 font-medium flex items-center justify-between">
            <span>{effectiveStats.repliesCount} total replies</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </div>
        </div>

        {/* Card 4: Total Sent */}
        <div
          id="stat-total-sent"
          onClick={() => onNavigate('sent')}
          className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Sent</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{effectiveStats.totalSent.toLocaleString()}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-2 font-medium flex items-center justify-between">
            <span>Real-time from database</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </div>
        </div>
      </div>

      {/* Secondary Operational Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          id="op-outbound-queue"
          onClick={() => onNavigate('scheduled')}
          className="bg-white dark:bg-black px-4 py-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-850 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Outbound Queue</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{effectiveStats.scheduledCount} queued</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div
          id="op-sent-today"
          onClick={() => onNavigate('sent')}
          className="bg-white dark:bg-black px-4 py-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-850 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Sent Today</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{effectiveStats.sentToday} emails</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div
          id="op-followups-active"
          onClick={() => onNavigate('followups')}
          className="bg-white dark:bg-black px-4 py-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-850 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Follow-ups Active</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{effectiveStats.followUpsCount} cadence</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
        </div>

        <div
          id="op-safety-status"
          onClick={() => onNavigate('scheduled')}
          className="bg-white dark:bg-black px-4 py-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-850 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Safety Status</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {effectiveStats.failedCount > 0 ? `${effectiveStats.failedCount} failed` : 'Zero Duplicates'}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${effectiveStats.failedCount > 0 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-zinc-850 text-slate-600 dark:text-zinc-300'}`}>
            <CheckCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main 2-Column + 1-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Responses & Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Responses Card */}
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-zinc-100 text-base">Recent Responses</h2>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Aggregated incoming replies and AI classifications</p>
              </div>
              <button
                onClick={() => onNavigate('responses')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-zinc-950 text-[11px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Campaign</th>
                    <th className="px-6 py-3">AI Classification</th>
                    <th className="px-6 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 text-sm">
                  {displayResponses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                        <MessageSquareReply className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
                        <p className="font-semibold text-slate-700 dark:text-zinc-300 text-sm">No incoming responses yet</p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
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
                          className="hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 dark:text-zinc-200">{senderName}</div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[180px]">{senderEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-zinc-300 font-medium">
                            {campaignTitle}
                          </td>
                          <td className="px-6 py-4">
                            {getClassificationBadge(classification)}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 dark:text-zinc-400 font-medium text-xs">
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
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Outreach & Replies Over Time</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Last 7 days delivery and response metrics calculated in real-time</p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span className="text-slate-600 dark:text-zinc-300 font-medium">Sent</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-purple-500" />
                  <span className="text-slate-600 dark:text-zinc-300 font-medium">Replies</span>
                </div>
              </div>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-zinc-850 pb-2">
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
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-zinc-900 text-white dark:text-zinc-100 border dark:border-zinc-700 text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-10 transition-opacity">
                          {item.sent} sent
                        </span>
                      </div>
                      <div
                        style={{ height: `${Math.max(replyHeight, 6)}%` }}
                        className="w-3.5 bg-purple-500 hover:bg-purple-600 rounded-t-xs transition-all relative group"
                        title={`${item.date}: ${item.replies} replies`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-zinc-900 text-white dark:text-zinc-100 border dark:border-zinc-700 text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-10 transition-opacity">
                          {item.replies} replied
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">{item.date}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>Overall reply rate: <strong className="text-purple-600 dark:text-purple-400 font-semibold">{effectiveStats.replyRatePercentage}%</strong></span>
              <button
                onClick={() => onNavigate('responses')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <span>View Response Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Server-Joined Campaign Summaries (Real-Time from Aggregation Service) */}
          {effectiveStats.campaignSummaries && effectiveStats.campaignSummaries.length > 0 && (
            <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Relational Campaign Performance</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Single consistent JOIN across campaigns, sent history, and replies</p>
                </div>
                <button
                  onClick={() => onNavigate('campaigns')}
                  className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Manage Campaigns &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {effectiveStats.campaignSummaries.map((camp) => (
                  <div
                    key={camp.campaignId}
                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-850/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{camp.campaignName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400">
                          {camp.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        Type: <span className="font-medium text-slate-700 dark:text-zinc-300">{camp.campaignType.replace(/_/g, ' ')}</span> &bull; Targets: {camp.totalRecipients} contacts
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center px-2 py-1 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800">
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Sent</div>
                        <div className="font-bold text-slate-900 dark:text-white">{camp.sentCount}</div>
                      </div>
                      <div className="text-center px-2 py-1 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800">
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Replies</div>
                        <div className="font-bold text-purple-600 dark:text-purple-400">{camp.repliesCount}</div>
                      </div>
                      <div className="text-center px-2 py-1 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800">
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Reply Rate</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{camp.replyRatePercentage}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Upcoming Queue & Quick Action & Distribution */}
        <div className="space-y-6">
          {/* Upcoming Queue Card */}
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-zinc-100 text-base">Upcoming Queue</h2>
              <button
                onClick={() => onNavigate('scheduled')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {displayQueue.length === 0 ? (
                <div className="py-8 px-4 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                  <Clock className="w-6 h-6 mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
                  <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Outbound queue is clear</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                    No scheduled messages waiting for dispatch.
                  </div>
                </div>
              ) : (
                displayQueue.map((item: any, idx: number) => {
                  const isFirst = idx === 0;
                  return (
                    <div
                      key={item.id || idx}
                      className={`relative pl-4 border-l-2 ${isFirst ? 'border-indigo-200 dark:border-indigo-800' : 'border-slate-100 dark:border-zinc-800'}`}
                    >
                      <div
                        className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${
                          isFirst ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-600'
                        }`}
                      />
                      <div className={`text-xs font-bold mb-0.5 ${isFirst ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                        {item.scheduledFor || 'Scheduled'}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                        {item.subject || (item.contactName ? `Outreach to ${item.contactName}` : 'Scheduled Outreach')}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                        {item.recipientText || (item.recipientEmail ? `To: ${item.recipientEmail}` : 'Target Recipient')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Action Callout Box */}
            <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white flex flex-col gap-2 shadow-sm">
              <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quick Actions</span>
              </div>
              <button
                onClick={() => onNavigate('compose')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold text-white transition-all cursor-pointer text-center"
              >
                Compose Personalized Email
              </button>
              <button
                onClick={() => onNavigate('templates')}
                className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer text-center"
              >
                Browse Template Library (10 Templates)
              </button>
            </div>
          </div>

          {/* Outreach Distribution Card */}
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Outreach Distribution</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">By target category and geography</p>

            {/* Category Breakdown */}
            <div className="space-y-3 mb-5">
              {(effectiveStats.outreachBreakdown || []).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5">
                      {item.name.toLowerCase().includes('job') || item.name.toLowerCase().includes('company') ? (
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{item.name}</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden">
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
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-850">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 mb-2.5">
                <Globe2 className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Target Geographies</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(effectiveStats.topCountries || []).map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800"
                  >
                    {c.country}: <strong className="ml-1 text-slate-900 dark:text-white">{c.count}</strong>
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
