/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Send,
  Clock,
  CheckCheck,
  MessageSquareReply,
  Repeat,
  FileText,
  FolderOpen,
  Settings,
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { useRouter } from './lib/router';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { CampaignsView } from './components/CampaignsView';
import { ComposeView } from './components/ComposeView';
import { ScheduledView } from './components/ScheduledView';
import { SentView } from './components/SentView';
import { ResponsesView } from './components/ResponsesView';
import { FollowUpsView } from './components/FollowUpsView';
import { TemplatesView } from './components/TemplatesView';
import { FilesView } from './components/FilesView';
import { SettingsView } from './components/SettingsView';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';

import { api } from './lib/api';
import { connectGoogleAccount, disconnectGoogleAccount, initAuth } from './lib/auth';
import {
  Contact,
  Campaign,
  ScheduledMessage,
  SentMessage,
  IncomingMessage,
  FollowUpRule,
  FollowUpInstance,
  Template,
  StoredFile,
  UserSettings,
  DashboardStats,
  NotificationItem,
  AuditLog,
  AttachmentRef,
} from './types';

type NavPage =
  | 'dashboard'
  | 'contacts'
  | 'campaigns'
  | 'compose'
  | 'scheduled'
  | 'sent'
  | 'responses'
  | 'followups'
  | 'templates'
  | 'files'
  | 'settings';

function pathToNavPage(pathname: string): NavPage {
  const p = pathname.toLowerCase().replace(/^\/+/, '').split('/')[0];
  switch (p) {
    case 'contacts':
      return 'contacts';
    case 'campaigns':
      return 'campaigns';
    case 'compose':
      return 'compose';
    case 'scheduled':
      return 'scheduled';
    case 'sent':
      return 'sent';
    case 'responses':
      return 'responses';
    case 'follow-ups':
    case 'followups':
      return 'followups';
    case 'templates':
      return 'templates';
    case 'documents':
    case 'files':
      return 'files';
    case 'settings':
      return 'settings';
    case 'dashboard':
    default:
      return 'dashboard';
  }
}

function navPageToPath(page: NavPage): string {
  switch (page) {
    case 'followups':
      return '/follow-ups';
    case 'files':
      return '/documents';
    default:
      return `/${page}`;
  }
}

const DEFAULT_USER_SETTINGS: UserSettings = {
  profile: {
    name: 'Anjan Prajapati',
    title: 'Senior Cloud & Systems Engineer',
    email: 'anjanp93722@gmail.com',
    phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/anjanprajapati',
    github: 'https://github.com/anjanprajapati',
    portfolio: 'https://anjanprajapati.dev',
    education: 'B.Tech in Computer Science and Engineering',
    skills: 'Distributed Systems, Cloud Computing (GCP/AWS), Kubernetes, Go, TypeScript, Node.js, Terraform',
    targetRoles: 'Cloud Engineer, Staff DevOps Engineer, Site Reliability Engineer',
    targetCountries: 'Ireland, United Kingdom, Netherlands, Germany, United States',
  },
  email: {
    defaultSignature: `\n\nBest regards,\nAnjan Prajapati\nSenior Cloud & Systems Engineer\nEmail: anjanp93722@gmail.com | Phone: +91 98765 43210\nLinkedIn: linkedin.com/in/anjanprajapati | GitHub: github.com/anjanprajapati`,
  },
  automation: {
    dailyLimit: 5,
    delayMinutes: 10,
    timezone: 'Asia/Kolkata',
    automaticSending: true,
    automaticFollowUp: true,
  },
  ai: {
    aiAssistance: true,
    personalization: true,
    replyClassification: true,
  },
  defaultSignature: `\n\nBest regards,\nAnjan Prajapati\nSenior Cloud & Systems Engineer\nEmail: anjanp93722@gmail.com | Phone: +91 98765 43210\nLinkedIn: linkedin.com/in/anjanprajapati | GitHub: github.com/anjanprajapati`,
  sendingLimits: {
    maxEmailsPerDay: 5,
    delaySecondsBetweenSends: 600,
    timezone: 'Asia/Kolkata',
  },
  aiSettings: {
    autoCategorizeReplies: true,
    suggestFollowUpReminders: true,
  },
};

