import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { db, isProductionEnvironment, isUpstashConfigured, getRedisClient } from './db.js';
import {
  getGmailProfile,
  sendGmailMessage,
  listGoogleDriveFiles,
  readGoogleSpreadsheet,
} from './gmail.js';
import {
  improveMessage,
  generateSubject,
  personalizeMessage,
  generateFollowUp,
  summarizeJobDescription,
  draftReplyResponse,
} from './gemini.js';
import {
  syncGmailReplies,
  isUserAdmin,
  checkSendingPermission,
  ADMIN_EMAIL,
  isDuplicateSend,
  processOutboundQueue,
} from './scheduler.js';
import { Contact, Campaign, ScheduledMessage, SentMessage, StoredFile, Template, FollowUpRule } from '../src/types.js';

export function normalizeUrl(req: any): string {
  let rawUrl = (req && req.url) || '/';
  const headers = (req && req.headers) || {};

  // Bypass normalization entirely for Vite internal routes and frontend assets
  const pathWithoutQuery = rawUrl.split('?')[0];
  if (
    rawUrl.startsWith('/@') ||
    rawUrl.startsWith('/src/') ||
    rawUrl.startsWith('/node_modules/') ||
    rawUrl.startsWith('/assets/') ||
    rawUrl === '/' ||
    rawUrl === '/index.html' ||
    /\.(tsx?|jsx?|css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|map|json)$/i.test(pathWithoutQuery)
  ) {
    return rawUrl;
  }

  // If rawUrl is generic (root / or just the serverless entrypoint /api or /api/index),
  // inspect proxy headers for the real original client URI
  const isGeneric =
    rawUrl === '/' ||
    rawUrl === '/api' ||
    rawUrl === '/api/' ||
    rawUrl === '/api/index' ||
    rawUrl === '/api/index/' ||
    rawUrl.startsWith('/api/index?') ||
    rawUrl.startsWith('/api?');

  if (isGeneric) {
    const candidateHeader =
      headers['x-matched-path'] ||
      headers['x-forwarded-uri'] ||
      headers['x-original-url'] ||
      headers['x-invoke-path'] ||
      headers['x-rewrite-url'];

    if (
      typeof candidateHeader === 'string' &&
      candidateHeader.startsWith('/api/') &&
      candidateHeader !== '/api/index' &&
      candidateHeader !== '/api/' &&
      candidateHeader !== '/api'
    ) {
      const search = rawUrl.includes('?') ? rawUrl.substring(rawUrl.indexOf('?')) : '';
      rawUrl = candidateHeader.split('?')[0] + search;
    } else if (typeof headers['x-now-route-matches'] === 'string') {
      const match = headers['x-now-route-matches'].match(/(?:^|&)1=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        const search = rawUrl.includes('?') ? rawUrl.substring(rawUrl.indexOf('?')) : '';
        rawUrl = '/api/' + decoded.replace(/^\/+/, '') + search;
      }
    }
  }

  // Separate pathname from query string safely
  let pathname = rawUrl;
  let queryString = '';
  const qIdx = rawUrl.indexOf('?');
  if (qIdx !== -1) {
    pathname = rawUrl.substring(0, qIdx);
    queryString = rawUrl.substring(qIdx + 1);
  }

  // Check if ?path= was passed in query (e.g. from legacy rewrite rules)
  const searchParams = new URLSearchParams(queryString);
  const pathParam = (req && req.query && req.query.path) || searchParams.get('path');
  if (pathParam && (pathname === '/api' || pathname === '/api/' || pathname === '/api/index' || pathname === '/' || pathname === '')) {
    const subpath = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam);
    pathname = '/api/' + subpath.replace(/^\/+/, '');
    searchParams.delete('path');
    queryString = searchParams.toString();
  }

  // Normalize duplicate or misplaced prefixes
  pathname = pathname
    .replace(/^\/api\/api(?=\/|$)/, '/api')
    .replace(/^\/api\/index\//, '/api/')
    .replace(/^\/api\/index(?=\/|$)/, '/api')
    .replace(/^\/index(?=\/|$)/, '');

  // Normalize multiple slashes (e.g. //api///contacts -> /api/contacts)
  pathname = pathname.replace(/\/{2,}/g, '/');

  // Ensure leading /api prefix for API routes
  if (!pathname.startsWith('/api') && pathname !== '/' && pathname !== '') {
    if (
      !pathname.startsWith('/@') &&
      !pathname.startsWith('/src/') &&
      !pathname.startsWith('/node_modules/') &&
      !pathname.startsWith('/assets/') &&
      !/\.(tsx?|jsx?|css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|map|json|html)$/i.test(pathname)
    ) {
      pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
    }
  }

  return pathname + (queryString ? '?' + queryString : '');
}

