import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import {
  getGmailProfile,
  sendGmailMessage,
  listGoogleDriveFiles,
  readGoogleSpreadsheet,
} from './server/gmail.js';
import {
  improveMessage,
  generateSubject,
  personalizeMessage,
  generateFollowUp,
  summarizeJobDescription,
  classifyIncomingReply,
  draftReplyResponse,
} from './server/gemini.js';
import {
  startScheduler,
  syncGmailReplies,
  getSentCountToday,
  isDuplicateSend,
  isUserAdmin,
  checkSendingPermission,
  ADMIN_EMAIL,
  STANDARD_USER_DAILY_LIMIT,
} from './server/scheduler.js';
import { Contact, Campaign, ScheduledMessage, SentMessage, StoredFile, Template } from './src/types.js';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for parsing JSON with 25MB limit for attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Initialize scheduler for outbound queue and reply monitoring
  startScheduler();

  // ================= API ROUTES =================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ---------- AUTH & GMAIL INTEGRATION ----------
  app.get('/api/auth/status', (req, res) => {
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
    });
  });

  app.post('/api/auth/connect-google', async (req, res) => {
    try {
      const { accessToken, email, displayName } = req.body;
      if (!accessToken) {
        return res.status(400).json({ error: 'accessToken is required' });
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

      // Trigger an initial reply sync
      setTimeout(() => {
        syncGmailReplies().catch(console.error);
      }, 2000);

      res.json({
        success: true,
        email: verifiedEmail,
        isConnected: true,
      });
    } catch (err: any) {
      console.error('Error connecting Google account:', err);
      res.status(500).json({ error: err.message || 'Failed to connect Google account' });
    }
  });

  app.post('/api/auth/disconnect-google', (req, res) => {
    const prev = db.get('gmail_accounts')[0];
    db.update('gmail_accounts', (accs) =>
      accs.map((a) => ({ ...a, isConnected: false, accessToken: undefined }))
    );
    db.logAudit('GMAIL_DISCONNECTED', `Disconnected Gmail account: ${prev?.email || 'unknown'}`);
    db.addNotification('info', 'Gmail Disconnected', 'Gmail integration was disconnected.');
    res.json({ success: true, isConnected: false });
  });

  // ---------- DASHBOARD METRICS ----------
  app.get('/api/dashboard/stats', (req, res) => {
    const contacts = db.get('contacts');
    const scheduled = db.get('scheduled_messages');
    const sent = db.get('sent_messages');
    const incoming = db.get('incoming_messages');
    const followUps = db.get('follow_ups');
    const campaigns = db.get('campaigns');
    const notifications = db.get('notifications');

    const totalContacts = contacts.length;
    const scheduledCount = scheduled.filter((m) => m.status === 'QUEUED' || m.status === 'APPROVED').length;
    const sentToday = getSentCountToday();
    const totalSent = sent.length;
    const repliesCount = incoming.length;
    const followUpsCount = followUps.filter((f) => f.status === 'ACTIVE').length;
    const failedCount = scheduled.filter((m) => m.status === 'FAILED').length;
    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
    const replyRatePercentage = totalSent > 0 ? Math.round((repliesCount / totalSent) * 100) : 0;

    // Build timeline for chart (last 7 days)
    const sentOverTime: { date: string; sent: number; replies: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;

      const sentCount = sent.filter((s) => {
        const t = new Date(s.sentAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const replyCount = incoming.filter((r) => {
        const t = new Date(r.receivedDate).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      sentOverTime.push({ date: dateStr, sent: sentCount, replies: replyCount });
    }

    // Outreach breakdown
    const jobOutreachCount = campaigns
      .filter((c) => c.type === 'Job Outreach' || (c.type as string) === 'JOB_OUTREACH')
      .reduce((acc, c) => acc + (c.recipientIds?.length || (c as any).contactIds?.length || 0), 0);
    const univOutreachCount = campaigns
      .filter((c) => c.type === 'University Outreach' || (c.type as string) === 'UNIVERSITY_ADMISSIONS')
      .reduce((acc, c) => acc + (c.recipientIds?.length || (c as any).contactIds?.length || 0), 0);
    const customOutreachCount = campaigns
      .filter((c) => c.type === 'Custom Outreach' || (c.type as string) === 'CUSTOM')
      .reduce((acc, c) => acc + (c.recipientIds?.length || (c as any).contactIds?.length || 0), 0);

    const outreachBreakdown = [
      { name: 'Job Outreach', count: jobOutreachCount },
      { name: 'University Outreach', count: univOutreachCount },
      { name: 'Custom Outreach', count: customOutreachCount },
    ];

    // Country distribution
    const countryMap: Record<string, number> = {};
    for (const c of contacts) {
      const country = c.country || 'Other';
      countryMap[country] = (countryMap[country] || 0) + 1;
    }
    const topCountries = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activities feed (only real items)
    const activities: any[] = [];
    for (const s of sent.slice(0, 5)) {
      activities.push({
        id: 'act-sent-' + s.id,
        type: 'sent',
        title: `Outreach email delivered`,
        timestamp: s.sentAt,
        recipientOrContact: `${s.recipientName} (${s.recipientEmail})`,
      });
    }
    for (const inc of incoming.slice(0, 5)) {
      activities.push({
        id: 'act-rep-' + inc.id,
        type: 'reply',
        title: `Reply received [${inc.classification || 'Positive'}]`,
        timestamp: inc.receivedDate,
        recipientOrContact: `${inc.contactName || inc.contactEmail}`,
      });
    }
    for (const q of scheduled.filter((m) => m.status === 'QUEUED').slice(0, 5)) {
      activities.push({
        id: 'act-sched-' + q.id,
        type: 'scheduled',
        title: `Queued for dispatch`,
        timestamp: q.createdAt,
        recipientOrContact: `${q.recipientName}`,
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';
    const isAdmin = isUserAdmin(userEmail || primary.email);
    const perm = checkSendingPermission(primary.email || userEmail);

    res.json({
      totalContacts,
      scheduledCount,
      sentToday,
      totalSent,
      repliesCount,
      followUpsCount,
      failedCount,
      activeCampaigns,
      replyRatePercentage,
      recentActivities: activities.slice(0, 8),
      sentOverTime,
      outreachBreakdown,
      topCountries,
      role: isAdmin ? 'ADMIN' : 'USER',
      isAdmin,
      dailyLimit: perm.dailyLimit,
      remainingToday: perm.remainingToday,
    });
  });

  // ---------- CONTACTS ----------
  app.get('/api/contacts', (req, res) => {
    res.json(db.get('contacts'));
  });

  app.post('/api/contacts', (req, res) => {
    const body = req.body;
    if (!body.name || !body.email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const newContact: Contact = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: body.organization || '',
      organizationType: body.organizationType || 'HR',
      role: body.role || '',
      country: body.country || '',
      website: body.website || '',
      jobTitle: body.jobTitle || '',
      jobUrl: body.jobUrl || '',
      notes: body.notes || '',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update('contacts', (contacts) => [newContact, ...contacts]);
    db.logAudit('CONTACT_CREATED', `Added contact: ${newContact.name} (${newContact.email})`);
    res.status(201).json(newContact);
  });

  app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    let found = false;

    db.update('contacts', (contacts) =>
      contacts.map((c) => {
        if (c.id === id) {
          found = true;
          return {
            ...c,
            ...body,
            tags: Array.isArray(body.tags) ? body.tags : c.tags,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    if (!found) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true });
  });

  app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    db.update('contacts', (contacts) => contacts.filter((c) => c.id !== id));
    db.logAudit('CONTACT_DELETED', `Deleted contact id: ${id}`);
    res.json({ success: true });
  });

  // CSV Import for Contacts
  app.post('/api/contacts/import', (req, res) => {
    const { contacts: rawContacts } = req.body;
    if (!Array.isArray(rawContacts) || rawContacts.length === 0) {
      return res.status(400).json({ error: 'No contact data provided' });
    }

    const created: Contact[] = [];
    for (const row of rawContacts) {
      if (!row.name || !row.email) continue;
      const c: Contact = {
        id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: String(row.name).trim(),
        email: String(row.email).trim().toLowerCase(),
        organization: String(row.organization || row.company || '').trim(),
        organizationType: row.organizationType || 'HR',
        role: String(row.role || row.title || '').trim(),
        country: String(row.country || 'Global').trim(),
        website: row.website || '',
        jobTitle: row.jobTitle || row.role || '',
        jobUrl: row.jobUrl || '',
        notes: row.notes || '',
        tags: Array.isArray(row.tags) ? row.tags : (row.tags ? String(row.tags).split(',').map((t) => t.trim()) : ['Imported']),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      created.push(c);
    }

    db.update('contacts', (existing) => [...created, ...existing]);
    db.logAudit('CONTACTS_IMPORTED', `Imported ${created.length} contacts`);
    db.addNotification('success', 'Contacts Imported', `Imported ${created.length} contacts successfully.`);
    res.json({ success: true, count: created.length });
  });

  // ---------- CAMPAIGNS ----------
  app.get('/api/campaigns', (req, res) => {
    const campaigns = db.get('campaigns');
    const sent = db.get('sent_messages');
    const responses = db.get('incoming_messages');
    const enriched = campaigns.map((c) => {
      const recipientIds = Array.isArray(c.recipientIds)
        ? c.recipientIds
        : Array.isArray((c as any).contactIds)
        ? (c as any).contactIds
        : [];
      const campSent = sent.filter((s) => s.campaignId === c.id).length;
      const campReplies = responses.filter((r) => r.campaignId === c.id).length;
      return {
        ...c,
        recipientIds,
        contactIds: recipientIds,
        sentCount: campSent,
        replyCount: campReplies,
        dailySendingLimit: c.dailyLimit || (c as any).dailySendingLimit || 5,
      };
    });
    res.json(enriched);
  });

  app.post('/api/campaigns', (req, res) => {
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({ error: 'Campaign Name is required' });
    }

    const recipientIds = Array.isArray(body.recipientIds)
      ? body.recipientIds
      : Array.isArray(body.contactIds)
      ? body.contactIds
      : [];

    const subject = (body.subject || 'Outreach Inquiry').trim();
    const message = body.message || 'Hi {{first_name}},\n\nI hope this message finds you well.';

    const campaign: Campaign = {
      id: 'camp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      name: body.name.trim(),
      description: body.description || '',
      type: body.type || 'Job Outreach',
      recipientIds,
      contactIds: recipientIds,
      subject,
      message,
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      scheduleType: body.scheduleType || 'weekdays',
      scheduleTime: body.scheduleTime || '10:00',
      dailyLimit: Number(body.dailyLimit) || Number(body.dailySendingLimit) || 5,
      delayMinutes: Number(body.delayMinutes) || 10,
      status: body.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update('campaigns', (camps) => [campaign, ...camps]);

    // Populate outbound scheduled queue for each recipient with variables replaced!
    const contacts = db.get('contacts');
    const targetContacts = contacts.filter((c) => campaign.recipientIds.includes(c.id));

    let delayAccumulator = 0;
    const scheduledList: ScheduledMessage[] = [];

    for (const c of targetContacts) {
      // Replace variables
      const cName = c.name || '';
      const personalizedSubject = (campaign.subject || '')
        .replace(/\{\{first_name\}\}/g, cName.split(' ')[0] || cName || 'there')
        .replace(/\{\{company\}\}/g, c.organization || '')
        .replace(/\{\{role\}\}/g, c.jobTitle || c.role || 'Role')
        .replace(/\{\{university\}\}/g, c.organization || '')
        .replace(/\{\{programme\}\}/g, c.jobTitle || 'Graduate Studies')
        .replace(/\{\{country\}\}/g, c.country || '');

      const personalizedBody = (campaign.message || '')
        .replace(/\{\{first_name\}\}/g, cName.split(' ')[0] || cName || 'there')
        .replace(/\{\{company\}\}/g, c.organization || '')
        .replace(/\{\{role\}\}/g, c.jobTitle || c.role || 'Role')
        .replace(/\{\{university\}\}/g, c.organization || '')
        .replace(/\{\{programme\}\}/g, c.jobTitle || 'Graduate Studies')
        .replace(/\{\{country\}\}/g, c.country || '');

      const scheduledTime = new Date(Date.now() + delayAccumulator * 60000).toISOString();
      delayAccumulator += campaign.delayMinutes || 10;

      scheduledList.push({
        id: 'sched-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        recipientId: c.id,
        recipientEmail: c.email,
        recipientName: c.name,
        campaignId: campaign.id,
        campaignName: campaign.name,
        subject: personalizedSubject,
        messageBody: personalizedBody,
        attachments: campaign.attachments,
        scheduledTime,
        status: 'QUEUED',
        retryCount: 0,
        createdAt: new Date().toISOString(),
      });
    }

    if (scheduledList.length > 0) {
      db.update('scheduled_messages', (existing) => [...scheduledList, ...existing]);
    }

    db.logAudit('CAMPAIGN_CREATED', `Created campaign ${campaign.name} with ${campaign.recipientIds.length} recipients`);
    db.addNotification('success', 'Campaign Created', `Campaign "${campaign.name}" created with ${scheduledList.length} queued messages.`);

    res.status(201).json(campaign);
  });

  app.put('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    let found = false;

    db.update('campaigns', (camps) =>
      camps.map((c) => {
        if (c.id === id) {
          found = true;
          return { ...c, ...body, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );

    if (!found) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ success: true });
  });

  app.put('/api/campaigns/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.update('campaigns', (camps) =>
      camps.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );

    // If cancelled, cancel pending scheduled messages for this campaign
    if (status === 'CANCELLED') {
      db.update('scheduled_messages', (messages) =>
        messages.map((m) => (m.campaignId === id && m.status === 'QUEUED' ? { ...m, status: 'CANCELLED' as const } : m))
      );
    }

    db.logAudit('CAMPAIGN_STATUS_UPDATED', `Campaign ${id} status set to ${status}`);
    res.json({ success: true, status });
  });

  app.delete('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;
    db.update('campaigns', (camps) => camps.filter((c) => c.id !== id));
    db.update('scheduled_messages', (msgs) =>
      msgs.map((m) => (m.campaignId === id && m.status === 'QUEUED' ? { ...m, status: 'CANCELLED' as const } : m))
    );
    res.json({ success: true });
  });

  // ---------- MESSAGE COMPOSER & APPROVAL WORKFLOW ----------
  // Workflow: DRAFT -> READY_FOR_REVIEW -> APPROVED -> QUEUED -> SENT
  app.post('/api/messages/compose', (req, res) => {
    const {
      recipientId,
      recipientEmail,
      recipientName,
      subject,
      messageBody,
      attachments = [],
      campaignId,
      campaignName,
      scheduledTime,
      approvalAction, // 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVE_AND_SCHEDULE'
    } = req.body;

    if (!recipientEmail || !subject || !messageBody) {
      return res.status(400).json({ error: 'Recipient, Subject, and Message Body are required' });
    }

    let status: ScheduledMessage['status'] = 'DRAFT';
    if (approvalAction === 'READY_FOR_REVIEW') status = 'READY_FOR_REVIEW';
    if (approvalAction === 'APPROVE_AND_SCHEDULE') status = 'QUEUED';

    const msg: ScheduledMessage = {
      id: 'sched-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      recipientId: recipientId || 'custom',
      recipientEmail: recipientEmail.trim().toLowerCase(),
      recipientName: recipientName || recipientEmail,
      campaignId,
      campaignName,
      subject: subject.trim(),
      messageBody,
      attachments,
      scheduledTime: scheduledTime || new Date().toISOString(),
      status,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.update('scheduled_messages', (list) => [msg, ...list]);
    db.logAudit('MESSAGE_CREATED', `Created outreach draft for ${msg.recipientEmail} (${status})`);
    res.status(201).json(msg);
  });

  // Approve a draft/ready-for-review message
  app.post('/api/messages/:id/approve', (req, res) => {
    const { id } = req.params;
    let approved = false;

    db.update('scheduled_messages', (msgs) =>
      msgs.map((m) => {
        if (m.id === id) {
          approved = true;
          return { ...m, status: 'QUEUED' as const };
        }
        return m;
      })
    );

    if (!approved) return res.status(404).json({ error: 'Message not found' });
    db.logAudit('MESSAGE_APPROVED', `User approved message id ${id} for sending queue`);
    res.json({ success: true, status: 'QUEUED' });
  });

  // Immediate send endpoint
  app.post('/api/messages/send-now', async (req, res) => {
    const {
      recipientId,
      recipientEmail,
      recipientName,
      subject,
      messageBody,
      attachments = [],
      campaignId,
      campaignName,
      forceSendAgain = false,
    } = req.body;

    if (!recipientEmail || !subject || !messageBody) {
      return res.status(400).json({ error: 'Recipient, Subject, and Message Body are required' });
    }

    // Duplicate check unless explicitly instructed
    if (!forceSendAgain && campaignId && isDuplicateSend(recipientEmail, campaignId)) {
      return res.status(409).json({
        error: 'Duplicate protection: Recipient has already received this campaign outreach.',
        canSendAgain: true,
      });
    }

    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);
    if (!primary || !primary.accessToken) {
      return res.status(401).json({
        error: 'Gmail account is not connected. Please connect Gmail in Settings first.',
      });
    }

    if ((primary as any).needsReauth) {
      return res.status(403).json({
        error: 'Updated Workspace permissions required. Please reconnect your Gmail account in the app header or settings.',
      });
    }

    // Server-side daily sending limit check
    const perm = checkSendingPermission(primary.email);
    if (!perm.allowed) {
      return res.status(429).json({
        error: perm.reason || 'Daily sending limit reached (10/10 emails).',
        code: 'DAILY_LIMIT_REACHED',
        sentToday: perm.sentToday,
        dailyLimit: perm.dailyLimit,
      });
    }

    try {
      const settings = db.get('settings');
      const sendResult = await sendGmailMessage({
        accessToken: primary.accessToken,
        to: recipientEmail,
        toName: recipientName,
        subject,
        body: messageBody,
        attachments,
        fromName: settings.profile.name,
        fromEmail: primary.email,
      });

      const sentTime = new Date().toISOString();
      const sentItem: SentMessage = {
        id: 'sent-' + Date.now(),
        recipientId: recipientId || 'custom',
        recipientEmail,
        recipientName: recipientName || recipientEmail,
        campaignId,
        campaignName,
        subject,
        messageBody,
        attachments,
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        sentAt: sentTime,
        status: 'DELIVERED',
      };

      db.update('sent_messages', (list) => [sentItem, ...list]);
      db.logAudit('EMAIL_SENT_IMMEDIATE', `Immediate send to ${recipientEmail} via Gmail. ID: ${sendResult.id}`);
      db.addNotification('success', 'Email Sent', `Email delivered to ${recipientName || recipientEmail}`);

      res.json({
        success: true,
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        sentAt: sentTime,
      });
    } catch (err: any) {
      console.error('Immediate send failed:', err);
      res.status(500).json({ error: err.message || 'Failed to send email via Gmail' });
    }
  });

  // ---------- SCHEDULED QUEUE ----------
  app.get('/api/scheduled', (req, res) => {
    res.json(db.get('scheduled_messages'));
  });

  app.post('/api/scheduled/:id/retry', (req, res) => {
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
            retryCount: 0,
            scheduledTime: new Date().toISOString(),
          };
        }
        return m;
      })
    );
    if (!found) {
      return res.status(404).json({ error: 'Message not found' });
    }
    db.logAudit('MESSAGE_RETRIED', `Re-queued failed message ${id} for dispatch`);
    res.json({ success: true, message: 'Message re-queued' });
  });

  app.delete('/api/scheduled/:id', (req, res) => {
    const { id } = req.params;
    db.update('scheduled_messages', (list) =>
      list.map((m) => (m.id === id ? { ...m, status: 'CANCELLED' as const } : m))
    );
    db.logAudit('MESSAGE_CANCELLED', `Cancelled scheduled message ${id}`);
    res.json({ success: true });
  });

  // ---------- SENT MESSAGES ----------
  app.get('/api/sent', (req, res) => {
    res.json(db.get('sent_messages'));
  });

  // ---------- RESPONSES / INCOMING EMAILS ----------
  app.get('/api/responses', (req, res) => {
    res.json(db.get('incoming_messages'));
  });

  app.post('/api/responses/sync', async (req, res) => {
    try {
      const result = await syncGmailReplies();
      res.json({ success: true, newReplies: result.newRepliesCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to sync replies from Gmail' });
    }
  });

  app.put('/api/responses/:id/status', (req, res) => {
    const { id } = req.params;
    const { userResponseStatus } = req.body;
    db.update('incoming_messages', (incs) =>
      incs.map((m) => (m.id === id ? { ...m, userResponseStatus } : m))
    );
    res.json({ success: true });
  });

  // ---------- FOLLOW-UPS ----------
  app.get('/api/follow-ups', (req, res) => {
    res.json({
      rules: db.get('follow_ups'),
      instances: db.get('follow_up_instances'),
    });
  });

  app.post('/api/follow-ups', (req, res) => {
    const body = req.body;
    const rule = {
      id: 'fu-rule-' + Date.now(),
      campaignId: body.campaignId,
      campaignName: body.campaignName || 'Campaign Follow-up',
      stepNumber: Number(body.stepNumber) || 1,
      daysAfterPrevious: Number(body.daysAfterPrevious) || 7,
      subjectTemplate: body.subjectTemplate || 'Following up: {{role}} at {{company}}',
      messageTemplate: body.messageTemplate || 'Hi {{first_name}}, gentle follow-up...',
      status: 'ACTIVE' as const,
      stopOnReply: true,
    };
    db.update('follow_ups', (rules) => [rule, ...rules]);
    res.status(201).json(rule);
  });

  app.put('/api/follow-ups/:id/toggle', (req, res) => {
    const { id } = req.params;
    db.update('follow_ups', (rules) =>
      rules.map((r) => (r.id === id ? { ...r, status: (r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE') as 'ACTIVE' | 'PAUSED' } : r))
    );
    res.json({ success: true });
  });

  // ---------- TEMPLATES ----------
  app.get('/api/templates', (req, res) => {
    res.json(db.get('templates'));
  });

  app.post('/api/templates', (req, res) => {
    const body = req.body;
    const tpl: Template = {
      id: 'tpl-' + Date.now(),
      title: body.title || 'Untitled Template',
      category: body.category || 'Job Outreach',
      subject: body.subject || '',
      body: body.body || '',
      variables: body.variables || ['{{first_name}}', '{{company}}', '{{role}}'],
      createdAt: new Date().toISOString(),
    };
    db.update('templates', (tpls) => [tpl, ...tpls]);
    res.status(201).json(tpl);
  });

  app.delete('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    db.update('templates', (tpls) => tpls.filter((t) => t.id !== id));
    res.json({ success: true });
  });

  // ---------- FILES & ATTACHMENTS ----------
  app.get('/api/files', (req, res) => {
    res.json(db.get('attachments'));
  });

  app.post('/api/files/upload', (req, res) => {
    const { name, size, mimeType, category, dataBase64 } = req.body;
    if (!name) return res.status(400).json({ error: 'File name is required' });

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
  });

  app.delete('/api/files/:id', (req, res) => {
    const { id } = req.params;
    db.update('attachments', (files) => files.filter((f) => f.id !== id));
    res.json({ success: true });
  });

  // Google Drive Files Proxy
  app.get('/api/drive/files', async (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);
    if (!primary || !primary.accessToken) {
      return res.status(401).json({ error: 'Google Drive requires connected Google account' });
    }

    try {
      const files = await listGoogleDriveFiles(primary.accessToken, 30);
      res.json(files);
    } catch (err: any) {
      console.error('Error fetching Google Drive files:', err);
      res.status(500).json({ error: err.message || 'Failed to list Google Drive files' });
    }
  });

  // Google Sheets Contacts Import
  app.post('/api/sheets/import-contacts', async (req, res) => {
    const { spreadsheetId, range = 'A1:Z100' } = req.body;
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'spreadsheetId is required' });
    }

    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts.find((a) => a.isConnected && a.accessToken);
    if (!primary || !primary.accessToken) {
      return res.status(401).json({ error: 'Google account not connected' });
    }

    try {
      const values = await readGoogleSpreadsheet(primary.accessToken, spreadsheetId, range);
      if (!values || values.length < 2) {
        return res.status(400).json({ error: 'Spreadsheet has no data rows' });
      }

      // First row is header
      const headers = values[0].map((h) => h.toLowerCase().trim());
      const nameIdx = headers.findIndex((h) => h.includes('name'));
      const emailIdx = headers.findIndex((h) => h.includes('email'));
      const orgIdx = headers.findIndex((h) => h.includes('company') || h.includes('organization') || h.includes('university'));
      const roleIdx = headers.findIndex((h) => h.includes('role') || h.includes('title'));
      const countryIdx = headers.findIndex((h) => h.includes('country'));

      const imported: Contact[] = [];
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const email = emailIdx !== -1 ? row[emailIdx] : null;
        const name = nameIdx !== -1 ? row[nameIdx] : null;
        if (!email || !name) continue;

        const c: Contact = {
          id: 'c-' + Date.now() + '-' + i,
          name: String(name).trim(),
          email: String(email).trim().toLowerCase(),
          organization: orgIdx !== -1 ? String(row[orgIdx] || '') : '',
          organizationType: 'HR',
          role: roleIdx !== -1 ? String(row[roleIdx] || '') : '',
          country: countryIdx !== -1 ? String(row[countryIdx] || '') : 'Global',
          tags: ['Sheets-Import'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        imported.push(c);
      }

      db.update('contacts', (existing) => [...imported, ...existing]);
      db.logAudit('SHEETS_IMPORTED', `Imported ${imported.length} contacts from Google Sheet ${spreadsheetId}`);
      res.json({ success: true, count: imported.length });
    } catch (err: any) {
      console.error('Google Sheets import error:', err);
      res.status(500).json({ error: err.message || 'Failed to read Google Sheet' });
    }
  });

  // ---------- GEMINI AI ENDPOINTS ----------
  app.post('/api/ai/improve', async (req, res) => {
    try {
      const { content, instruction, contactContext } = req.body;
      const result = await improveMessage(content, instruction, contactContext);
      res.json({ text: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/subject', async (req, res) => {
    try {
      const { content, role, organization, candidateName } = req.body;
      const subjects = await generateSubject(content, role, organization, candidateName);
      res.json({ subjects });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/personalize', async (req, res) => {
    try {
      const { template, contact } = req.body;
      const settings = db.get('settings');
      const personalized = await personalizeMessage(template, contact, settings.profile);
      res.json({ text: personalized });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/follow-up', async (req, res) => {
    try {
      const { originalSubject, originalBody, stepNumber, contactName } = req.body;
      const followUp = await generateFollowUp(originalSubject, originalBody, stepNumber || 1, contactName || 'there');
      res.json(followUp);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/summarize-jd', async (req, res) => {
    try {
      const { jdText } = req.body;
      const summary = await summarizeJobDescription(jdText);
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/draft-response', async (req, res) => {
    try {
      const { incomingSubject, incomingBody, originalOutreach } = req.body;
      const settings = db.get('settings');
      const draft = await draftReplyResponse(incomingSubject, incomingBody, originalOutreach, settings.profile);
      res.json({ draft });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------- SETTINGS ----------
  app.get('/api/settings', (req, res) => {
    res.json(db.get('settings'));
  });

  app.put('/api/settings', (req, res) => {
    const newSettings = req.body;
    if (newSettings.sendingLimits) {
      newSettings.automation = {
        ...newSettings.automation,
        dailyLimit: newSettings.sendingLimits.maxEmailsPerDay ?? newSettings.automation?.dailyLimit ?? 5,
        delayMinutes: Math.round((newSettings.sendingLimits.delaySecondsBetweenSends ?? 600) / 60),
        timezone: newSettings.sendingLimits.timezone ?? 'Asia/Kolkata',
        automaticSending: newSettings.automation?.automaticSending ?? true,
        automaticFollowUp: newSettings.automation?.automaticFollowUp ?? true,
      };
    }
    if (newSettings.defaultSignature) {
      newSettings.email = {
        ...newSettings.email,
        defaultSignature: newSettings.defaultSignature,
      };
    }
    if (newSettings.aiSettings) {
      newSettings.ai = {
        ...newSettings.ai,
        replyClassification: newSettings.aiSettings.autoCategorizeReplies ?? true,
      };
    }
    db.set('settings', newSettings);
    db.logAudit('SETTINGS_UPDATED', 'User updated application preferences & profile');
    res.json({ success: true, settings: newSettings });
  });

  // ---------- NOTIFICATIONS & AUDIT ----------
  app.get('/api/notifications', (req, res) => {
    res.json(db.get('notifications'));
  });

  app.post('/api/notifications/read-all', (req, res) => {
    db.update('notifications', (notifs) => notifs.map((n) => ({ ...n, read: true })));
    res.json({ success: true });
  });

  app.get('/api/audit-logs', (req, res) => {
    res.json(db.get('audit_logs'));
  });

  // ---------- ADMIN MANAGEMENT ----------
  app.get('/api/admin/system', (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';

    if (!isUserAdmin(userEmail)) {
      return res.status(403).json({ error: 'Access denied: Admin role required.' });
    }

    const contacts = db.get('contacts');
    const campaigns = db.get('campaigns');
    const scheduled = db.get('scheduled_messages');
    const sent = db.get('sent_messages');
    const incoming = db.get('incoming_messages');
    const auditLogs = db.get('audit_logs');

    res.json({
      role: 'ADMIN',
      adminEmail: ADMIN_EMAIL,
      currentAccount: primary.email || 'None',
      isGmailConnected: Boolean(primary.isConnected && primary.accessToken),
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

  app.post('/api/admin/reset-data', (req, res) => {
    const gmailAccounts = db.get('gmail_accounts');
    const primary = gmailAccounts[0] || { isConnected: false };
    const userEmail = (req.headers['x-user-email'] as string) || primary.email || '';

    if (!isUserAdmin(userEmail)) {
      return res.status(403).json({ error: 'Access denied: Admin role required.' });
    }

    db.resetUserData();
    db.logAudit('ADMIN_DATA_RESET', `Admin (${userEmail}) performed complete data reset.`);
    res.json({ success: true, message: 'Application user data has been completely reset to zero-state.' });
  });

  // Direct database download / export endpoints
  const handleDbDownload = (req: express.Request, res: express.Response) => {
    const dbFilePath = db.getDbFilePath();
    if (!fs.existsSync(dbFilePath)) {
      db.set('contacts', []);
    }
    res.setHeader('Content-Disposition', 'attachment; filename="db.json"');
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(dbFilePath);
  };

  app.get('/api/db/download', handleDbDownload);
  app.get('/api/admin/export-db', handleDbDownload);
  app.get('/data/db.json', (req, res) => {
    const dbFilePath = db.getDbFilePath();
    if (!fs.existsSync(dbFilePath)) {
      db.set('contacts', []);
    }
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(dbFilePath);
  });

  // ================= VITE / FRONTEND SERVING =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OutreachOS server running on port ${PORT}`);
  });
}

startServer();