export default function App() {
  const router = useRouter();

  // Navigation
  const [currentPage, setCurrentPage] = useState<NavPage>(() => pathToNavPage(router.path));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Application session state (distinct from Gmail OAuth)
  const [session, setSession] = useState<{
    isAuthenticated: boolean;
    user: { email: string; name: string; role: 'USER' | 'ADMIN'; isAdmin: boolean } | null;
    isLoading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const checkSession = useCallback(async () => {
    try {
      const data = await api.getSession();
      setSession({
        isAuthenticated: Boolean(data?.authenticated),
        user: data?.user || null,
        isLoading: false,
      });
      return data?.authenticated;
    } catch {
      setSession({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return false;
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Synchronize router path to currentPage on load or path changes
  useEffect(() => {
    if (!router.isPublic) {
      const pageFromPath = pathToNavPage(router.path);
      setCurrentPage(pageFromPath);
    }
  }, [router.path, router.isPublic]);

  // Route protection guard
  useEffect(() => {
    if (session.isLoading) return;

    if (!router.isPublic && !session.isAuthenticated) {
      // User is attempting to view a protected page while unauthenticated
      router.replace('/auth/login?redirect=' + encodeURIComponent(router.path));
    } else if (router.path === '/auth/login' && session.isAuthenticated) {
      // User is on login page while already authenticated
      const target = router.query.redirect || '/dashboard';
      router.replace(target);
    }
  }, [session.isLoading, session.isAuthenticated, router.path, router.isPublic, router.query]);

  const navigateToPage = (page: NavPage) => {
    setCurrentPage(page);
    router.navigate(navPageToPath(page));
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setSession({ isAuthenticated: false, user: null, isLoading: false });
      showToast('info', 'Signed out of OutreachOS');
      router.navigate('/auth/login');
    } catch (err: any) {
      showToast('error', `Sign out failed: ${err.message}`);
    }
  };

  // App Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  const [responses, setResponses] = useState<IncomingMessage[]>([]);
  const [followUpRules, setFollowUpRules] = useState<FollowUpRule[]>([]);
  const [followUpInstances, setFollowUpInstances] = useState<FollowUpInstance[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Gmail OAuth status
  const [gmailStatus, setGmailStatus] = useState<{
    isConnected: boolean;
    needsReauth?: boolean;
    email: string | null;
    displayName: string | null;
    lastSyncTime: string | null;
    role?: 'ADMIN' | 'USER';
    isAdmin?: boolean;
    dailyLimit?: number | 'UNLIMITED';
    remainingToday?: number | 'UNLIMITED';
  }>({
    isConnected: false,
    needsReauth: false,
    email: null,
    displayName: null,
    lastSyncTime: null,
    role: 'USER',
    isAdmin: false,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Preselection for Compose view
  const [composeContact, setComposeContact] = useState<Contact | null>(null);
  const [composeCampaign, setComposeCampaign] = useState<Campaign | null>(null);
  const [aiDraft, setAiDraft] = useState<{ subject?: string; body?: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Data loader
  const loadAppData = useCallback(async () => {
    if (!session.isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const [
        authStatus,
        statsData,
        contactsData,
        campaignsData,
        schedData,
        sentData,
        respData,
        fuData,
        tplData,
        filesData,
        settingsData,
        notifsData,
        logsData,
      ] = await Promise.all([
        api.getAuthStatus().catch(() => ({ isConnected: false, email: null, displayName: null, lastSyncTime: null })),
        api.getDashboardStats().catch(() => null),
        api.getContacts().catch(() => []),
        api.getCampaigns().catch(() => []),
        api.getScheduledMessages().catch(() => []),
        api.getSentMessages().catch(() => []),
        api.getResponses().catch(() => []),
        api.getFollowUps().catch(() => ({ rules: [], instances: [] })),
        api.getTemplates().catch(() => []),
        api.getFiles().catch(() => []),
        api.getSettings().catch(() => null),
        api.getNotifications().catch(() => []),
        api.getAuditLogs().catch(() => []),
      ]);

      setGmailStatus(authStatus);
      const safeContacts = Array.isArray(contactsData) ? contactsData : [];
      const safeCampaigns = Array.isArray(campaignsData) ? campaignsData : [];
      const safeSched = Array.isArray(schedData) ? schedData : [];
      const safeSent = Array.isArray(sentData) ? sentData : [];
      const safeResp = Array.isArray(respData) ? respData : [];

      if (statsData) {
        setStats(statsData);
      } else {
        setStats({
          totalContacts: safeContacts.length,
          scheduledCount: safeSched.length,
          sentToday: 0,
          totalSent: safeSent.length,
          repliesCount: safeResp.length,
          followUpsCount: 0,
          failedCount: 0,
          activeCampaigns: safeCampaigns.filter((c: any) => c.status === 'ACTIVE').length,
          replyRatePercentage: safeSent.length > 0 ? Math.round((safeResp.length / safeSent.length) * 100) : 0,
          recentActivities: [],
          sentOverTime: [],
          outreachBreakdown: [],
          topCountries: [],
        });
      }
      setContacts(safeContacts);
      setCampaigns(safeCampaigns);
      setScheduledMessages(safeSched);
      setSentMessages(safeSent);
      setResponses(safeResp);
      setFollowUpRules(Array.isArray(fuData?.rules) ? fuData.rules : []);
      setFollowUpInstances(Array.isArray(fuData?.instances) ? fuData.instances : []);
      setTemplates(Array.isArray(tplData) ? tplData : []);
      setFiles(Array.isArray(filesData) ? filesData : []);
      setNotifications(Array.isArray(notifsData) ? notifsData : []);
      setAuditLogs(Array.isArray(logsData) ? logsData : []);
      if (settingsData) {
        setSettings((prev) => ({
          ...prev,
          ...settingsData,
          profile: { ...prev.profile, ...(settingsData.profile || {}) },
          email: { ...prev.email, ...(settingsData.email || {}) },
          automation: { ...prev.automation, ...(settingsData.automation || {}) },
          ai: { ...prev.ai, ...(settingsData.ai || {}) },
          sendingLimits: {
            maxEmailsPerDay: settingsData.sendingLimits?.maxEmailsPerDay ?? settingsData.automation?.dailyLimit ?? prev.sendingLimits?.maxEmailsPerDay ?? 5,
            delaySecondsBetweenSends: settingsData.sendingLimits?.delaySecondsBetweenSends ?? (settingsData.automation?.delayMinutes ? settingsData.automation.delayMinutes * 60 : 600),
            timezone: settingsData.sendingLimits?.timezone || settingsData.automation?.timezone || 'Asia/Kolkata',
          },
          aiSettings: {
            autoCategorizeReplies: settingsData.aiSettings?.autoCategorizeReplies ?? settingsData.ai?.replyClassification ?? true,
            suggestFollowUpReminders: settingsData.aiSettings?.suggestFollowUpReminders ?? true,
          },
        }));
      }
      setNotifications(notifsData);
      setAuditLogs(logsData);
    } catch (err: any) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    if (!session.isAuthenticated) return;

    loadAppData();
    const unsubscribeAuth = initAuth(
      () => {
        loadAppData();
      },
      () => {}
    );

    const interval = setInterval(() => {
      loadAppData();
    }, 25000);

    return () => {
      unsubscribeAuth();
      clearInterval(interval);
    };
  }, [session.isAuthenticated, loadAppData]);

  // Handle Google OAuth
  const handleConnectGmail = async () => {
    try {
      showToast('info', 'Connecting your Gmail account with Workspace OAuth...');
      const result = await connectGoogleAccount();
      showToast('success', `Connected as ${result.email}! Gmail sending and reply monitoring active.`);
      await loadAppData();
    } catch (err: any) {
      showToast('error', `Gmail connection failed: ${err.message}`);
    }
  };

  const handleDisconnectGmail = async () => {
    try {
      await disconnectGoogleAccount();
      setGmailStatus({ isConnected: false, email: null, displayName: null, lastSyncTime: null });
      showToast('info', 'Disconnected Gmail account.');
      await loadAppData();
    } catch (err: any) {
      showToast('error', `Failed to disconnect: ${err.message}`);
    }
  };

  const handleSyncReplies = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncResponses();
      if (res.newReplies > 0) {
        showToast('success', `Found ${res.newReplies} new incoming reply! Categorized by Gemini.`);
      } else {
        showToast('info', 'Gmail synced. No new outreach replies detected.');
      }
      await loadAppData();
    } catch (err: any) {
      showToast('error', `Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    await api.readAllNotifications();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Compose routing helpers
  const handleNavigateToComposeWithContact = (contact: Contact) => {
    setComposeContact(contact);
    setComposeCampaign(null);
    navigateToPage('compose');
  };

  const handleNavigateToComposeWithCampaign = (campaign: Campaign) => {
    setComposeCampaign(campaign);
    setComposeContact(null);
    navigateToPage('compose');
  };

  const handleNavigateToComposeWithTemplate = (template: Template) => {
    setComposeContact(null);
    setComposeCampaign(null);
    navigateToPage('compose');
  };

  const pageTitles: Record<NavPage, string> = {
    dashboard: 'Performance Dashboard',
    contacts: 'Contacts Directory',
    campaigns: 'Outreach Campaigns',
    compose: 'Personalized Message Composer',
    scheduled: 'Scheduled Queue & Dispatcher',
    sent: 'Verified Sent Delivery Log',
    responses: 'Response Inbox & AI Categorizer',
    followups: 'Automated Follow-up Sequences',
    templates: 'Email Template Repository',
    files: 'Outreach Document Vault',
    settings: 'System & Safety Settings',
  };

  // Nav items definition
  const navItems: {
    id: NavPage;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users, badge: contacts?.length || 0 },
    { id: 'campaigns', label: 'Campaigns', icon: Briefcase, badge: campaigns?.length || 0 },
    { id: 'compose', label: 'Compose', icon: Send },
    {
      id: 'scheduled',
      label: 'Scheduled Queue',
      icon: Clock,
      badge: (scheduledMessages || []).filter((m) => m.status === 'QUEUED' || m.status === 'READY_FOR_REVIEW').length,
    },
    { id: 'sent', label: 'Sent Log', icon: CheckCheck, badge: sentMessages?.length || 0 },
    {
      id: 'responses',
      label: 'Responses / Inbox',
      icon: MessageSquareReply,
      badge: (responses || []).filter((r) => r.userResponseStatus === 'PENDING').length,
    },
    { id: 'followups', label: 'Follow-ups', icon: Repeat },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'files', label: 'Documents', icon: FolderOpen, badge: files?.length || 0 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Public Route Rendering: Homepage (Landing Page)
  if (router.path === '/') {
    return (
      <LandingPage
        isAuthenticated={session.isAuthenticated}
        user={session.user}
        onNavigateLogin={() => router.navigate('/auth/login')}
        onNavigateDashboard={() => router.navigate('/dashboard')}
      />
    );
  }

  // Public Route Rendering: Login Screen
  if (router.path === '/auth/login') {
    return (
      <LoginPage
        onLoginSuccess={(userData) => {
          setSession({ isAuthenticated: true, user: userData as any, isLoading: false });
          const target = router.query.redirect || '/dashboard';
          router.navigate(target);
        }}
        onNavigateHome={() => router.navigate('/')}
        redirectPath={router.query.redirect || '/dashboard'}
      />
    );
  }

  // OAuth Callback Route
  if (router.path === '/auth/callback') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center mb-3">
          O
        </div>
        <p className="text-sm font-semibold text-slate-700">Connecting to OutreachOS workspace...</p>
      </div>
    );
  }

  // Protected Route State Guards
  if (session.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center mb-3 animate-pulse">
          O
        </div>
        <p className="text-xs font-semibold text-slate-500">Loading OutreachOS workspace...</p>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Floating Feedback Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center space-x-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <RefreshCw className="w-4 h-4 text-indigo-400" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Mobile nav overlay backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sleek Left Sidebar Navigation (Matching Sleek Interface theme) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 shrink-0 ${
          isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Logo & Title */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
              O
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-800 leading-tight">OutreachOS</span>
              {gmailStatus.isAdmin && (
                <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider leading-none mt-0.5">
                  ADMIN CONSOLE
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  navigateToPage(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`mr-3 w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      item.id === 'responses'
                        ? 'bg-rose-500 text-white'
                        : isActive
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom: Gmail Status Card */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Gmail Status</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  gmailStatus.isConnected ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            </div>
            <div
              className="text-sm font-medium text-slate-700 truncate"
              title={gmailStatus.email || 'Not connected'}
            >
              {gmailStatus.email || 'No account connected'}
            </div>
            <button
              onClick={() => {
                if (gmailStatus.isConnected && !gmailStatus.needsReauth) {
                  navigateToPage('settings');
                } else {
                  handleConnectGmail();
                }
              }}
              className={`mt-3 w-full py-2 text-xs border rounded-lg transition-colors font-semibold shadow-2xs cursor-pointer ${
                gmailStatus.needsReauth
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-600'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {gmailStatus.needsReauth
                ? 'Authorize Gmail'
                : gmailStatus.isConnected
                ? 'Manage Settings'
                : 'Connect Account'}
            </button>

            {/* OutreachOS Session info & Sign Out */}
            {session.user && (
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div className="truncate mr-2 min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">OutreachOS User</div>
                  <div className="font-semibold text-slate-700 truncate">{session.user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out of OutreachOS"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sleek Top Header */}
        <Header
          gmailStatus={gmailStatus}
          sentToday={stats?.sentToday || 0}
          dailyLimit={gmailStatus.isAdmin ? 'UNLIMITED' : (stats?.dailyLimit ?? settings?.sendingLimits?.maxEmailsPerDay ?? settings?.automation?.dailyLimit ?? 10)}
          remainingToday={gmailStatus.remainingToday ?? stats?.remainingToday}
          role={gmailStatus.role || stats?.role || 'USER'}
          isAdmin={gmailStatus.isAdmin || stats?.isAdmin || false}
          notifications={notifications}
          onConnectGmail={handleConnectGmail}
          onDisconnectGmail={handleDisconnectGmail}
          onSyncReplies={handleSyncReplies}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          isSyncing={isSyncing}
          currentPageTitle={pageTitles[currentPage] || 'Performance Dashboard'}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onOpenSettings={() => navigateToPage('settings')}
          onLogout={handleLogout}
          userSession={session.user}
        />

        {/* Re-auth Warning Banner */}
        {gmailStatus.needsReauth && (
          <div className="bg-amber-500 text-white px-6 py-2.5 flex items-center justify-between text-xs shadow-xs shrink-0">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>
                <strong>Gmail Permissions Updated:</strong> OAuth send & read scopes were approved. Please re-authorize your account to dispatch emails and sync replies.
              </span>
            </div>
            <button
              onClick={handleConnectGmail}
              className="px-3.5 py-1 bg-white text-amber-900 hover:bg-amber-50 rounded-lg font-bold text-xs cursor-pointer transition-colors shadow-2xs whitespace-nowrap ml-4"
            >
              Authorize Gmail
            </button>
          </div>
        )}

        {/* Scrollable Page Body */}
        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Loading OutreachOS Workspace...</span>
            </div>
          ) : (
            <>
              {/* Dashboard View */}
              {currentPage === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  onNavigate={(page) => navigateToPage(page as NavPage)}
                  onSyncReplies={handleSyncReplies}
                  isSyncing={isSyncing}
                  recentResponses={responses}
                  upcomingScheduled={scheduledMessages}
                />
              )}

              {/* Contacts View */}
              {currentPage === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onAddContact={async (contact) => {
                    await api.createContact(contact);
                    showToast('success', 'Contact created successfully');
                    await loadAppData();
                  }}
                  onUpdateContact={async (id, contact) => {
                    await api.updateContact(id, contact);
                    showToast('success', 'Contact updated successfully');
                    await loadAppData();
                  }}
                  onDeleteContact={async (id) => {
                    await api.deleteContact(id);
                    showToast('info', 'Contact removed');
                    await loadAppData();
                  }}
                  onImportContacts={async (parsed) => {
                    const res = await api.importContacts(parsed);
                    showToast('success', `Imported ${res.count} contacts!`);
                    await loadAppData();
                  }}
                  onComposeToContact={handleNavigateToComposeWithContact}
                />
              )}

              {/* Campaigns View */}
              {currentPage === 'campaigns' && (
                <CampaignsView
                  campaigns={campaigns}
                  contacts={contacts}
                  templates={templates}
                  onCreateCampaign={async (camp) => {
                    await api.createCampaign(camp);
                    showToast('success', 'Outreach campaign created!');
                    await loadAppData();
                  }}
                  onUpdateStatus={async (id, status) => {
                    await api.updateCampaignStatus(id, status);
                    showToast('info', `Campaign status updated to ${status}`);
                    await loadAppData();
                  }}
                  onDeleteCampaign={async (id) => {
                    await api.deleteCampaign(id);
                    showToast('info', 'Campaign deleted');
                    await loadAppData();
                  }}
                  onNavigateToCompose={handleNavigateToComposeWithCampaign}
                />
              )}

              {/* Compose View */}
              {currentPage === 'compose' && (
                <ComposeView
                  contacts={contacts}
                  campaigns={campaigns}
                  templates={templates}
                  files={files}
                  preselectedContact={composeContact}
                  preselectedCampaign={composeCampaign}
                  initialDraft={aiDraft}
                  onSendMessage={async (payload) => {
                    await api.composeMessage(payload);
                    await loadAppData();
                  }}
                  onSendNow={async (payload) => {
                    await api.sendNow(payload);
                    await loadAppData();
                  }}
                  onAiImprove={async (content, instruction, contactContext) => {
                    const res = await api.aiImprove(content, instruction, contactContext);
                    return res.text;
                  }}
                  onAiSubject={async (content, role, org) => {
                    const res = await api.aiSubject(content, role, org, settings?.profile?.name);
                    return res.subjects;
                  }}
                  onAiPersonalize={async (templateText, contact) => {
                    const res = await api.aiPersonalize(templateText, contact);
                    return res.text;
                  }}
                  onAiSummarizeJD={async (jdText) => {
                    return await api.aiSummarizeJD(jdText);
                  }}
                  onUploadFile={async (f) => {
                    const res = await api.uploadFile(f);
                    await loadAppData();
                    return res;
                  }}
                  onRefreshFiles={loadAppData}
                />
              )}

              {/* Scheduled Queue View */}
              {currentPage === 'scheduled' && (
                <ScheduledView
                  messages={scheduledMessages}
                  onApproveMessage={async (id) => {
                    await api.approveMessage(id);
                    showToast('success', 'Message approved and placed in active sending queue!');
                    await loadAppData();
                  }}
                  onCancelMessage={async (id) => {
                    await api.cancelScheduledMessage(id);
                    showToast('info', 'Message cancelled');
                    await loadAppData();
                  }}
                  onSendNow={async (msg) => {
                    try {
                      await api.sendNow({
                        recipientId: msg.recipientId,
                        recipientEmail: msg.recipientEmail,
                        recipientName: msg.recipientName,
                        subject: msg.subject,
                        messageBody: msg.messageBody,
                        attachments: msg.attachments,
                        campaignId: msg.campaignId,
                        campaignName: msg.campaignName,
                      });
                      showToast('success', `Delivered email to ${msg.recipientEmail} via Gmail API!`);
                      await loadAppData();
                    } catch (err: any) {
                      showToast('error', `Send failed: ${err.message}`);
                    }
                  }}
                  onRetryMessage={async (id) => {
                    try {
                      await api.retryScheduledMessage(id);
                      showToast('success', 'Message re-queued for dispatch!');
                      await loadAppData();
                    } catch (err: any) {
                      showToast('error', `Retry failed: ${err.message}`);
                    }
                  }}
                />
              )}

              {/* Sent Messages View */}
              {currentPage === 'sent' && (
                <SentView
                  sentMessages={sentMessages}
                  onComposeFollowUp={(sent) => {
                    setComposeContact(
                      contacts.find((c) => c.email.toLowerCase() === sent.recipientEmail.toLowerCase()) || {
                        id: sent.recipientId,
                        name: sent.recipientName,
                        email: sent.recipientEmail,
                        organization: 'Target Organization',
                        organizationType: 'RECRUITER',
                        country: 'United States',
                      }
                    );
                    setComposeCampaign(campaigns.find((c) => c.id === sent.campaignId) || null);
                    navigateToPage('compose');
                  }}
                  onSendAgain={async (sent) => {
                    await api.sendNow({
                      recipientId: sent.recipientId,
                      recipientEmail: sent.recipientEmail,
                      recipientName: sent.recipientName,
                      subject: sent.subject,
                      messageBody: sent.messageBody,
                      attachments: sent.attachments,
                      campaignId: sent.campaignId,
                      campaignName: sent.campaignName,
                      forceSendAgain: true,
                    });
                    showToast('success', `Resent email to ${sent.recipientEmail}!`);
                    await loadAppData();
                  }}
                />
              )}

              {/* Responses View */}
              {currentPage === 'responses' && (
                <ResponsesView
                  responses={responses}
                  onSyncReplies={handleSyncReplies}
                  onUpdateStatus={async (id, status) => {
                    await api.updateResponseStatus(id, status);
                    showToast('info', 'Response status updated');
                    await loadAppData();
                  }}
                  onDraftAiResponse={async (incoming) => {
                    const res = await api.aiDraftResponse(
                      incoming.subject,
                      incoming.bodyText,
                      incoming.originalOutreachSnippet || ''
                    );
                    return res.draft;
                  }}
                  onReplyToMessage={(incoming, initialDraft) => {
                    setComposeContact({
                      id: incoming.contactId || 'custom',
                      name: incoming.contactName,
                      email: incoming.contactEmail,
                      organization: incoming.organization || 'Target Organization',
                      organizationType: 'RECRUITER',
                      country: 'United States',
                    });
                    setComposeCampaign(campaigns.find((c) => c.id === incoming.campaignId) || null);
                    navigateToPage('compose');
                  }}
                  isSyncing={isSyncing}
                />
              )}

              {/* Follow-ups View */}
              {currentPage === 'followups' && (
                <FollowUpsView
                  rules={followUpRules}
                  instances={followUpInstances}
                  campaigns={campaigns}
                  onCreateRule={async (rule) => {
                    await api.createFollowUpRule(rule);
                    showToast('success', 'Follow-up rule created');
                    await loadAppData();
                  }}
                  onToggleRule={async (id) => {
                    await api.toggleFollowUpRule(id);
                    await loadAppData();
                  }}
                />
              )}

              {/* Templates View */}
              {currentPage === 'templates' && (
                <TemplatesView
                  templates={templates}
                  onCreateTemplate={async (tpl) => {
                    await api.createTemplate(tpl);
                    showToast('success', 'Template saved');
                    await loadAppData();
                  }}
                  onDeleteTemplate={async (id) => {
                    await api.deleteTemplate(id);
                    showToast('info', 'Template removed');
                    await loadAppData();
                  }}
                  onUseTemplate={handleNavigateToComposeWithTemplate}
                />
              )}

              {/* Files View */}
              {currentPage === 'files' && (
                <FilesView
                  files={files}
                  onUploadFile={async (f) => {
                    await api.uploadFile(f);
                    showToast('success', `Uploaded document: ${f.name}`);
                    await loadAppData();
                  }}
                  onDeleteFile={async (id) => {
                    await api.deleteFile(id);
                    showToast('info', 'Document removed');
                    await loadAppData();
                  }}
                  onLoadDriveFiles={async () => {
                    return await api.getDriveFiles();
                  }}
                  onSetDefaultResume={async (id) => {
                    await api.setDefaultResume(id);
                    showToast('success', 'Set as primary outreach resume');
                    await loadAppData();
                  }}
                  onSelectForCompose={(file) => {
                    setAiDraft({
                      subject: '',
                      body: '',
                      attachments: [
                        {
                          fileId: file.id,
                          name: file.name,
                          type: file.mimeType,
                          size: file.size,
                          mimeType: file.mimeType,
                          storageKey: file.storageKey,
                          storageUrl: file.storageUrl,
                          driveFileId: file.driveFileId,
                        },
                      ],
                    });
                    navigateToPage('compose');
                  }}
                />
              )}

              {/* Settings View */}
              {currentPage === 'settings' && (
                <SettingsView
                  settings={settings}
                  auditLogs={auditLogs}
                  gmailStatus={gmailStatus}
                  isAdmin={gmailStatus.isAdmin || stats?.isAdmin || false}
                  onSaveSettings={async (newSettings) => {
                    await api.updateSettings(newSettings);
                    showToast('success', 'Configuration saved!');
                    await loadAppData();
                  }}
                  onConnectGmail={handleConnectGmail}
                  onDisconnectGmail={handleDisconnectGmail}
                  onDataReset={async () => {
                    showToast('success', 'Database reset to zero state.');
                    await loadAppData();
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Persistent AI Outreach Assistant Drawer */}
      <AiAssistantDrawer
        onNavigateToComposeWithDraft={(draft) => {
          setAiDraft(draft);
          navigateToPage('compose');
        }}
      />
    </div>
  );
}
