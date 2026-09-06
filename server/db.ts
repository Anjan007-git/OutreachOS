import fs from 'fs';
import path from 'path';
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
  NotificationItem,
  AuditLog,
  GmailAccount,
} from '../src/types.js';

export interface DatabaseSchema {
  _fresh_clean_v2?: boolean;
  users: Array<{ id: string; email: string; name: string; role?: 'USER' | 'ADMIN' }>;
  contacts: Contact[];
  campaigns: Campaign[];
  campaign_recipients: Array<{ campaignId: string; contactId: string; status: string; sentAt?: string }>;
  messages: Array<any>;
  scheduled_messages: ScheduledMessage[];
  sent_messages: SentMessage[];
  attachments: StoredFile[];
  templates: Template[];
  gmail_accounts: (GmailAccount & { accessToken?: string; refreshToken?: string })[];
  email_threads: Array<{ threadId: string; contactEmail: string; campaignId?: string; lastMessageAt: string; messageCount: number }>;
  incoming_messages: IncomingMessage[];
  follow_ups: FollowUpRule[];
  follow_up_instances: FollowUpInstance[];
  notifications: NotificationItem[];
  audit_logs: AuditLog[];
  settings: UserSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    name: 'Anjan Prajapati',
    title: 'Senior Cloud & Systems Engineer',
    email: 'anjanp93722@gmail.com',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    education: '',
    skills: '',
    targetRoles: '',
    targetCountries: '',
  },
  email: {
    defaultSignature: `Best regards,\nAnjan Prajapati`,
  },
  automation: {
    dailyLimit: 10,
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
  defaultSignature: `Best regards,\nAnjan Prajapati`,
  sendingLimits: {
    maxEmailsPerDay: 10,
    delaySecondsBetweenSends: 600,
    timezone: 'Asia/Kolkata',
  },
  aiSettings: {
    autoCategorizeReplies: true,
    suggestFollowUpReminders: true,
  },
};

