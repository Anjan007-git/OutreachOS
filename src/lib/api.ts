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
} from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = 12000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: options?.signal || controller.signal,
      ...options,
    });

    if (!res.ok) {
      let errorMsg = `Request failed (${res.status})`;
      try {
        const err = await res.json();
        errorMsg = err.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  // Health Check
  getHealth: () => fetchJson<{ success: boolean; environment: string; database: string; version: string; timestamp: string }>('/api/health'),

  // Auth & Connection
  getSession: () =>
    fetchJson<{
      authenticated: boolean;
      user: { email: string; name: string; role: 'USER' | 'ADMIN'; isAdmin: boolean } | null;
      gmailConnected: boolean;
      gmailEmail?: string | null;
    }>('/api/auth/session'),

  login: (email: string, name?: string, role?: string) =>
    fetchJson<{
      success: boolean;
      user: { email: string; name: string; role: 'USER' | 'ADMIN'; isAdmin: boolean };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, name, role }),
    }),

  logout: () => fetchJson<{ success: boolean; message?: string }>('/api/auth/logout', { method: 'POST' }),

  getAuthStatus: () =>
    fetchJson<{
      isConnected: boolean;
      needsReauth?: boolean;
      email: string | null;
      displayName: string | null;
      lastSyncTime: string | null;
      role?: 'ADMIN' | 'USER';
      isAdmin?: boolean;
      dailyLimit?: number | 'UNLIMITED';
      remainingToday?: number | 'UNLIMITED';
      adminEmail?: string;
    }>('/api/auth/status'),

  // Dashboard
  getDashboardStats: () => fetchJson<DashboardStats>('/api/dashboard/stats'),

  // Contacts
  getContacts: () => fetchJson<Contact[]>('/api/contacts'),
  createContact: (contact: Partial<Contact>) =>
    fetchJson<Contact>('/api/contacts', { method: 'POST', body: JSON.stringify(contact) }),
  updateContact: (id: string, contact: Partial<Contact>) =>
    fetchJson<{ success: boolean }>(`/api/contacts/${id}`, { method: 'PUT', body: JSON.stringify(contact) }),
  deleteContact: (id: string) => fetchJson<{ success: boolean }>(`/api/contacts/${id}`, { method: 'DELETE' }),
  importContacts: (contacts: any[]) =>
    fetchJson<{ success: boolean; count: number }>('/api/contacts/import', {
      method: 'POST',
      body: JSON.stringify({ contacts }),
    }),

  // Campaigns
  getCampaigns: () => fetchJson<Campaign[]>('/api/campaigns'),
  createCampaign: (campaign: Partial<Campaign>) =>
    fetchJson<Campaign>('/api/campaigns', { method: 'POST', body: JSON.stringify(campaign) }),
  updateCampaign: (id: string, campaign: Partial<Campaign>) =>
    fetchJson<{ success: boolean }>(`/api/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(campaign) }),
  updateCampaignStatus: (id: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED') =>
    fetchJson<{ success: boolean; status: string }>(`/api/campaigns/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteCampaign: (id: string) => fetchJson<{ success: boolean }>(`/api/campaigns/${id}`, { method: 'DELETE' }),

  // Messages & Outbound
  composeMessage: (payload: {
    recipientId?: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    messageBody: string;
    attachments?: any[];
    campaignId?: string;
    campaignName?: string;
    scheduledTime?: string;
    approvalAction: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVE_AND_SCHEDULE';
  }) => fetchJson<ScheduledMessage>('/api/messages/compose', { method: 'POST', body: JSON.stringify(payload) }),
  approveMessage: (id: string) =>
    fetchJson<{ success: boolean; status: string }>(`/api/messages/${id}/approve`, { method: 'POST' }),
  sendNow: (payload: {
    recipientId?: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    messageBody: string;
    attachments?: any[];
    campaignId?: string;
    campaignName?: string;
    forceSendAgain?: boolean;
  }) =>
    fetchJson<{ success: boolean; gmailMessageId: string; gmailThreadId: string; sentAt: string }>(
      '/api/messages/send-now',
      { method: 'POST', body: JSON.stringify(payload) }
    ),

  // Scheduled queue
  getScheduledMessages: () => fetchJson<ScheduledMessage[]>('/api/scheduled'),
  retryScheduledMessage: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/api/scheduled/${id}/retry`, { method: 'POST' }),
  cancelScheduledMessage: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/scheduled/${id}`, { method: 'DELETE' }),

  // Sent messages
  getSentMessages: () => fetchJson<SentMessage[]>('/api/sent'),

  // Responses
  getResponses: () => fetchJson<IncomingMessage[]>('/api/responses'),
  syncResponses: () => fetchJson<{ success: boolean; newReplies: number }>('/api/responses/sync', { method: 'POST' }),
  updateResponseStatus: (id: string, userResponseStatus: 'PENDING' | 'DRAFTED' | 'SENT' | 'IGNORED') =>
    fetchJson<{ success: boolean }>(`/api/responses/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ userResponseStatus }),
    }),

  // Follow-ups
  getFollowUps: () => fetchJson<{ rules: FollowUpRule[]; instances: FollowUpInstance[] }>('/api/follow-ups'),
  createFollowUpRule: (rule: Partial<FollowUpRule>) =>
    fetchJson<FollowUpRule>('/api/follow-ups', { method: 'POST', body: JSON.stringify(rule) }),
  toggleFollowUpRule: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/follow-ups/${id}/toggle`, { method: 'PUT' }),

  // Templates
  getTemplates: () => fetchJson<Template[]>('/api/templates'),
  createTemplate: (template: Partial<Template>) =>
    fetchJson<Template>('/api/templates', { method: 'POST', body: JSON.stringify(template) }),
  deleteTemplate: (id: string) => fetchJson<{ success: boolean }>(`/api/templates/${id}`, { method: 'DELETE' }),

  // Files
  getFiles: () => fetchJson<StoredFile[]>('/api/files'),
  uploadFile: (file: {
    name: string;
    filename?: string;
    size: number;
    mimeType: string;
    category?: string;
    bufferBase64?: string;
    dataBase64?: string;
    isDefaultResume?: boolean;
  }) => fetchJson<StoredFile>('/api/files/upload', { method: 'POST', body: JSON.stringify(file) }),
  deleteFile: (id: string) => fetchJson<{ success: boolean }>(`/api/files/${id}`, { method: 'DELETE' }),
  setDefaultResume: (id: string) =>
    fetchJson<{ success: boolean; id: string; isDefaultResume: boolean }>(`/api/files/${id}/default-resume`, {
      method: 'PUT',
    }),
  getDriveFiles: (searchQuery?: string) =>
    fetchJson<any[]>(`/api/drive/files${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`),
  importDriveFile: (payload: {
    driveFileId: string;
    name: string;
    mimeType: string;
    size?: number;
    category?: string;
    isDefaultResume?: boolean;
  }) => fetchJson<StoredFile>('/api/drive/import', { method: 'POST', body: JSON.stringify(payload) }),
  getFileDownloadUrl: (id: string) => `/api/files/${id}/download`,
  importSheetContacts: (spreadsheetId: string, range?: string) =>
    fetchJson<{ success: boolean; count: number }>('/api/sheets/import-contacts', {
      method: 'POST',
      body: JSON.stringify({ spreadsheetId, range }),
    }),

  // Gemini AI Assistant
  aiImprove: (content: string, instruction: string, contactContext?: any) =>
    fetchJson<{ text: string }>('/api/ai/improve', {
      method: 'POST',
      body: JSON.stringify({ content, instruction, contactContext }),
    }),
  aiSubject: (content: string, role?: string, organization?: string, candidateName?: string) =>
    fetchJson<{ subjects: string[] }>('/api/ai/subject', {
      method: 'POST',
      body: JSON.stringify({ content, role, organization, candidateName }),
    }),
  aiPersonalize: (template: string, contact: Contact) =>
    fetchJson<{ text: string }>('/api/ai/personalize', {
      method: 'POST',
      body: JSON.stringify({ template, contact }),
    }),
  aiFollowUp: (originalSubject: string, originalBody: string, stepNumber: number, contactName?: string) =>
    fetchJson<{ subject: string; body: string }>('/api/ai/follow-up', {
      method: 'POST',
      body: JSON.stringify({ originalSubject, originalBody, stepNumber, contactName }),
    }),
  aiSummarizeJD: (jdText: string) =>
    fetchJson<{ keyRequirements: string[]; recommendedAngle: string; matchedSkills: string }>('/api/ai/summarize-jd', {
      method: 'POST',
      body: JSON.stringify({ jdText }),
    }),
  aiDraftResponse: (incomingSubject: string, incomingBody: string, originalOutreach: string) =>
    fetchJson<{ draft: string }>('/api/ai/draft-response', {
      method: 'POST',
      body: JSON.stringify({ incomingSubject, incomingBody, originalOutreach }),
    }),
  aiChat: (message: string, history?: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    fetchJson<{ success: boolean; reply: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  // Settings
  getSettings: () => fetchJson<UserSettings>('/api/settings'),
  updateSettings: (settings: UserSettings) =>
    fetchJson<{ success: boolean; settings: UserSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Notifications & Audit
  getNotifications: () => fetchJson<NotificationItem[]>('/api/notifications'),
  readAllNotifications: () => fetchJson<{ success: boolean }>('/api/notifications/read-all', { method: 'POST' }),
  getAuditLogs: () => fetchJson<AuditLog[]>('/api/audit-logs'),

  // Admin Controls
  getSystemStatus: () => fetchJson<any>('/api/admin/system'),
  resetSystemData: () => fetchJson<{ success: boolean; message: string }>('/api/admin/reset-data', { method: 'POST' }),
};
