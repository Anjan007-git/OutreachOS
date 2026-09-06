export type UserRole = 'ADMIN' | 'USER';

export type OrganizationType =
  | 'HR'
  | 'Recruiter'
  | 'Hiring Manager'
  | 'Company'
  | 'University'
  | 'Admissions'
  | 'International Office'
  | 'Scholarship Office'
  | 'Other';

export interface Contact {
  id: string;
  name: string;
  email: string;
  organization: string;
  organizationType: OrganizationType;
  role: string;
  country: string;
  website?: string;
  jobTitle?: string;
  jobUrl?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignType =
  | 'Job Outreach'
  | 'University Outreach'
  | 'Custom Outreach'
  | 'JOB_OUTREACH'
  | 'UNIVERSITY_ADMISSIONS'
  | 'CUSTOM';

export interface AttachmentRef {
  id: string;
  name: string;
  size: number;
  type: string;
  source: 'local' | 'drive';
  url?: string;
  dataBase64?: string;
  fileId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  recipientIds: string[];
  contactIds?: string[];
  subject: string;
  message: string;
  attachments: AttachmentRef[];
  scheduleType: 'immediate' | 'specific_time' | 'daily' | 'weekly' | 'weekdays' | 'custom';
  scheduleTime?: string;
  dailyLimit: number;
  dailySendingLimit?: number;
  delayMinutes: number;
  sentCount?: number;
  replyCount?: number;
  templateId?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export type MessageApprovalStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'QUEUED'
  | 'SENT'
  | 'FAILED'
  | 'CANCELLED';

export interface ScheduledMessage {
  id: string;
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  campaignId?: string;
  campaignName?: string;
  subject: string;
  messageBody: string;
  attachments: AttachmentRef[];
  scheduledTime: string; // ISO string
  status: MessageApprovalStatus;
  retryCount: number;
  error?: string;
  gmailMessageId?: string;
  gmailThreadId?: string;
  createdAt: string;
  sentTime?: string;
}

export interface SentMessage {
  id: string;
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  campaignId?: string;
  campaignName?: string;
  subject: string;
  messageBody: string;
  attachments: AttachmentRef[];
  gmailMessageId: string;
  gmailThreadId: string;
  sentAt: string;
  status: 'DELIVERED' | 'REPLIED' | 'BOUNCED';
}

export type ReplyClassification =
  | 'Positive'
  | 'Interview Request'
  | 'Meeting Request'
  | 'Request for Information'
  | 'Application Confirmation'
  | 'Rejection'
  | 'Follow-up Required'
  | 'Automated Reply'
  | 'Unclear';

export interface IncomingMessage {
  id: string;
  contactId?: string;
  contactName?: string;
  contactEmail: string;
  organization?: string;
  campaignId?: string;
  campaignName?: string;
  gmailMessageId: string;
  gmailThreadId: string;
  subject: string;
  snippet: string;
  bodyText: string;
  receivedDate: string;
  originalOutreachSnippet?: string;
  classification?: ReplyClassification;
  classificationReason?: string;
  aiDraftResponse?: string;
  userResponseStatus?: 'PENDING' | 'DRAFTED' | 'SENT' | 'IGNORED';
}

export interface FollowUpRule {
  id: string;
  campaignId: string;
  campaignName: string;
  stepNumber: number;
  daysAfterPrevious: number;
  subjectTemplate: string;
  messageTemplate: string;
  status: 'ACTIVE' | 'PAUSED';
  stopOnReply: boolean;
}

export interface FollowUpInstance {
  id: string;
  ruleId: string;
  contactId: string;
  contactEmail: string;
  contactName: string;
  campaignId: string;
  scheduledFor: string;
  status: 'SCHEDULED' | 'STOPPED_REPLY_RECEIVED' | 'SENT' | 'CANCELLED';
  previousMessageId?: string;
}

export interface Template {
  id: string;
  title: string;
  category: 'Job Outreach' | 'University' | 'Follow-up' | 'Networking';
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
}

export type FileCategory = 'Resume/CV' | 'Cover Letter' | 'SOP' | 'Transcript' | 'Certificates' | 'Portfolio' | 'Other';

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  source: 'local' | 'drive';
  category: FileCategory;
  uploadedAt: string;
  driveFileId?: string;
  dataBase64?: string;
}

export interface GmailAccount {
  isConnected: boolean;
  needsReauth?: boolean;
  email?: string;
  displayName?: string;
  lastSyncTime?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  education: string;
  skills: string;
  targetRoles: string;
  targetCountries: string;
}

export interface UserSettings {
  profile: UserProfile;
  email: {
    defaultSignature: string;
  };
  automation: {
    dailyLimit: number;
    delayMinutes: number;
    timezone: string;
    automaticSending: boolean;
    automaticFollowUp: boolean;
  };
  ai: {
    aiAssistance: boolean;
    personalization: boolean;
    replyClassification: boolean;
  };
  defaultSignature?: string;
  sendingLimits?: {
    maxEmailsPerDay: number;
    delaySecondsBetweenSends: number;
    timezone: string;
  };
  aiSettings?: {
    autoCategorizeReplies: boolean;
    suggestFollowUpReminders: boolean;
  };
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR';
}

export interface DashboardStats {
  totalContacts: number;
  scheduledCount: number;
  sentToday: number;
  totalSent: number;
  repliesCount: number;
  followUpsCount: number;
  failedCount: number;
  activeCampaigns: number;
  replyRatePercentage: number;
  recentActivities: {
    id: string;
    type: 'scheduled' | 'sent' | 'reply' | 'followup' | 'failed';
    title: string;
    timestamp: string;
    recipientOrContact: string;
  }[];
  sentOverTime: { date: string; sent: number; replies: number }[];
  outreachBreakdown: { name: string; count: number }[];
  topCountries: { country: string; count: number }[];
  contactsAddedThisWeek?: number;
  role?: UserRole;
  isAdmin?: boolean;
  dailyLimit?: number | 'UNLIMITED';
  remainingToday?: number | 'UNLIMITED';
}
