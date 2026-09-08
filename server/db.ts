import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
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

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data');
const DEFAULT_DB_FILE = path.join(DEFAULT_DATA_DIR, 'db.json');
export const UPSTASH_DB_KEY = 'outreachos:db:v2';

export function isProductionEnvironment(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) || process.env.NODE_ENV === 'production';
}

function sanitizeEnvValue(val?: string): string | undefined {
  if (!val) return undefined;
  let cleaned = val.trim();
  // Strip enclosing single or double quotes
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // If the value was accidentally pasted with an explicit variable name prefix (e.g. KV_REST_API_TOKEN=xxx),
  // strip only known variable prefixes without destroying base64 '=' or '==' padding in the secret token!
  const knownPrefix = /^(?:KV_REST_API_URL|KV_REST_API_TOKEN|UPSTASH_REDIS_REST_URL|UPSTASH_REDIS_REST_TOKEN|KV_URL|KV_TOKEN)\s*=\s*(.*)$/i;
  const match = cleaned.match(knownPrefix);
  if (match) {
    cleaned = match[1].trim().replace(/^["']|["']$/g, '').trim();
  }
  return cleaned || undefined;
}

export function getUpstashCredentials(): { url?: string; token?: string } {
  // Primary expected environment variable: KV_REST_API_URL
  // Intentionally supported fallbacks: UPSTASH_REDIS_REST_URL, KV_URL (if HTTP REST URL)
  const rawUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    (process.env.KV_URL && process.env.KV_URL.startsWith('http') ? process.env.KV_URL : undefined);

  // Primary expected environment variable: KV_REST_API_TOKEN
  // Intentionally supported fallbacks: UPSTASH_REDIS_REST_TOKEN, KV_TOKEN
  const rawToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_TOKEN;

  const url = sanitizeEnvValue(rawUrl);
  const token = sanitizeEnvValue(rawToken);
  return { url, token };
}

let redisClientInstance: Redis | null = null;
let lastUsedUrl: string | undefined = undefined;
let lastUsedToken: string | undefined = undefined;

export function getRedisClient(): Redis | null {
  const { url, token } = getUpstashCredentials();
  if (url && token) {
    if (!redisClientInstance || lastUsedUrl !== url || lastUsedToken !== token) {
      redisClientInstance = new Redis({ url, token });
      lastUsedUrl = url;
      lastUsedToken = token;
    }
    return redisClientInstance;
  }
  return null;
}

export function isUpstashConfigured(): boolean {
  const { url, token } = getUpstashCredentials();
  return Boolean(url && token);
}

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

export function getInitialData(): DatabaseSchema {
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

function mergeWithSchemaDefaults(parsed: any): DatabaseSchema {
  const initial = getInitialData();
  const loadedSettings = parsed?.settings || {};

  return {
    ...initial,
    ...(parsed || {}),
    _fresh_clean_v2: true,
    contacts: Array.isArray(parsed?.contacts) ? parsed.contacts : [],
    campaigns: Array.isArray(parsed?.campaigns) ? parsed.campaigns : [],
    campaign_recipients: Array.isArray(parsed?.campaign_recipients) ? parsed.campaign_recipients : [],
    messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
    scheduled_messages: Array.isArray(parsed?.scheduled_messages) ? parsed.scheduled_messages : [],
    sent_messages: Array.isArray(parsed?.sent_messages) ? parsed.sent_messages : [],
    attachments: Array.isArray(parsed?.attachments) ? parsed.attachments : [],
    templates: Array.isArray(parsed?.templates) ? parsed.templates : [],
    email_threads: Array.isArray(parsed?.email_threads) ? parsed.email_threads : [],
    incoming_messages: Array.isArray(parsed?.incoming_messages) ? parsed.incoming_messages : [],
    follow_ups: Array.isArray(parsed?.follow_ups) ? parsed.follow_ups : [],
    follow_up_instances: Array.isArray(parsed?.follow_up_instances) ? parsed.follow_up_instances : [],
    notifications: Array.isArray(parsed?.notifications) ? parsed.notifications : [],
    audit_logs: Array.isArray(parsed?.audit_logs) ? parsed.audit_logs : [],
    gmail_accounts:
      Array.isArray(parsed?.gmail_accounts) && parsed.gmail_accounts.length > 0
        ? parsed.gmail_accounts
        : initial.gmail_accounts,
    settings: {
      ...DEFAULT_SETTINGS,
      ...loadedSettings,
      profile: { ...DEFAULT_SETTINGS.profile, ...(loadedSettings.profile || {}) },
      email: { ...DEFAULT_SETTINGS.email, ...(loadedSettings.email || {}) },
      automation: { ...DEFAULT_SETTINGS.automation, ...(loadedSettings.automation || {}) },
      ai: { ...DEFAULT_SETTINGS.ai, ...(loadedSettings.ai || {}) },
      defaultSignature:
        loadedSettings.defaultSignature || loadedSettings.email?.defaultSignature || DEFAULT_SETTINGS.defaultSignature,
      sendingLimits: {
        ...DEFAULT_SETTINGS.sendingLimits,
        ...(loadedSettings.sendingLimits || {}),
        maxEmailsPerDay:
          loadedSettings.sendingLimits?.maxEmailsPerDay ??
          loadedSettings.automation?.dailyLimit ??
          DEFAULT_SETTINGS.sendingLimits?.maxEmailsPerDay ??
          10,
        delaySecondsBetweenSends:
          loadedSettings.sendingLimits?.delaySecondsBetweenSends ??
          (loadedSettings.automation?.delayMinutes
            ? loadedSettings.automation.delayMinutes * 60
            : DEFAULT_SETTINGS.sendingLimits?.delaySecondsBetweenSends ?? 600),
        timezone:
          loadedSettings.sendingLimits?.timezone ||
          loadedSettings.automation?.timezone ||
          DEFAULT_SETTINGS.sendingLimits?.timezone ||
          'Asia/Kolkata',
      },
      aiSettings: {
        ...DEFAULT_SETTINGS.aiSettings,
        ...(loadedSettings.aiSettings || {}),
        autoCategorizeReplies:
          loadedSettings.aiSettings?.autoCategorizeReplies ?? loadedSettings.ai?.replyClassification ?? true,
        suggestFollowUpReminders: loadedSettings.aiSettings?.suggestFollowUpReminders ?? true,
      },
    },
  };
}

class Database {
  private data: DatabaseSchema;
  private isLoadedFromStorage = false;
  private pendingSave: Promise<void> | null = null;
  private loadPromise: Promise<DatabaseSchema> | null = null;

  constructor() {
    this.data = getInitialData();
    // In local development, eagerly load local data if present
    if (!isProductionEnvironment()) {
      this.loadFromLocalFile();
    }
  }

  private loadFromLocalFile(): void {
    try {
      if (fs.existsSync(DEFAULT_DB_FILE)) {
        const raw = fs.readFileSync(DEFAULT_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = mergeWithSchemaDefaults(parsed);
        this.isLoadedFromStorage = true;
      }
    } catch (err) {
      console.warn('Could not load local db.json, using default state:', err);
    }
  }

  private saveToLocalFile(dataToSave: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DEFAULT_DATA_DIR)) {
        fs.mkdirSync(DEFAULT_DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DEFAULT_DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DEFAULT_DB_FILE);
    } catch (err) {
      console.warn('Warning: Could not save to local db.json:', err);
    }
  }

  /**
   * Ensures the database state is synchronized with the primary storage engine.
   * In production, this loads from Upstash Redis and throws a clear error if unavailable.
   * Concurrent in-flight calls are deduplicated via loadPromise, and transient connection
   * delays are retried with exponential backoff.
   */
  public async ensureLoaded(forceRefresh = false): Promise<DatabaseSchema> {
    if (this.loadPromise && !forceRefresh) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      const isProd = isProductionEnvironment();
      const redis = getRedisClient();

      if (redis) {
        if (!this.isLoadedFromStorage || forceRefresh) {
          let attempts = 0;
          const maxAttempts = 3;
          let lastErr: any = null;

          while (attempts < maxAttempts) {
            try {
              const raw = await redis.get<any>(UPSTASH_DB_KEY);
              if (raw) {
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                this.data = mergeWithSchemaDefaults(parsed);
              } else {
                // First time running on Upstash: seed with clean schema
                let seedData = getInitialData();
                if (fs.existsSync(DEFAULT_DB_FILE)) {
                  try {
                    const localRaw = fs.readFileSync(DEFAULT_DB_FILE, 'utf-8');
                    seedData = mergeWithSchemaDefaults(JSON.parse(localRaw));
                  } catch {}
                }
                this.data = seedData;
                await redis.set(UPSTASH_DB_KEY, JSON.stringify(seedData));
              }
              this.isLoadedFromStorage = true;
              return this.data;
            } catch (err: any) {
              lastErr = err;
              attempts++;
              console.warn(`Upstash Redis load attempt ${attempts}/${maxAttempts} failed:`, err.message);
              if (attempts < maxAttempts) {
                await new Promise((r) => setTimeout(r, attempts * 150));
              }
            }
          }

          console.error('Error loading data from Upstash Redis after retries:', lastErr);
          if (isProd) {
            throw new Error(`Production database unavailable: Failed to connect to Upstash Redis (${lastErr?.message || 'timeout/network error'})`);
          }
          // In development fallback to local file
          this.loadFromLocalFile();
        }
        return this.data;
      }

      // No Upstash Redis configured
      if (isProd) {
        throw new Error(
          'Production database unavailable: KV_REST_API_URL and KV_REST_API_TOKEN must be configured in environment.'
        );
      }

      // Development local storage
      if (!this.isLoadedFromStorage || forceRefresh) {
        this.loadFromLocalFile();
      }
      return this.data;
    })().finally(() => {
      this.loadPromise = null;
    });

    return this.loadPromise;
  }

  /**
   * Persists the current database state to the primary storage engine.
   * In production, this saves to Upstash Redis.
   */
  public saveData(dataToSave: DatabaseSchema): Promise<void> {
    const savePromise = (async () => {
      const isProd = isProductionEnvironment();
      const redis = getRedisClient();

      if (redis) {
        try {
          await redis.set(UPSTASH_DB_KEY, JSON.stringify(dataToSave));
          // In development, also sync local file for inspection
          if (!isProd) {
            this.saveToLocalFile(dataToSave);
          }
        } catch (err: any) {
          console.error('Failed to persist to Upstash Redis:', err);
          if (isProd) {
            throw new Error(`Production database persistence failed: ${err.message || 'Upstash error'}`);
          }
          this.saveToLocalFile(dataToSave);
        }
        return;
      }

      if (isProd) {
        throw new Error(
          'Production database persistence failed: KV_REST_API_URL and KV_REST_API_TOKEN are not configured.'
        );
      }

      // Local development file save
      this.saveToLocalFile(dataToSave);
    })();

    this.pendingSave = savePromise;
    return savePromise;
  }

  /**
   * Awaits any pending writes to Upstash Redis before sending responses.
   */
  public async flush(): Promise<void> {
    if (this.pendingSave) {
      await this.pendingSave;
      this.pendingSave = null;
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): void {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public update<K extends keyof DatabaseSchema>(
    key: K,
    updater: (prev: DatabaseSchema[K]) => DatabaseSchema[K]
  ): DatabaseSchema[K] {
    this.data[key] = updater(this.data[key]);
    this.saveData(this.data);
    return this.data[key];
  }

  public async updateAsync<K extends keyof DatabaseSchema>(
    key: K,
    updater: (prev: DatabaseSchema[K]) => DatabaseSchema[K]
  ): Promise<DatabaseSchema[K]> {
    this.data[key] = updater(this.data[key]);
    await this.saveData(this.data);
    return this.data[key];
  }

  public logAudit(action: string, details: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS'): void {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
      status,
    };
    this.update('audit_logs', (logs) => [log, ...logs].slice(0, 500));
  }

  public addNotification(type: 'info' | 'success' | 'warning' | 'error', title: string, message: string): void {
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

  public async resetUserData(): Promise<boolean> {
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
    await this.saveData(this.data);
    return true;
  }

  public getCounts() {
    return {
      contacts: this.data.contacts?.length || 0,
      campaigns: this.data.campaigns?.length || 0,
      scheduled: this.data.scheduled_messages?.length || 0,
      sent: this.data.sent_messages?.length || 0,
      replies: this.data.incoming_messages?.length || 0,
      followUps: this.data.follow_ups?.length || 0,
      files: this.data.attachments?.length || 0,
      templates: this.data.templates?.length || 0,
    };
  }

  public async getDbStatus() {
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const isProd = isVercel || process.env.NODE_ENV === 'production';
    const { url, token } = getUpstashCredentials();
    const isConfigured = Boolean(url && token);
    const redis = getRedisClient();

    if (redis) {
      try {
        const pingResult = await redis.ping();
        return {
          success: true,
          environment: isProd ? 'production' : 'development',
          database: {
            configured: true,
            connected: true,
            status: 'connected',
            provider: 'Upstash Redis/KV',
          },
          databaseProvider: 'Upstash Redis/KV',
          isPersistent: true,
          connected: true,
          ping: pingResult,
          version: '1.0.0',
          counts: this.getCounts(),
        };
      } catch (err: any) {
        return {
          success: false,
          environment: isProd ? 'production' : 'development',
          database: {
            configured: true,
            connected: false,
            status: 'error',
            provider: 'Upstash Redis/KV',
          },
          databaseProvider: 'Upstash Redis/KV',
          isPersistent: true,
          connected: false,
          error: `Upstash Redis connection error: ${err.message || 'Unknown error'}`,
          version: '1.0.0',
          counts: this.getCounts(),
        };
      }
    }

    if (isProd) {
      return {
        success: false,
        environment: 'production',
        database: {
          configured: isConfigured,
          connected: false,
          status: isConfigured ? 'error' : 'unconfigured',
          provider: 'Upstash Redis/KV',
        },
        databaseProvider: 'Upstash Redis/KV',
        isPersistent: false,
        connected: false,
        error: 'Upstash Redis credentials (KV_REST_API_URL, KV_REST_API_TOKEN) are missing or incomplete in production environment.',
        version: '1.0.0',
        counts: this.getCounts(),
      };
    }

    return {
      success: true,
      environment: 'development',
      database: {
        configured: isConfigured,
        connected: true,
        status: 'connected',
        provider: 'Persistent Storage (Local)',
      },
      databaseProvider: 'Persistent Storage (Local)',
      isPersistent: true,
      connected: true,
      path: DEFAULT_DB_FILE,
      version: '1.0.0',
      counts: this.getCounts(),
    };
  }

  public getDbFilePath(): string {
    return DEFAULT_DB_FILE;
  }

  public getAllData(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
