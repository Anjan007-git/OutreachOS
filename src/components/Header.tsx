import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Bell,
  RefreshCw,
  Menu,
  Shield,
} from 'lucide-react';
import { NotificationItem, UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  gmailStatus: { isConnected: boolean; needsReauth?: boolean; email: string | null; displayName: string | null; lastSyncTime: string | null };
  sentToday: number;
  dailyLimit: number | 'UNLIMITED';
  remainingToday?: number | 'UNLIMITED';
  role?: UserRole;
  isAdmin?: boolean;
  notifications: NotificationItem[];
  onConnectGmail: () => void;
  onDisconnectGmail: () => void;
  onSyncReplies: () => void;
  onMarkNotificationsRead: () => void;
  isSyncing: boolean;
  currentPageTitle?: string;
  onToggleMobileNav?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  userSession?: { email: string; name: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  gmailStatus,
  sentToday,
  dailyLimit,
  remainingToday,
  role = 'USER',
  isAdmin = false,
  notifications,
  onConnectGmail,
  onDisconnectGmail,
  onSyncReplies,
  onMarkNotificationsRead,
  isSyncing,
  currentPageTitle = 'Performance Dashboard',
  onToggleMobileNav,
  onOpenSettings,
  onLogout,
  userSession,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  const userInitial = gmailStatus.displayName
    ? gmailStatus.displayName.charAt(0).toUpperCase()
    : gmailStatus.email
    ? gmailStatus.email.charAt(0).toUpperCase()
    : 'U';

  const isLimitReached = !isAdmin && typeof dailyLimit === 'number' && sentToday >= dailyLimit;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#151515] bg-white dark:bg-[#000000] px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-lg transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">{currentPageTitle}</h1>
          {isAdmin && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider"
              title="Administrator Account: Unlimited system sending and full data management access"
            >
              <Shield className="w-2.5 h-2.5" />
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions, Counter, Theme, Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Theme Toggle Switch */}
        <ThemeToggle />

        {/* Daily Sending Limit Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isAdmin
              ? 'bg-indigo-50/70 dark:bg-[#080808] border-indigo-200/80 dark:border-[#1A1A1A] text-indigo-900 dark:text-[#FFFFFF]'
              : isLimitReached
              ? 'bg-rose-50 dark:bg-[#080808] border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400'
              : 'bg-slate-100 dark:bg-[#080808] text-slate-600 dark:text-[#A1A1AA] border-slate-200/60 dark:border-[#1A1A1A]'
          }`}
          title={isAdmin ? 'Admin account: Unlimited outreach limit' : 'Daily sending limit counter'}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isAdmin ? 'bg-indigo-600' : isLimitReached ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
          />
          <span>
            {isAdmin ? (
              <>
                Sending: <strong className="text-indigo-700 dark:text-indigo-400 font-bold">Unlimited</strong>
              </>
            ) : isLimitReached ? (
              <>
                <strong className="font-bold">Limit Reached ({sentToday}/{dailyLimit})</strong>
              </>
            ) : (
              <>
                Limit: <strong className="text-slate-900 dark:text-white font-semibold">{sentToday}/{dailyLimit}</strong>
              </>
            )}
          </span>
        </div>

        {/* Re-auth Warning Button */}
        {gmailStatus.needsReauth && (
          <button
            onClick={onConnectGmail}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="OAuth permissions updated. Click to authorize."
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Authorize Gmail</span>
          </button>
        )}

        {/* Sync Replies Button */}
        {gmailStatus.isConnected && (
          <button
            id="btn-sync-replies-header"
            onClick={onSyncReplies}
            disabled={isSyncing}
            className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-lg transition-colors relative cursor-pointer"
            title="Sync Gmail replies & thread updates"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (!showNotifs && unreadCount > 0) {
                onMarkNotificationsRead();
              }
            }}
            className="p-2 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] rounded-lg transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#080808] rounded-xl shadow-xl border border-slate-200 dark:border-[#1A1A1A] py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#151515] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-white uppercase tracking-wider">
                  Activity Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#151515]">
                {safeNotifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-400 dark:text-[#71717A]">No new notifications</div>
                ) : (
                  safeNotifications.slice(0, 10).map((n) => (
                    <div key={n.id} className={`p-3 text-xs ${n.read ? 'bg-white dark:bg-[#080808]' : 'bg-indigo-50/50 dark:bg-[#111111]'}`}>
                      <div className="font-semibold text-slate-800 dark:text-white mb-0.5">{n.title}</div>
                      <div className="text-slate-600 dark:text-[#A1A1AA] leading-relaxed">{n.message}</div>
                      <div className="text-slate-400 dark:text-[#71717A] mt-1 text-[10px]">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar / button with status dot */}
        <div className="relative">
          <button
            onClick={() => {
              if (gmailStatus.isConnected) {
                setShowAuthModal(true);
              } else if (onOpenSettings) {
                onOpenSettings();
              } else {
                onConnectGmail();
              }
            }}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#0A0A0A] hover:bg-slate-300 dark:hover:bg-[#111111] border border-slate-300 dark:border-[#1F1F1F] text-slate-700 dark:text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs relative"
            title={
              isAdmin
                ? `Admin: ${gmailStatus.email || 'anjanp93722@gmail.com'}`
                : gmailStatus.isConnected
                ? `Gmail: ${gmailStatus.email}`
                : 'Account Settings'
            }
          >
            {userInitial}
          </button>
          <span
            className={`w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-black absolute -bottom-0.5 -right-0.5 pointer-events-none ${
              gmailStatus.isConnected ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-600'
            }`}
            title={gmailStatus.isConnected ? 'Gmail connected' : 'Gmail not connected'}
          />
        </div>
      </div>

      {/* Gmail Account Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#080808] rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-[#1A1A1A]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Gmail Integration Active</h3>
                <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">Connected via Google Workspace OAuth</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-[#050505] p-4 rounded-xl border border-slate-200 dark:border-[#151515] text-xs mb-5">
              {userSession && (
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#151515]">
                  <span className="text-slate-500 dark:text-[#A1A1AA]">OutreachOS Session:</span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">{userSession.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-[#A1A1AA]">Gmail Sending Account:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{gmailStatus.email || 'Not connected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-[#A1A1AA]">Active Permissions:</span>
                <span className="font-semibold text-slate-800 dark:text-white">Send, Read, Drive, Sheets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-[#A1A1AA]">Last Synced:</span>
                <span className="text-slate-700 dark:text-[#A1A1AA]">
                  {gmailStatus.lastSyncTime
                    ? new Date(gmailStatus.lastSyncTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST'
                    : 'Just now'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {onLogout ? (
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    onLogout();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-white hover:text-slate-900 hover:bg-slate-100 dark:bg-[#0A0A0A] dark:hover:bg-[#111111] border border-slate-200 dark:border-[#1F1F1F] cursor-pointer"
                >
                  Sign Out of App
                </button>
              ) : <div />}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:bg-[#0A0A0A] dark:hover:bg-[#111111] border border-slate-200 dark:border-[#1F1F1F] cursor-pointer"
                >
                  Close
                </button>
                {gmailStatus.isConnected && (
                  <button
                    onClick={() => {
                      onDisconnectGmail();
                      setShowAuthModal(false);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 cursor-pointer"
                  >
                    Disconnect Gmail
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
