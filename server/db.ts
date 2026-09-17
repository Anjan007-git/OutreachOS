import 'dotenv/config';
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
  let cleaned = String(val).trim();
  if (cleaned === '' || cleaned === 'undefined' || cleaned === 'null') return undefined;
  // Strip enclosing single or double quotes
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // If the value was accidentally pasted with an explicit variable name prefix (e.g. KV_REST_API_TOKEN=xxx),
  // strip only known variable prefixes without destroying base64 '=' or '==' padding in the secret token!
  const knownPrefix = /^(?:KV_REST_API_URL|KV_REST_API_TOKEN|UPSTASH_REDIS_REST_URL|UPSTASH_REDIS_REST_TOKEN|KV_URL|KV_TOKEN|REDIS_URL|REDIS_TOKEN)\s*=\s*(.*)$/i;
  const match = cleaned.match(knownPrefix);
  if (match) {
    cleaned = match[1].trim().replace(/^["']|["']$/g, '').trim();
  }
  if (cleaned === '' || cleaned === 'undefined' || cleaned === 'null') return undefined;
  return cleaned || undefined;
}

export function getUpstashCredentials(): { url?: string; token?: string } {
  // Read exact environment variables as primary source of truth:
  // process.env.KV_REST_API_URL and process.env.KV_REST_API_TOKEN
  const rawUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_URL ||
    process.env.REDIS_URL;

  const rawToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_TOKEN ||
    process.env.REDIS_TOKEN;

  let url = sanitizeEnvValue(rawUrl);
  let token = sanitizeEnvValue(rawToken);

  // If a full redis connection string was passed (e.g. rediss://default:token@host:port)
  if (url && (url.startsWith('redis://') || url.startsWith('rediss://'))) {
    const match = url.match(/^rediss?:\/\/(?:([^:]+):)?([^@]+)@([^:/]+)(?::\d+)?/);
    if (match) {
      token = token || match[2];
      url = `https://${match[3]}`;
    }
  }

  // Ensure URL starts with https:// if host only was provided (e.g. distinct-cat-12345.upstash.io)
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  if (url) {
    url = url.replace(/\/+$/, '');
  }

  return { url: url || undefined, token: token || undefined };
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

export const DEFAULT_TEMPLATES: Template[] = [
  // --- Category: HR & Recruitment ---
  {
    id: 'tpl-hr-1',
    name: 'HR Recruiter — Senior Engineering Role Inquiry',
    title: 'HR Recruiter — Senior Engineering Role Inquiry',
    category: 'HR & Recruitment',
    subject: 'Inquiry regarding {{role}} opening at {{company}} — {{my_name}}',
    body: `Hi {{first_name}},\n\nI hope you are having a productive week.\n\nI have been closely following {{company}}'s recent growth and engineering initiatives. I am reaching out to explore potential opportunities for the {{role}} position on your team.\n\nWith my background as a {{my_title}} specializing in high-availability systems, automated delivery pipelines, and cloud architecture, I am confident my experience would create immediate value for {{company}}.\n\nI have attached my resume for your review. Would you or someone from the recruitment team be available for a brief 10-minute introductory call next week?\n\nThank you for your time and consideration,\n{{my_name}}\n{{my_title}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_name', 'my_title', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-hr-2',
    name: 'Talent Acquisition — Direct Candidate Application',
    title: 'Talent Acquisition — Direct Candidate Application',
    category: 'HR & Recruitment',
    subject: 'Application: {{role}} position at {{company}} — {{my_name}}',
    body: `Dear {{first_name}},\n\nI hope this message finds you well.\n\nI am writing to submit my candidacy for the {{role}} opportunity at {{company}}. Your team's emphasis on engineering rigor and scalable technology resonates deeply with my professional values.\n\nAs a {{my_title}} with expertise in modern infrastructure and resilient distributed systems, I have delivered critical projects that decreased operational costs while accelerating deployment frequency. I would be thrilled to bring this dedication to {{company}}.\n\nMy resume is attached for your consideration. I would welcome the chance to discuss how my skill set aligns with {{company}}'s upcoming milestones.\n\nWarm regards,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_title', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-hr-3',
    name: 'Executive Search & Hiring Manager Introduction',
    title: 'Executive Search & Hiring Manager Introduction',
    category: 'HR & Recruitment',
    subject: '{{role}} Talent — {{my_name}} exploring opportunities at {{company}}',
    body: `Hi {{first_name}},\n\nI hope your week is off to a great start.\n\nGiven your focus leading talent acquisition and recruitment strategy at {{company}}, I wanted to reach out directly. Over the past several years as a {{my_title}}, I have spearheaded cloud infrastructure, systems automation, and cross-functional engineering teams.\n\nI have been following {{company}}'s developments in {{country}} with admiration. I would welcome an introductory conversation regarding strategic technical roles within {{company}} where my expertise can deliver measurable impact.\n\nI've attached my CV for your review. If your schedule allows, I'd be honored to connect briefly.\n\nBest regards,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_title', 'country', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },

  // --- Category: Engineering ---
  {
    id: 'tpl-eng-1',
    name: 'Cloud & Systems Infrastructure Outreach',
    title: 'Cloud & Systems Infrastructure Outreach',
    category: 'Engineering',
    subject: 'Cloud Architecture & Scalability at {{company}} — {{my_name}}',
    body: `Hi {{first_name}},\n\nI hope you're having a great week.\n\nI've been following {{company}}'s engineering advancements, particularly your focus on scalable infrastructure and service reliability. As a {{my_title}} with extensive hands-on experience designing cloud-native platforms, Kubernetes clusters, and automated CI/CD pipelines, I wanted to reach out regarding the {{role}} opening.\n\nIn my previous initiatives, I've successfully optimized cloud expenditures and boosted deployment velocity while maintaining 99.99% uptime. I am eager to apply these methodologies to help scale {{company}}'s engineering platforms.\n\nI've attached my resume highlighting technical projects and architectural achievements. Would you be open to a brief chat to discuss how I can contribute to {{company}}'s infrastructure?\n\nThanks for your time,\n{{my_name}}\n{{my_title}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_name', 'my_title', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-eng-2',
    name: 'Distributed Systems & Backend Engineering',
    title: 'Distributed Systems & Backend Engineering',
    category: 'Engineering',
    subject: 'High-Performance Distributed Systems at {{company}} — {{my_name}}',
    body: `Dear {{first_name}},\n\nI am reaching out because {{company}}'s technical architecture resonates strongly with my engineering philosophy.\n\nOver the past several years, I have architected distributed backend services, high-throughput message streaming pipelines, and fault-tolerant APIs. I thrive on untangling complex concurrency challenges, optimizing tail latencies, and delivering clean, maintainable systems code.\n\nI would love to learn more about the technical roadmap at {{company}} and explore how my expertise as a {{my_title}} could solve active challenges for the {{role}} team.\n\nAttached is my resume for your review. Thank you for your consideration, and I look forward to the possibility of speaking soon.\n\nSincerely,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_title', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-eng-3',
    name: 'Engineering Manager & Tech Lead Outreach',
    title: 'Engineering Manager & Tech Lead Outreach',
    category: 'Engineering',
    subject: '{{company}} Engineering: {{role}} inquiry from {{my_name}}',
    body: `Hi {{first_name}},\n\nI hope all is well with you and your engineering team at {{company}}.\n\nI noticed that {{company}} is expanding its {{department}} engineering team. Having led systems initiatives and mentored engineers in fast-paced production environments, I admire the high engineering bar your organization maintains.\n\nWhether modernizing legacy pipelines or architecting distributed microservices, my focus as a {{my_title}} has always been pairing architectural rigor with rapid business delivery. I would be thrilled to bring this background to {{company}} for the {{role}} opening.\n\nMy resume is attached for your convenience. Would you be open to connecting for 10 minutes next week?\n\nBest regards,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'department', 'role', 'my_title', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-eng-4',
    name: 'Site Reliability Engineering & DevOps Outreach',
    title: 'Site Reliability Engineering & DevOps Outreach',
    category: 'Engineering',
    subject: 'SRE & Platform Reliability at {{company}} — {{my_name}}',
    body: `Hi {{first_name}},\n\nI hope you're having a productive week.\n\nI'm reaching out because I've been admiring {{company}}'s engineering uptime and technical reliability. As a {{my_title}} passionate about observability, infrastructure-as-code, and automated incident recovery, I am eager to explore the {{role}} opening.\n\nIn my recent engagements, I've designed automated rollback mechanisms, Terraform infrastructure, and zero-downtime release pipelines. I would love the chance to support {{company}}'s mission with these capabilities.\n\nI've attached my CV for your review. Looking forward to connecting if your schedule allows.\n\nBest regards,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'role', 'my_title', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },

  // --- Category: International University ---
  {
    id: 'tpl-univ-1',
    name: 'Graduate Research & Lab Assistantship Inquiry',
    title: 'Graduate Research & Lab Assistantship Inquiry',
    category: 'International University',
    subject: 'Prospective Graduate Researcher: {{department}} at {{company}} — {{my_name}}',
    body: `Dear Professor {{first_name}},\n\nI hope this email finds you well.\n\nI have been following your research group's publications at {{company}} with keen admiration, especially your recent work in {{department}}. Your contributions to the academic community have significantly inspired my own research ambitions.\n\nWith an extensive background in systems engineering and computational analysis, I am preparing my application for graduate studies at {{company}} in {{country}}. I am writing to inquire if you anticipate openings for graduate research assistants or Ph.D. advisees in your laboratory for the upcoming academic cycle.\n\nI have attached my academic CV, research statement, and publication summaries for your review. Thank you very much for your time and guidance.\n\nRespectfully yours,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'department', 'country', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-univ-2',
    name: 'Faculty Fellowship & Postdoctoral Inquiry',
    title: 'Faculty Fellowship & Postdoctoral Inquiry',
    category: 'International University',
    subject: 'Inquiry regarding Research Fellowships in {{department}} — {{my_name}}',
    body: `Dear Dr. {{first_name}},\n\nI hope you are having a wonderful semester at {{company}}.\n\nI am writing to inquire about potential visiting researcher or postdoctoral fellowship opportunities within the {{department}} at {{company}}. Having led technical and research projects in distributed computing and systems engineering, I believe my methodology would synergize effectively with your group's ongoing research initiatives.\n\nI have attached my curriculum vitae detailing my publications, technical patents, and academic milestones. I would be deeply grateful for the opportunity to discuss how I might contribute to {{company}}'s academic research.\n\nThank you very much for your consideration.\n\nWarm regards,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'department', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'tpl-univ-3',
    name: 'International Admissions & Scholarship Office Inquiry',
    title: 'International Admissions & Scholarship Office Inquiry',
    category: 'International University',
    subject: 'International Graduate Admissions Inquiry: {{department}} — {{my_name}}',
    body: `Dear Admissions Team at {{company}},\n\nI hope this message finds you well.\n\nI am preparing my graduate application for the {{department}} program at {{company}} for the upcoming academic year. As an international applicant from {{country}}, I am writing to confirm specific prerequisite requirements, international merit scholarship deadlines, and potential tuition assistantship avenues.\n\nI have attached my academic transcripts and preliminary CV for reference. Any guidance or informational materials you could share regarding international candidate funding would be immensely appreciated.\n\nThank you for your assistance and support.\n\nSincerely,\n{{my_name}}\n{{my_email}}`,
    variables: ['first_name', 'company', 'department', 'country', 'my_name', 'my_email'],
    isGlobal: true,
    createdAt: '2026-09-17T00:00:00.000Z',
  },
];

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

export const DEFAULT_CAMPAIGN: Campaign = {
  id: 'camp-direct-outreach',
  name: 'Direct Cold Outreach',
  description: 'Default outreach campaign for direct cold emails dispatched via connected Gmail.',
  type: 'JOB_OUTREACH',
  recipientIds: [],
  subject: 'Inquiry regarding opportunities — {{my_name}}',
  message: `Hi {{first_name}},\n\nI hope you are doing well.\n\nI am reaching out to explore potential opportunities at {{company}}. My background in cloud systems, software engineering, and infrastructure aligns well with your team's initiatives.\n\nBest regards,\n{{my_name}}`,
  attachments: [],
  scheduleType: 'immediate',
  dailyLimit: 10,
  delayMinutes: 10,
  sentCount: 0,
  replyCount: 0,
  status: 'ACTIVE',
  createdAt: '2026-09-08T14:36:16.953Z',
  updatedAt: '2026-09-08T14:36:16.953Z',
};

export const DEFAULT_FOLLOW_UP_RULES: FollowUpRule[] = [
  {
    id: 'fu-default-1',
    campaignId: 'camp-direct-outreach',
    campaignName: 'Direct Cold Outreach',
    stepNumber: 1,
    daysAfterPrevious: 3,
    subjectTemplate: 'Following up regarding my previous note — {{my_name}}',
    messageTemplate: `Hi {{first_name}},\n\nI wanted to gently follow up on my note from earlier this week in case it got buried in your inbox. I'd still be delighted to connect briefly if you or your team have a few minutes.\n\nBest regards,\n{{my_name}}`,
    status: 'ACTIVE',
    stopOnReply: true,
  },
];

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
    campaigns: [DEFAULT_CAMPAIGN],
    campaign_recipients: [],
    messages: [],
    scheduled_messages: [],
    sent_messages: [],
    attachments: [],
    templates: DEFAULT_TEMPLATES,
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
    follow_ups: DEFAULT_FOLLOW_UP_RULES,
    follow_up_instances: [],
    notifications: [],
    audit_logs: [],
    settings: DEFAULT_SETTINGS,
  };
}

function mergeWithSchemaDefaults(parsed: any): DatabaseSchema {
  const initial = getInitialData();
  const loadedSettings = parsed?.settings || {};

  const ADMIN_ID = 'user-1';
  const ADMIN_EMAIL = 'anjanp93722@gmail.com';

  const rawContacts = Array.isArray(parsed?.contacts) ? parsed.contacts : [];
  const contacts = rawContacts.map((c: any) => ({
    ...c,
    userId: c.userId || ADMIN_ID,
    userEmail: c.userEmail || ADMIN_EMAIL,
  }));

  const rawCampaigns = Array.isArray(parsed?.campaigns) && parsed.campaigns.length > 0 ? parsed.campaigns : [DEFAULT_CAMPAIGN];
  const campaigns = rawCampaigns.map((c: any) => ({
    ...c,
    userId: c.userId || ADMIN_ID,
    userEmail: c.userEmail || ADMIN_EMAIL,
  }));

  const rawSent = Array.isArray(parsed?.sent_messages) ? parsed.sent_messages : [];
  const sent_messages = rawSent.map((s: any) => ({
    ...s,
    userId: s.userId || ADMIN_ID,
    userEmail: s.userEmail || ADMIN_EMAIL,
    body: s.body || s.messageBody,
  }));

  const existingTemplates = Array.isArray(parsed?.templates) ? parsed.templates : [];
  const existingIds = new Set(existingTemplates.map((t: any) => t.id));
  const missingDefaults = DEFAULT_TEMPLATES.filter((dt) => !existingIds.has(dt.id));
  const rawTemplates = [...existingTemplates, ...missingDefaults];
  const templates = rawTemplates.map((t: any) => ({
    ...t,
    name: t.name || t.title || 'Untitled Template',
    title: t.title || t.name || 'Untitled Template',
    category: t.category || 'Job Outreach',
    userId: t.userId || ADMIN_ID,
    isGlobal: t.isGlobal !== undefined ? t.isGlobal : true,
  }));

  const rawScheduled = Array.isArray(parsed?.scheduled_messages) ? parsed.scheduled_messages : [];
  const scheduled_messages = rawScheduled.map((m: any) => ({
    ...m,
    userId: m.userId || ADMIN_ID,
    userEmail: m.userEmail || ADMIN_EMAIL,
  }));

  const rawIncoming = Array.isArray(parsed?.incoming_messages) ? parsed.incoming_messages : [];
  const incoming_messages = rawIncoming.map((r: any) => ({
    ...r,
    userId: r.userId || ADMIN_ID,
    userEmail: r.userEmail || ADMIN_EMAIL,
  }));

  const rawFollowUps = Array.isArray(parsed?.follow_ups) && parsed.follow_ups.length > 0 ? parsed.follow_ups : DEFAULT_FOLLOW_UP_RULES;
  const follow_ups = rawFollowUps.map((f: any) => ({
    ...f,
    userId: f.userId || ADMIN_ID,
    userEmail: f.userEmail || ADMIN_EMAIL,
  }));

  return {
    ...initial,
    ...(parsed || {}),
    _fresh_clean_v2: true,
    users: [
      {
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
        name: 'Anjan Prajapati',
        role: 'ADMIN',
      },
      ...(Array.isArray(parsed?.users) ? parsed.users.filter((u: any) => u.email !== ADMIN_EMAIL) : []),
    ],
    contacts,
    campaigns,
    campaign_recipients: Array.isArray(parsed?.campaign_recipients) ? parsed.campaign_recipients : [],
    messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
    scheduled_messages,
    sent_messages,
    attachments: Array.isArray(parsed?.attachments) ? parsed.attachments : [],
    templates,
    email_threads: Array.isArray(parsed?.email_threads) ? parsed.email_threads : [],
    incoming_messages,
    follow_ups,
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

export class Database {
  private data: DatabaseSchema;
  private isLoadedFromStorage = false;
  private lastLoadedTime = 0;
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
        this.lastLoadedTime = Date.now();
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
      // Strip any raw OAuth access tokens before writing to local file to avoid committing secrets
      const sanitized: DatabaseSchema = {
        ...dataToSave,
        gmail_accounts: Array.isArray(dataToSave.gmail_accounts)
          ? dataToSave.gmail_accounts.map((acc) => ({
              ...acc,
              accessToken: '', // Keep live tokens in memory/Redis only, never in disk files
            }))
          : [],
      };
      const tmpFile = `${DEFAULT_DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(sanitized, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DEFAULT_DB_FILE);
    } catch (err: any) {
      // In serverless or read-only container environments, disk writes may be blocked.
      // In-memory state remains fully intact.
      if (err?.code !== 'EROFS') {
        console.warn('Warning: Could not save to local db.json:', err?.message || err);
      }
    }
  }

  /**
   * Ensures the database state is synchronized with the primary storage engine.
   * In production, this loads from Upstash Redis if configured, or gracefully
   * falls back to persistent local storage / clean initial state.
   * Concurrent in-flight calls are deduplicated via loadPromise, and transient
   * connection delays are retried with exponential backoff.
   */
  public async ensureLoaded(forceRefresh = false): Promise<DatabaseSchema> {
    if (this.loadPromise && !forceRefresh) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      const redis = getRedisClient();

      if (redis) {
        const now = Date.now();
        if (!this.isLoadedFromStorage || forceRefresh || now - this.lastLoadedTime > 3000) {
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
              this.lastLoadedTime = Date.now();
              return this.data;
            } catch (err: any) {
              lastErr = err;
              attempts++;
              console.warn(`Upstash Redis load attempt ${attempts}/${maxAttempts} warning:`, err?.message || err);
              if (attempts < maxAttempts) {
                await new Promise((r) => setTimeout(r, attempts * 150));
              }
            }
          }

          console.warn('Upstash Redis load unreachable after retries, using local/in-memory fallback:', lastErr?.message || lastErr);
          this.loadFromLocalFile();
        }
        return this.data;
      }

      // No Upstash Redis configured: use persistent local storage / memory state
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
   * If Upstash Redis is configured, saves to Redis.
   * Gracefully falls back to local disk and in-memory storage, never throwing unhandled errors.
   */
  public saveData(dataToSave: DatabaseSchema): Promise<void> {
    const savePromise = (async () => {
      const redis = getRedisClient();

      if (redis) {
        try {
          await redis.set(UPSTASH_DB_KEY, JSON.stringify(dataToSave));
          // Also sync local file for persistent backups
          this.saveToLocalFile(dataToSave);
        } catch (err: any) {
          console.warn('Warning: Failed to persist to Upstash Redis, falling back to local file/memory:', err?.message || err);
          this.saveToLocalFile(dataToSave);
        }
        return;
      }

      // Local development / container file save
      this.saveToLocalFile(dataToSave);
    })();

    this.pendingSave = savePromise;
    return savePromise;
  }

  /**
   * Awaits any pending writes to Upstash Redis before sending responses.
   * Safely catches any transient delay so callers never crash.
   */
  public async flush(): Promise<void> {
    if (this.pendingSave) {
      try {
        await this.pendingSave;
      } catch (err: any) {
        console.warn('db.flush notice:', err?.message || err);
      } finally {
        this.pendingSave = null;
      }
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): void {
    this.data[key] = value;
    this.saveData(this.data).catch((err) => {
      console.warn('Background saveData error in set:', err?.message || err);
    });
  }

  public update<K extends keyof DatabaseSchema>(
    key: K,
    updater: (prev: DatabaseSchema[K]) => DatabaseSchema[K]
  ): DatabaseSchema[K] {
    this.data[key] = updater(this.data[key]);
    this.saveData(this.data).catch((err) => {
      console.warn('Background saveData error in update:', err?.message || err);
    });
    return this.data[key];
  }

  public async updateAsync<K extends keyof DatabaseSchema>(
    key: K,
    updater: (prev: DatabaseSchema[K]) => DatabaseSchema[K]
  ): Promise<DatabaseSchema[K]> {
    this.data[key] = updater(this.data[key]);
    await this.saveData(this.data).catch((err) => {
      console.warn('Background saveData error in updateAsync:', err?.message || err);
    });
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