function getInitialData(): DatabaseSchema {
  return {
    _fresh_clean_v2: true,
    users: [
      {
        id: 'user-admin',
        email: 'anjanp93722@gmail.com',
        name: 'Anjan Prajapati',
        role: 'ADMIN',
      },
    ],
    contacts: [],
    campaigns: [],
    campaign_recipients: [],
    messages: [],
    scheduled_messages: [],
    sent_messages: [],
    attachments: [],
    templates: [],
    gmail_accounts: [
      {
        isConnected: false,
        email: 'anjanp93722@gmail.com',
        displayName: 'Anjan Prajapati',
        lastSyncTime: undefined,
      },
    ],
    email_threads: [],
    incoming_messages: [],
    follow_ups: [],
    follow_up_instances: [],
    notifications: [],
    audit_logs: [],
    settings: DEFAULT_SETTINGS,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const loadedSettings = parsed.settings || {};

        // Check if data contains previous demo/seeded records
        const hasDemoContacts = Array.isArray(parsed.contacts) && parsed.contacts.some((c: any) => c.id === 'c-1' || c.email?.includes('stripe.com'));
        const hasDemoCampaigns = Array.isArray(parsed.campaigns) && parsed.campaigns.some((c: any) => c.id === 'camp-1');
        const isLegacy = !parsed._fresh_clean_v2 || hasDemoContacts || hasDemoCampaigns;

        const merged: DatabaseSchema = {
          ...getInitialData(),
          ...parsed,
          _fresh_clean_v2: true,
          // If legacy demo data is detected, clean to genuine zero-state
          contacts: isLegacy ? [] : (Array.isArray(parsed.contacts) ? parsed.contacts : []),
          campaigns: isLegacy ? [] : (Array.isArray(parsed.campaigns) ? parsed.campaigns : []),
          campaign_recipients: isLegacy ? [] : (Array.isArray(parsed.campaign_recipients) ? parsed.campaign_recipients : []),
          messages: isLegacy ? [] : (Array.isArray(parsed.messages) ? parsed.messages : []),
          scheduled_messages: isLegacy ? [] : (Array.isArray(parsed.scheduled_messages) ? parsed.scheduled_messages : []),
          sent_messages: isLegacy ? [] : (Array.isArray(parsed.sent_messages) ? parsed.sent_messages : []),
          attachments: isLegacy ? [] : (Array.isArray(parsed.attachments) ? parsed.attachments : []),
          templates: isLegacy ? [] : (Array.isArray(parsed.templates) ? parsed.templates : []),
          email_threads: isLegacy ? [] : (Array.isArray(parsed.email_threads) ? parsed.email_threads : []),
          incoming_messages: isLegacy ? [] : (Array.isArray(parsed.incoming_messages) ? parsed.incoming_messages : []),
          follow_ups: isLegacy ? [] : (Array.isArray(parsed.follow_ups) ? parsed.follow_ups : []),
          follow_up_instances: isLegacy ? [] : (Array.isArray(parsed.follow_up_instances) ? parsed.follow_up_instances : []),
          notifications: isLegacy ? [] : (Array.isArray(parsed.notifications) ? parsed.notifications : []),
          audit_logs: isLegacy ? [] : (Array.isArray(parsed.audit_logs) ? parsed.audit_logs : []),
          gmail_accounts: Array.isArray(parsed.gmail_accounts) && parsed.gmail_accounts.length > 0 ? parsed.gmail_accounts : getInitialData().gmail_accounts,
          settings: {
            ...DEFAULT_SETTINGS,
            ...loadedSettings,
            profile: { ...DEFAULT_SETTINGS.profile, ...(loadedSettings.profile || {}) },
            email: { ...DEFAULT_SETTINGS.email, ...(loadedSettings.email || {}) },
            automation: { ...DEFAULT_SETTINGS.automation, ...(loadedSettings.automation || {}) },
            ai: { ...DEFAULT_SETTINGS.ai, ...(loadedSettings.ai || {}) },
            defaultSignature: loadedSettings.defaultSignature || loadedSettings.email?.defaultSignature || DEFAULT_SETTINGS.defaultSignature,
            sendingLimits: {
              ...DEFAULT_SETTINGS.sendingLimits,
              ...(loadedSettings.sendingLimits || {}),
              maxEmailsPerDay: loadedSettings.sendingLimits?.maxEmailsPerDay ?? loadedSettings.automation?.dailyLimit ?? DEFAULT_SETTINGS.sendingLimits?.maxEmailsPerDay ?? 10,
              delaySecondsBetweenSends: loadedSettings.sendingLimits?.delaySecondsBetweenSends ?? (loadedSettings.automation?.delayMinutes ? loadedSettings.automation.delayMinutes * 60 : (DEFAULT_SETTINGS.sendingLimits?.delaySecondsBetweenSends ?? 600)),
              timezone: loadedSettings.sendingLimits?.timezone || loadedSettings.automation?.timezone || DEFAULT_SETTINGS.sendingLimits?.timezone || 'Asia/Kolkata',
            },
            aiSettings: {
              ...DEFAULT_SETTINGS.aiSettings,
              ...(loadedSettings.aiSettings || {}),
              autoCategorizeReplies: loadedSettings.aiSettings?.autoCategorizeReplies ?? loadedSettings.ai?.replyClassification ?? true,
              suggestFollowUpReminders: loadedSettings.aiSettings?.suggestFollowUpReminders ?? true,
            },
          },
        };

        if (isLegacy) {
          this.saveData(merged);
        }
        return merged;
      }
    } catch (err) {
      console.error('Failed to load existing db.json, initializing fresh data:', err);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  public resetUserData() {
    this.data.contacts = [];
    this.data.campaigns = [];
    this.data.campaign_recipients = [];
    this.data.messages = [];
    this.data.scheduled_messages = [];
    this.data.sent_messages = [];
    this.data.attachments = [];
    this.data.templates = [];
    this.data.email_threads = [];
    this.data.incoming_messages = [];
    this.data.follow_ups = [];
    this.data.follow_up_instances = [];
    this.data.notifications = [];
    this.data.audit_logs = [];
    this.data._fresh_clean_v2 = true;
    this.saveData(this.data);
    return true;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public update<K extends keyof DatabaseSchema>(
    key: K,
    updater: (prev: DatabaseSchema[K]) => DatabaseSchema[K]
  ) {
    this.data[key] = updater(this.data[key]);
    this.saveData(this.data);
    return this.data[key];
  }

  public logAudit(action: string, details: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS') {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
      status,
    };
    this.update('audit_logs', (logs) => [log, ...logs].slice(0, 500));
  }

  public addNotification(type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) {
    const notif: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.update('notifications', (notifs) => [notif, ...notifs].slice(0, 200));
  }

  public getDbFilePath(): string {
    return DB_FILE;
  }

  public getAllData(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