export function createApp(): express.Application {
  const app = express();

  // URL normalization middleware for Vercel serverless functions and local dev
  app.use((req, res, next) => {
    req.url = normalizeUrl(req);
    next();
  });

  // Middleware for parsing JSON with 25MB limit for attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS and JSON Headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Email');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Database synchronization & persistence middleware
  app.use(async (req, res, next) => {
    const rawUrl = req.url || '';
    const reqPath = req.path || '';

    // 1. Health check bypass: /api/health and /health must always reach the health check handler
    // to provide safe diagnostics, even if the database is currently unconfigured or initializing.
    if (
      reqPath === '/health' ||
      reqPath === '/api/health' ||
      rawUrl.startsWith('/api/health') ||
      rawUrl.includes('path=health')
    ) {
      return next();
    }

    try {
      await db.ensureLoaded();
    } catch (err: any) {
      // 2. Auth routes (/api/auth/connect-google, /api/auth/status):
      // Do not block Gmail OAuth callback/connection flow if database initialization is delayed or warming up
      const isAuthRoute =
        reqPath.startsWith('/auth') ||
        reqPath.startsWith('/api/auth') ||
        rawUrl.includes('/api/auth') ||
        rawUrl.includes('path=auth');

      if (isAuthRoute) {
        console.warn('Proceeding with auth route despite database delay/warning:', err.message);
        return next();
      }

      if (isProductionEnvironment()) {
        return res.status(503).json({
          success: false,
          error: `Database unavailable: ${err.message}`,
          environment: 'production',
          database: {
            configured: isUpstashConfigured(),
            connected: false,
            status: 'error',
          },
          databaseProvider: 'Upstash Redis/KV',
        });
      }
    }

    // Intercept response to guarantee any pending Upstash Redis write is flushed before responding
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    let flushed = false;
    const ensureFlushed = async () => {
      if (!flushed) {
        flushed = true;
        await db.flush();
      }
    };

    res.json = function (body: any) {
      ensureFlushed()
        .then(() => originalJson(body))
        .catch((err: any) => {
          console.error('Failed to flush database to Upstash before sending JSON:', err);
          if (isProductionEnvironment() && !res.headersSent) {
            res.status(500);
            return originalJson({ success: false, error: `Database persistence error: ${err.message}` });
          }
          return originalJson(body);
        });
      return res;
    };

    res.send = function (body: any) {
      ensureFlushed()
        .then(() => originalSend(body))
        .catch((err: any) => {
          console.error('Failed to flush database to Upstash before sending response:', err);
          return originalSend(body);
        });
      return res;
    };

    next();
  });

  const apiRouter = express.Router();

  // ================= HEALTH CHECK (Diagnostic Endpoint) =================
  const handleHealthCheck = (req: express.Request, res: express.Response) => {
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

    const hasUrl = Boolean(rawUrl && String(rawUrl).trim() !== '' && String(rawUrl).trim() !== 'undefined');
    const hasToken = Boolean(rawToken && String(rawToken).trim() !== '' && String(rawToken).trim() !== 'undefined');
    const configured = hasUrl && hasToken;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).json({
      database: {
        configured,
      },
    });
  };

  app.get('/health', handleHealthCheck);
  apiRouter.get('/health', handleHealthCheck);

  // ================= AUTH & GMAIL INTEGRATION =================
  apiRouter.get('/auth/status', (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';
    const isAdmin = isUserAdmin(userEmail || primary.email);
    const perm = checkSendingPermission(primary.email || userEmail);

    res.json({
      isConnected: Boolean(primary.isConnected && primary.accessToken && !(primary as any).needsReauth),
      needsReauth: Boolean((primary as any).needsReauth),
      email: primary.email || null,
      displayName: primary.displayName || null,
      lastSyncTime: primary.lastSyncTime || null,
      role: isAdmin ? 'ADMIN' : 'USER',
      isAdmin,
      dailyLimit: perm.dailyLimit,
      sentToday: perm.sentToday,
      remainingToday: perm.remainingToday,
      adminEmail: ADMIN_EMAIL,
    });
  });

  apiRouter.post('/auth/connect-google', async (req, res) => {
    try {
      const { accessToken, email, displayName } = req.body;
      if (!accessToken) {
        return res.status(400).json({ success: false, error: 'accessToken is required' });
      }

      // Verify token with Gmail profile API
      let verifiedEmail = email;
      try {
        const profile = await getGmailProfile(accessToken);
        verifiedEmail = profile.emailAddress || email;
      } catch (err: any) {
        console.warn('Gmail profile check warning (proceeding with provided email):', err.message);
      }

      db.update('gmail_accounts', () => [
        {
          isConnected: true,
          email: verifiedEmail,
          displayName: displayName || verifiedEmail.split('@')[0],
          accessToken,
          needsReauth: false,
          lastSyncTime: new Date().toISOString(),
        },
      ]);

      // Automatically unblock any scheduled messages that previously failed due to missing scopes
      db.update('scheduled_messages', (list) =>
        list.map((m) =>
          m.status === 'FAILED' && (m.error?.includes('insufficient authentication scopes') || m.error?.includes('403'))
            ? { ...m, status: 'QUEUED' as const, error: undefined, retryCount: 0 }
            : m
        )
      );

      db.logAudit('GMAIL_CONNECTED', `Connected Gmail account: ${verifiedEmail}`);
      db.addNotification('success', 'Gmail Connected', `Gmail integration active for ${verifiedEmail}`);

      // Trigger an initial reply sync in the background
      setTimeout(() => {
        syncGmailReplies().catch(console.error);
      }, 1000);

      res.status(200).json({
        success: true,
        email: verifiedEmail,
        isConnected: true,
      });
    } catch (err: any) {
      console.error('Error connecting Google account:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to connect Google account' });
    }
  });

  apiRouter.post('/auth/disconnect-google', (req, res) => {
    const prev = db.get('gmail_accounts')[0];
    db.update('gmail_accounts', (accs) =>
      accs.map((a) => ({ ...a, isConnected: false, accessToken: undefined }))
    );
    db.logAudit('GMAIL_DISCONNECTED', `Disconnected Gmail account: ${prev?.email || 'unknown'}`);
    db.addNotification('info', 'Gmail Disconnected', 'Gmail integration was disconnected.');
    res.status(200).json({ success: true, isConnected: false });
  });

  // ================= DASHBOARD STATS =================
  apiRouter.get('/dashboard/stats', (req, res) => {
    const contacts = db.get('contacts');
    const scheduled = db.get('scheduled_messages');
    const sent = db.get('sent_messages');
    const incoming = db.get('incoming_messages');
    const followUps = db.get('follow_ups');
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';
    const isAdmin = isUserAdmin(userEmail || primary.email);
    const perm = checkSendingPermission(primary.email || userEmail);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sentToday = sent.filter((m) => new Date(m.sentAt).getTime() >= startOfDay).length;

    const repliesCount = incoming.length;
    const totalSent = sent.length;
    const replyRatePercentage = totalSent > 0 ? Math.round((repliesCount / totalSent) * 100) : 0;

    // Last 7 days sent timeline
    const sentOverTime: { date: string; sent: number; replies: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;

      const sentCount = sent.filter((m) => {
        const t = new Date(m.sentAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const repCount = incoming.filter((m) => {
        const t = new Date(m.receivedDate).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      sentOverTime.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        sent: sentCount,
        replies: repCount,
      });
    }

    // Breakdown by organization type
    const orgCountMap: Record<string, number> = {};
    contacts.forEach((c) => {
      const type = c.organizationType || 'Other';
      orgCountMap[type] = (orgCountMap[type] || 0) + 1;
    });
    const outreachBreakdown = Object.entries(orgCountMap).map(([name, count]) => ({ name, count }));

    // Top countries
    const countryMap: Record<string, number> = {};
    contacts.forEach((c) => {
      if (c.country) {
        countryMap[c.country] = (countryMap[c.country] || 0) + 1;
      }
    });
    const topCountries = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity log
    const recentActivities = [
      ...sent.map((s) => ({
        id: s.id,
        type: 'sent' as const,
        title: `Outreach Sent: ${s.subject}`,
        timestamp: s.sentAt,
        recipientOrContact: `${s.recipientName} (${s.recipientEmail})`,
      })),
      ...incoming.map((r) => ({
        id: r.id,
        type: 'reply' as const,
        title: r.classification ? `Reply Received: ${r.subject} [${r.classification}]` : `Reply Received: ${r.subject}`,
        timestamp: r.receivedDate,
        recipientOrContact: `${r.contactName || r.contactEmail}`,
      })),
      ...scheduled.map((sc) => ({
        id: sc.id,
        type: sc.status === 'FAILED' ? ('failed' as const) : ('scheduled' as const),
        title: sc.status === 'FAILED' ? `Failed: ${sc.subject}` : `Queued: ${sc.subject}`,
        timestamp: sc.scheduledTime,
        recipientOrContact: `${sc.recipientName} (${sc.recipientEmail})`,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const weekAgo = Date.now() - 7 * 86400000;
    const contactsAddedThisWeek = contacts.filter((c) => new Date(c.createdAt).getTime() >= weekAgo).length;

    res.status(200).json({
      totalContacts: contacts.length,
      scheduledCount: scheduled.filter((m) => m.status === 'QUEUED').length,
      sentToday,
      totalSent,
      repliesCount,
      followUpsCount: followUps.filter((f) => f.status === 'ACTIVE').length,
      failedCount: scheduled.filter((m) => m.status === 'FAILED').length,
      activeCampaigns: db.get('campaigns').filter((c) => c.status === 'ACTIVE').length,
      replyRatePercentage,
      recentActivities,
      sentOverTime,
      outreachBreakdown,
      topCountries,
      contactsAddedThisWeek,
      role: isAdmin ? 'ADMIN' : 'USER',
      isAdmin,
      dailyLimit: perm.dailyLimit,
      remainingToday: perm.remainingToday,
    });
  });

  // ================= CONTACTS =================
  apiRouter.get('/contacts', (req, res) => {
    res.status(200).json(db.get('contacts'));
  });

  apiRouter.post('/contacts', (req, res) => {
    const { name, email, organization, organizationType, role, country, website, jobTitle, jobUrl, notes, tags } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const contacts = db.get('contacts');
    const existing = contacts.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, error: `Contact with email ${email} already exists.` });
    }

    const now = new Date().toISOString();
    const newContact: Contact = {
      id: 'c-' + Date.now(),
      name,
      email,
      organization: organization || '',
      organizationType: organizationType || 'HR',
      role: role || '',
      country: country || 'United States',
      website,
      jobTitle,
      jobUrl,
      notes,
      tags: tags || [],
      createdAt: now,
      updatedAt: now,
    };

    db.update('contacts', (prev) => [newContact, ...prev]);
    db.logAudit('CONTACT_CREATED', `Added contact: ${name} (${email})`);
    res.status(201).json(newContact);
  });

  apiRouter.put('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;

    db.update('contacts', (list) =>
      list.map((c) => {
        if (c.id === id) {
          found = true;
          return {
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    if (!found) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.status(200).json({ success: true });
  });

  apiRouter.delete('/contacts/:id', (req, res) => {
    const { id } = req.params;
    db.update('contacts', (list) => list.filter((c) => c.id !== id));
    db.logAudit('CONTACT_DELETED', `Deleted contact ID: ${id}`);
    res.status(200).json({ success: true });
  });

  apiRouter.post('/contacts/import', (req, res) => {
    const { contacts: rawContacts } = req.body;
    if (!Array.isArray(rawContacts) || rawContacts.length === 0) {
      return res.status(400).json({ success: false, error: 'Valid array of contacts is required' });
    }

    const now = new Date().toISOString();
    const existing = db.get('contacts');
    const existingEmails = new Set(existing.map((c) => c.email.toLowerCase()));

    const validNew: Contact[] = [];
    rawContacts.forEach((r, idx) => {
      const email = r.email?.trim();
      const name = r.name?.trim();
      if (!email || !name) return;
      if (existingEmails.has(email.toLowerCase())) return;

      existingEmails.add(email.toLowerCase());
      validNew.push({
        id: 'c-imp-' + Date.now() + '-' + idx,
        name,
        email,
        organization: r.organization || '',
        organizationType: r.organizationType || 'HR',
        role: r.role || '',
        country: r.country || 'United States',
        website: r.website,
        jobTitle: r.jobTitle,
        jobUrl: r.jobUrl,
        notes: r.notes,
        tags: Array.isArray(r.tags) ? r.tags : ['Imported'],
        createdAt: now,
        updatedAt: now,
      });
    });

    db.update('contacts', (prev) => [...validNew, ...prev]);
    db.logAudit('CONTACTS_IMPORTED', `Imported ${validNew.length} contacts`);
    db.addNotification('success', 'Contacts Imported', `Successfully imported ${validNew.length} contacts.`);
    res.status(200).json({ success: true, count: validNew.length });
  });

  // ================= CAMPAIGNS =================
  apiRouter.get('/campaigns', (req, res) => {
    res.status(200).json(db.get('campaigns'));
  });

  apiRouter.post('/campaigns', (req, res) => {
    const { name, description, type, subjectTemplate, bodyTemplate, subject, message, recipientIds, followUpRules, dailyLimit, delayMinutes } = req.body;
    const finalSubject = subject || subjectTemplate;
    const finalBody = message || bodyTemplate;
    if (!name || !finalSubject || !finalBody) {
      return res.status(400).json({ success: false, error: 'Campaign name, subject template, and body are required' });
    }

    const now = new Date().toISOString();
    const campaignId = 'camp-' + Date.now();

    const newCampaign: Campaign = {
      id: campaignId,
      name,
      description: description || '',
      type: type || 'JOB_OUTREACH',
      status: 'ACTIVE',
      recipientIds: recipientIds || [],
      subject: finalSubject,
      message: finalBody,
      attachments: [],
      scheduleType: 'immediate',
      dailyLimit: dailyLimit || 10,
      delayMinutes: delayMinutes || 10,
      sentCount: 0,
      replyCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.update('campaigns', (camps) => [newCampaign, ...camps]);

    // Save associated follow-up rules
    if (Array.isArray(followUpRules) && followUpRules.length > 0) {
      const rules = followUpRules.map((r, i) => ({
        id: 'fu-' + Date.now() + '-' + i,
        campaignId,
        campaignName: name,
        stepNumber: i + 1,
        daysAfterPrevious: r.daysAfterPrevious || 3,
        subjectTemplate: r.subject || r.subjectTemplate || `Re: ${finalSubject}`,
        messageTemplate: r.bodyTemplate || r.messageTemplate || '',
        status: 'ACTIVE' as const,
        stopOnReply: true,
      }));
      db.update('follow_ups', (existing) => [...existing, ...rules]);
    }

    db.logAudit('CAMPAIGN_CREATED', `Created campaign: ${name}`);
    res.status(201).json(newCampaign);
  });

  apiRouter.put('/campaigns/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;

    db.update('campaigns', (list) =>
      list.map((c) => {
        if (c.id === id) {
          found = true;
          return { ...c, ...updates, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );

    if (!found) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.status(200).json({ success: true });
  });

  apiRouter.put('/campaigns/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid campaign status' });
    }

    db.update('campaigns', (list) =>
      list.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );

    db.logAudit('CAMPAIGN_STATUS_CHANGED', `Campaign ${id} status set to ${status}`);
    res.status(200).json({ success: true, status });
  });

  apiRouter.delete('/campaigns/:id', (req, res) => {
    const { id } = req.params;
    db.update('campaigns', (list) => list.filter((c) => c.id !== id));
    db.logAudit('CAMPAIGN_DELETED', `Deleted campaign ID: ${id}`);
    res.status(200).json({ success: true });
  });

  // ================= MESSAGES & OUTBOUND =================
  const handleComposeMessage = (req: express.Request, res: express.Response) => {
    const {
      recipientId,
      recipientEmail,
      recipientName,
      subject,
      messageBody,
      attachments,
      campaignId,
      campaignName,
      scheduledTime,
      approvalAction,
    } = req.body;

    if (!recipientEmail || !subject || !messageBody) {
      return res.status(400).json({ success: false, error: 'Recipient email, subject, and message body are required' });
    }

    const now = new Date();
    const scheduledDate = scheduledTime ? new Date(scheduledTime) : new Date(now.getTime() + 10 * 60000);

    let status: 'DRAFT' | 'READY_FOR_REVIEW' | 'QUEUED' = 'QUEUED';
    if (approvalAction === 'DRAFT') status = 'DRAFT';
    else if (approvalAction === 'READY_FOR_REVIEW') status = 'READY_FOR_REVIEW';

    const newMsg: ScheduledMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      recipientId,
      recipientName: recipientName || recipientEmail.split('@')[0],
      recipientEmail,
      subject,
      messageBody,
      attachments: attachments || [],
      campaignId,
      campaignName,
      scheduledTime: scheduledDate.toISOString(),
      status,
      retryCount: 0,
      createdAt: now.toISOString(),
    };

    db.update('scheduled_messages', (msgs) => [newMsg, ...msgs]);
    db.logAudit('MESSAGE_SCHEDULED', `Message to ${recipientEmail} queued (${status})`);
    res.status(201).json(newMsg);
  };

  apiRouter.post('/messages/compose', handleComposeMessage);
  apiRouter.post('/messages', handleComposeMessage);
  apiRouter.get('/messages', (req, res) => {
    res.status(200).json({
      scheduled: db.get('scheduled_messages'),
      sent: db.get('sent_messages'),
    });
  });

  apiRouter.post('/messages/:id/approve', (req, res) => {
    const { id } = req.params;
    let found = false;

    db.update('scheduled_messages', (list) =>
      list.map((m) => {
        if (m.id === id) {
          found = true;
          return { ...m, status: 'QUEUED' as const, error: undefined };
        }
        return m;
      })
    );

    if (!found) {
      return res.status(404).json({ success: false, error: 'Scheduled message not found' });
    }

    db.logAudit('MESSAGE_APPROVED', `Message ${id} approved for queue dispatch`);
    res.status(200).json({ success: true, status: 'QUEUED' });
  });

  const handleSendNow = async (req: express.Request, res: express.Response) => {
    try {
      const {
        recipientId,
        recipientEmail,
        recipientName,
        subject,
        messageBody,
        attachments,
        campaignId,
        campaignName,
        forceSendAgain,
      } = req.body;

      if (!recipientEmail || !subject || !messageBody) {
        return res.status(400).json({ success: false, error: 'Recipient email, subject, and message body are required' });
      }

      const gmailAccounts = db.get('gmail_accounts');
      const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);

      if (!primary || !primary.accessToken) {
        return res.status(401).json({
          success: false,
          error: 'Gmail is not connected. Please connect your Google account in Settings.',
        });
      }

      // Check server-side daily sending limit
      const perm = checkSendingPermission(primary.email);
      if (!perm.allowed) {
        return res.status(429).json({
          success: false,
          error: perm.reason || 'Daily sending limit reached. Sending paused until tomorrow.',
        });
      }

      // Duplicate prevention check
      if (campaignId && !forceSendAgain && isDuplicateSend(recipientEmail, campaignId)) {
        return res.status(409).json({
          success: false,
          error: `Duplicate send prevented: An email was already sent to ${recipientEmail} for this campaign. Check "Force Send" to bypass.`,
        });
      }

      const settings = db.get('settings');

      // Dispatch real email via Gmail API
      const sendResult = await sendGmailMessage({
        accessToken: primary.accessToken,
        to: recipientEmail,
        toName: recipientName,
        subject,
        body: messageBody,
        attachments: attachments || [],
        fromName: settings.profile.name,
        fromEmail: primary.email,
      });

      const sentTime = new Date().toISOString();
      const sentItem: SentMessage = {
        id: 'sent-' + Date.now(),
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        recipientId,
        recipientName: recipientName || recipientEmail.split('@')[0],
        recipientEmail,
        subject,
        messageBody,
        attachments: attachments || [],
        campaignId,
        campaignName,
        sentAt: sentTime,
        status: 'DELIVERED',
      };

      db.update('sent_messages', (prev) => [sentItem, ...prev]);

      // Thread tracking
      db.update('email_threads', (threads) => [
        ...threads.filter((t) => t.threadId !== sendResult.threadId),
        {
          threadId: sendResult.threadId,
          contactEmail: recipientEmail,
          campaignId,
          lastMessageAt: sentTime,
          messageCount: 1,
        },
      ]);

      // If sent as part of a campaign, increment sent counter
      if (campaignId) {
        db.update('campaigns', (camps) =>
          camps.map((c) =>
            c.id === campaignId ? { ...c, sentCount: (c.sentCount || 0) + 1 } : c
          )
        );
      }

      db.logAudit('EMAIL_SENT', `Direct send to ${recipientName} <${recipientEmail}> (ID: ${sendResult.id})`);
      db.addNotification('success', 'Email Sent', `Successfully dispatched email to ${recipientName} (${recipientEmail})`);

      res.status(200).json({
        success: true,
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        sentAt: sentTime,
      });
    } catch (err: any) {
      console.error('Error in send-now:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to dispatch email' });
    }
  };

  apiRouter.post('/messages/send-now', handleSendNow);
  apiRouter.post('/send', handleSendNow);

  // ================= SCHEDULED QUEUE =================
  apiRouter.get('/scheduled', (req, res) => {
    res.status(200).json(db.get('scheduled_messages'));
  });

  apiRouter.post('/scheduled/:id/retry', (req, res) => {
    const { id } = req.params;
    let found = false;

    db.update('scheduled_messages', (list) =>
      list.map((m) => {
        if (m.id === id) {
          found = true;
          return {
            ...m,
            status: 'QUEUED' as const,
            error: undefined,
            retryCount: (m.retryCount || 0) + 1,
            scheduledTime: new Date().toISOString(),
          };
        }
        return m;
      })
    );

    if (!found) {
      return res.status(404).json({ success: false, error: 'Scheduled message not found' });
    }

    res.status(200).json({ success: true, message: 'Message re-queued for immediate dispatch' });
  });

  apiRouter.delete('/scheduled/:id', (req, res) => {
    const { id } = req.params;
    db.update('scheduled_messages', (list) => list.filter((m) => m.id !== id));
    db.logAudit('MESSAGE_CANCELLED', `Cancelled scheduled message: ${id}`);
    res.status(200).json({ success: true });
  });

  // ================= SENT MESSAGES =================
  apiRouter.get('/sent', (req, res) => {
    res.status(200).json(db.get('sent_messages'));
  });

  // ================= RESPONSES & REPLIES =================
  const handleGetResponses = (req: express.Request, res: express.Response) => {
    res.status(200).json(db.get('incoming_messages'));
  };

  const handleSyncResponses = async (req: express.Request, res: express.Response) => {
    try {
      const result = await syncGmailReplies();
      res.status(200).json({ success: true, newReplies: result.newRepliesCount });
    } catch (err: any) {
      console.error('Error syncing replies:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to sync replies' });
    }
  };

  const handleUpdateResponseStatus = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { userResponseStatus } = req.body;
    db.update('incoming_messages', (list) =>
      list.map((r) => (r.id === id ? { ...r, userResponseStatus } : r))
    );
    res.status(200).json({ success: true });
  };

  apiRouter.get('/responses', handleGetResponses);
  apiRouter.get('/replies', handleGetResponses);
  apiRouter.post('/responses/sync', handleSyncResponses);
  apiRouter.post('/replies/sync', handleSyncResponses);
  apiRouter.put('/responses/:id/status', handleUpdateResponseStatus);
  apiRouter.put('/replies/:id/status', handleUpdateResponseStatus);

  // ================= FOLLOW-UPS =================
  const handleGetFollowUps = (req: express.Request, res: express.Response) => {
    res.status(200).json({
      rules: db.get('follow_ups'),
      instances: db.get('follow_up_instances'),
    });
  };

  const handleCreateFollowUp = (req: express.Request, res: express.Response) => {
    const { campaignId, campaignName, stepNumber, daysAfterPrevious, subject, subjectTemplate, bodyTemplate, messageTemplate } = req.body;
    const finalSubject = subject || subjectTemplate || 'Following up on my previous note';
    const finalMessage = bodyTemplate || messageTemplate;
    if (!campaignId || !finalMessage) {
      return res.status(400).json({ success: false, error: 'Campaign ID and body template are required' });
    }

    const newRule: FollowUpRule = {
      id: 'fu-' + Date.now(),
      campaignId,
      campaignName: campaignName || 'Custom Campaign',
      stepNumber: stepNumber || 1,
      daysAfterPrevious: daysAfterPrevious || 3,
      subjectTemplate: finalSubject,
      messageTemplate: finalMessage,
      status: 'ACTIVE',
      stopOnReply: true,
    };

    db.update('follow_ups', (rules) => [...rules, newRule]);
    res.status(201).json(newRule);
  };

  const handleToggleFollowUp = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    db.update('follow_ups', (list) =>
      list.map((r) => (r.id === id ? { ...r, status: r.status === 'ACTIVE' ? ('PAUSED' as const) : ('ACTIVE' as const) } : r))
    );
    res.status(200).json({ success: true });
  };

  apiRouter.get('/follow-ups', handleGetFollowUps);
  apiRouter.get('/followups', handleGetFollowUps);
  apiRouter.post('/follow-ups', handleCreateFollowUp);
  apiRouter.post('/followups', handleCreateFollowUp);
  apiRouter.put('/follow-ups/:id/toggle', handleToggleFollowUp);
  apiRouter.put('/followups/:id/toggle', handleToggleFollowUp);

  // ================= TEMPLATES =================
  apiRouter.get('/templates', (req, res) => {
    res.status(200).json(db.get('templates'));
  });

  apiRouter.post('/templates', (req, res) => {
    const { name, title, category, subject, body, variables } = req.body;
    const finalTitle = title || name;
    if (!finalTitle || !subject || !body) {
      return res.status(400).json({ success: false, error: 'Template title, subject, and body are required' });
    }

    const newTpl: Template = {
      id: 'tpl-' + Date.now(),
      title: finalTitle,
      category: category || 'Job Outreach',
      subject,
      body,
      variables: variables || ['name', 'organization', 'role'],
      createdAt: new Date().toISOString(),
    };

    db.update('templates', (t) => [newTpl, ...t]);
    res.status(201).json(newTpl);
  });

  apiRouter.delete('/templates/:id', (req, res) => {
    const { id } = req.params;
    db.update('templates', (list) => list.filter((t) => t.id !== id));
    res.status(200).json({ success: true });
  });

  // ================= FILES & ATTACHMENTS (Task 8) =================
  apiRouter.get('/files', (req, res) => {
    res.status(200).json(db.get('attachments'));
  });

  const handleUploadFile = (req: express.Request, res: express.Response) => {
    const { name, size, mimeType, category, dataBase64 } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'File name is required' });

    const newFile: StoredFile = {
      id: 'f-' + Date.now(),
      name,
      size: size || 0,
      mimeType: mimeType || 'application/pdf',
      source: 'local',
      category: category || 'Resume/CV',
      uploadedAt: new Date().toISOString(),
      dataBase64,
    };

    db.update('attachments', (files) => [newFile, ...files]);
    db.logAudit('FILE_UPLOADED', `Uploaded document: ${name} (${category})`);
    res.status(201).json(newFile);
  };

  apiRouter.post('/files/upload', handleUploadFile);
  apiRouter.post('/files', handleUploadFile);

  apiRouter.delete('/files/:id', (req, res) => {
    const { id } = req.params;
    db.update('attachments', (files) => files.filter((f) => f.id !== id));
    res.status(200).json({ success: true });
  });

  // Google Drive Files Proxy
  apiRouter.get('/drive/files', async (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);
    if (!primary || !primary.accessToken) {
      return res.status(401).json({ success: false, error: 'Google Drive requires connected Google account' });
    }

    try {
      const files = await listGoogleDriveFiles(primary.accessToken, 30);
      res.status(200).json(files);
    } catch (err: any) {
      console.error('Error fetching Google Drive files:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to list Google Drive files' });
    }
  });

  // Google Sheets Contacts Import
  apiRouter.post('/sheets/import-contacts', async (req, res) => {
    const { spreadsheetId, range } = req.body;
    if (!spreadsheetId) {
      return res.status(400).json({ success: false, error: 'spreadsheetId is required' });
    }

    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);
    if (!primary || !primary.accessToken) {
      return res.status(401).json({ success: false, error: 'Google Sheets requires connected Google account' });
    }

    try {
      const rows = await readGoogleSpreadsheet(primary.accessToken, spreadsheetId, range || 'Sheet1!A1:Z100');
      if (rows.length < 2) {
        return res.status(400).json({ success: false, error: 'Sheet does not contain enough data (headers + rows required)' });
      }

      const headers = rows[0].map((h: string) => h.toLowerCase().trim());
      const emailColIdx = headers.findIndex((h: string) => h.includes('email') || h.includes('e-mail'));
      const nameColIdx = headers.findIndex((h: string) => h.includes('name') || h.includes('contact'));
      const orgColIdx = headers.findIndex((h: string) => h.includes('org') || h.includes('company') || h.includes('university'));
      const roleColIdx = headers.findIndex((h: string) => h.includes('role') || h.includes('title') || h.includes('position'));
      const countryColIdx = headers.findIndex((h: string) => h.includes('country') || h.includes('location'));

      if (emailColIdx === -1) {
        return res.status(400).json({ success: false, error: 'Could not find an email column in the specified spreadsheet header row.' });
      }

      const existing = db.get('contacts');
      const existingEmails = new Set(existing.map((c) => c.email.toLowerCase()));
      const now = new Date().toISOString();
      const newContacts: Contact[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const email = row[emailColIdx]?.trim();
        if (!email || existingEmails.has(email.toLowerCase())) continue;

        const name = (nameColIdx !== -1 ? row[nameColIdx] : '') || email.split('@')[0];
        const organization = orgColIdx !== -1 ? row[orgColIdx] || '' : '';
        const role = roleColIdx !== -1 ? row[roleColIdx] || '' : '';
        const country = countryColIdx !== -1 ? row[countryColIdx] || 'United States' : 'United States';

        existingEmails.add(email.toLowerCase());
        newContacts.push({
          id: 'c-sheet-' + Date.now() + '-' + i,
          name,
          email,
          organization,
          organizationType: 'HR',
          role,
          country,
          tags: ['Google Sheets Import'],
          createdAt: now,
          updatedAt: now,
        });
      }

      db.update('contacts', (prev) => [...newContacts, ...prev]);
      db.logAudit('SHEETS_IMPORTED', `Imported ${newContacts.length} contacts from Google Sheet ${spreadsheetId}`);
      res.status(200).json({ success: true, count: newContacts.length });
    } catch (err: any) {
      console.error('Error importing from Google Sheet:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to import contacts from Google Sheets' });
    }
  });

  // ================= GEMINI AI ASSISTANT =================
  apiRouter.post('/ai/improve', async (req, res) => {
    try {
      const { content, instruction, contactContext } = req.body;
      const text = await improveMessage(content, instruction, contactContext);
      res.status(200).json({ text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI generation failed' });
    }
  });

  apiRouter.post('/ai/subject', async (req, res) => {
    try {
      const { content, role, organization, candidateName } = req.body;
      const subjects = await generateSubject(content, role, organization, candidateName);
      res.status(200).json({ subjects });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI subject generation failed' });
    }
  });

  apiRouter.post('/ai/personalize', async (req, res) => {
    try {
      const { template, contact } = req.body;
      const userProfile = db.get('settings').profile;
      const text = await personalizeMessage(template, contact, userProfile);
      res.status(200).json({ text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI personalization failed' });
    }
  });

  apiRouter.post('/ai/follow-up', async (req, res) => {
    try {
      const { originalSubject, originalBody, stepNumber, contactName } = req.body;
      const result = await generateFollowUp(originalSubject, originalBody, stepNumber, contactName);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI follow-up generation failed' });
    }
  });

  apiRouter.post('/ai/summarize-jd', async (req, res) => {
    try {
      const { jdText } = req.body;
      const result = await summarizeJobDescription(jdText);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI job description analysis failed' });
    }
  });

  apiRouter.post('/ai/draft-response', async (req, res) => {
    try {
      const { incomingSubject, incomingBody, originalOutreach } = req.body;
      const userProfile = db.get('settings').profile;
      const draft = await draftReplyResponse(incomingSubject, incomingBody, originalOutreach, userProfile);
      res.status(200).json({ draft });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI response drafting failed' });
    }
  });

  // ================= SETTINGS =================
  apiRouter.get('/settings', (req, res) => {
    res.status(200).json(db.get('settings'));
  });

  apiRouter.put('/settings', (req, res) => {
    const newSettings = req.body;
    const current = db.get('settings');
    const merged = {
      ...current,
      ...newSettings,
      profile: { ...current.profile, ...(newSettings.profile || {}) },
      email: { ...current.email, ...(newSettings.email || {}) },
      automation: { ...current.automation, ...(newSettings.automation || {}) },
      ai: { ...current.ai, ...(newSettings.ai || {}) },
      sendingLimits: {
        ...current.sendingLimits,
        ...(newSettings.sendingLimits || {}),
        maxEmailsPerDay: newSettings.sendingLimits?.maxEmailsPerDay ?? newSettings.automation?.dailyLimit ?? current.sendingLimits?.maxEmailsPerDay ?? 10,
        delaySecondsBetweenSends: newSettings.sendingLimits?.delaySecondsBetweenSends ?? (newSettings.automation?.delayMinutes ? newSettings.automation.delayMinutes * 60 : (current.sendingLimits?.delaySecondsBetweenSends ?? 600)),
        timezone: newSettings.sendingLimits?.timezone || newSettings.automation?.timezone || current.sendingLimits?.timezone || 'Asia/Kolkata',
      },
      aiSettings: {
        ...current.aiSettings,
        ...(newSettings.aiSettings || {}),
      },
    };

    db.set('settings', merged);
    db.logAudit('SETTINGS_UPDATED', 'Updated application preferences');
    res.status(200).json({ success: true, settings: merged });
  });

  // ================= NOTIFICATIONS & AUDIT =================
  apiRouter.get('/notifications', (req, res) => {
    res.status(200).json(db.get('notifications'));
  });

  apiRouter.post('/notifications/read-all', (req, res) => {
    db.update('notifications', (notifs) => notifs.map((n) => ({ ...n, read: true })));
    res.status(200).json({ success: true });
  });

  apiRouter.get('/audit-logs', (req, res) => {
    res.status(200).json(db.get('audit_logs'));
  });

  // ================= ADMIN CONTROLS =================
  apiRouter.get('/admin/system', async (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';

    if (!isUserAdmin(userEmail)) {
      return res.status(403).json({ success: false, error: 'Access denied: Admin role required.' });
    }

    const contacts = db.get('contacts');
    const campaigns = db.get('campaigns');
    const scheduled = db.get('scheduled_messages');
    const sent = db.get('sent_messages');
    const incoming = db.get('incoming_messages');
    const auditLogs = db.get('audit_logs');
    const dbStatus = await db.getDbStatus();

    res.status(200).json({
      role: 'ADMIN',
      adminEmail: ADMIN_EMAIL,
      currentAccount: primary.email || 'None',
      isGmailConnected: Boolean(primary.isConnected && primary.accessToken),
      database: dbStatus,
      stats: {
        totalContacts: contacts.length,
        totalCampaigns: campaigns.length,
        totalSentMessages: sent.length,
        totalScheduledQueued: scheduled.filter((m) => m.status === 'QUEUED').length,
        totalFailedMessages: scheduled.filter((m) => m.status === 'FAILED').length,
        totalIncomingReplies: incoming.length,
      },
      sendingLimitPolicy: 'UNLIMITED for Admin, 10/day for Standard Users',
      recentAuditLogs: auditLogs.slice(0, 20),
    });
  });

  apiRouter.post('/admin/reset-data', async (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';

    if (!isUserAdmin(userEmail)) {
      return res.status(403).json({ success: false, error: 'Access denied: Admin role required.' });
    }

    await db.resetUserData();
    db.logAudit('ADMIN_DATA_RESET', `Admin (${userEmail}) performed complete data reset.`);
    res.status(200).json({ success: true, message: 'Application user data has been completely reset to zero-state.' });
  });

  // ================= VERCEL CRON DISPATCHER (Task 14) =================
  const handleCronJob = async (req: express.Request, res: express.Response) => {
    // CRON_SECRET verification (protected cron endpoint)
    if (process.env.CRON_SECRET) {
      const authHeader = req.headers.authorization;
      const querySecret = (req.query as any)?.secret;
      const normalizedQuerySecret = querySecret ? querySecret.replace(/ /g, '+') : undefined;
      const isAuthorized =
        authHeader === `Bearer ${process.env.CRON_SECRET}` ||
        querySecret === process.env.CRON_SECRET ||
        normalizedQuerySecret === process.env.CRON_SECRET;
      if (!isAuthorized) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing CRON_SECRET token' });
      }
    }

    try {
      await db.ensureLoaded(true);
      const queueResult = await processOutboundQueue();
      let replyCount = 0;
      try {
        const syncRes = await syncGmailReplies();
        replyCount = syncRes.newRepliesCount;
      } catch (e: any) {
        console.warn('Cron reply sync check warning:', e.message);
      }

      await db.flush();
      const dbStatus = await db.getDbStatus();

      res.status(200).json({
        success: true,
        dispatchedAt: new Date().toISOString(),
        environment: dbStatus.environment,
        databaseProvider: dbStatus.databaseProvider,
        queueProcessed: queueResult.processed,
        newReplies: replyCount,
        message: 'Outbound queue processing and Gmail reply sync executed successfully.',
      });
    } catch (err: any) {
      console.error('Error during scheduled cron execution:', err);
      res.status(500).json({ success: false, error: err.message || 'Scheduled execution failed' });
    }
  };

  apiRouter.get('/cron', handleCronJob);
  apiRouter.post('/cron', handleCronJob);
  apiRouter.get('/cron/dispatcher', handleCronJob);
  apiRouter.post('/cron/dispatcher', handleCronJob);

  // Direct database download / export endpoints
  const handleDbDownload = (req: express.Request, res: express.Response) => {
    const allData = db.getAllData();
    res.setHeader('Content-Disposition', 'attachment; filename="outreachos-db-export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(allData, null, 2));
  };

  apiRouter.get('/db/download', handleDbDownload);
  apiRouter.get('/admin/export-db', handleDbDownload);

  // Root API information endpoint (so GET /api and GET / return status instead of 404)
  apiRouter.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'OutreachOS API is operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      routes: [
        '/api/health',
        '/api/auth/status',
        '/api/contacts',
        '/api/campaigns',
        '/api/scheduled',
        '/api/sent',
        '/api/responses',
        '/api/follow-ups',
        '/api/templates',
        '/api/files',
        '/api/settings',
        '/api/notifications',
        '/api/audit-logs',
      ],
    });
  });

  // Mount API router strictly on '/api' (normalizeUrl guarantees requests start with /api)
  app.use('/api', apiRouter);

  // Fallback 404 handler for genuinely unknown API routes ONLY
  // This allows non-API routes (frontend HTML, JS, CSS, static assets) to pass through to Vite
  app.use('/api', (req, res) => {
    console.warn(`[API 404 NOT FOUND] ${req.method} url=${req.url} originalUrl=${req.originalUrl} path=${req.path}`);
    res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: req.path,
      method: req.method,
    });
  });

  return app;
}
