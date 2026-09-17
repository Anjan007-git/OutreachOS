import { db } from './db.js';
import {
  sendGmailMessage,
  searchGmailMessages,
  getGmailMessage,
  getHeader,
  extractBodyText,
  parseEmailRecipient,
  inferOrganizationFromEmail,
} from './gmail.js';
import { classifyIncomingReply } from './gemini.js';
import { ScheduledMessage, SentMessage, IncomingMessage, Contact } from '../src/types.js';
import { interpolateVariables } from '../src/lib/variables.js';
import { resolveAttachmentsForEmail } from './attachments.js';

export const ADMIN_EMAIL = 'anjanp93722@gmail.com';
export const STANDARD_USER_DAILY_LIMIT = 10;

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function checkSendingPermission(senderEmail?: string | null): {
  allowed: boolean;
  role: 'ADMIN' | 'USER';
  sentToday: number;
  dailyLimit: number | 'UNLIMITED';
  remainingToday: number | 'UNLIMITED';
  reason?: string;
} {
  const sentToday = getSentCountToday();
  const isAdmin = isUserAdmin(senderEmail);

  if (isAdmin) {
    return {
      allowed: true,
      role: 'ADMIN',
      sentToday,
      dailyLimit: 'UNLIMITED',
      remainingToday: 'UNLIMITED',
    };
  }

  const remaining = Math.max(0, STANDARD_USER_DAILY_LIMIT - sentToday);
  const allowed = sentToday < STANDARD_USER_DAILY_LIMIT;

  return {
    allowed,
    role: 'USER',
    sentToday,
    dailyLimit: STANDARD_USER_DAILY_LIMIT,
    remainingToday: remaining,
    reason: allowed
      ? undefined
      : `Daily sending limit reached (${STANDARD_USER_DAILY_LIMIT}/${STANDARD_USER_DAILY_LIMIT}). Automatic sending is paused until tomorrow.`,
  };
}

let isRunning = false;
let lastSyncTimestamp = 0;

/**
 * Checks how many emails were sent today in user's configured timezone (e.g. Asia/Kolkata)
 */
export function getSentCountToday(): number {
  const sentMessages = db.get('sent_messages');
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return sentMessages.filter((m) => {
    const sentTime = new Date(m.sentAt).getTime();
    return sentTime >= startOfDay;
  }).length;
}

/**
 * Gets time elapsed in minutes since the last email was sent
 */
export function getMinutesSinceLastSend(): number {
  const sentMessages = db.get('sent_messages');
  if (!sentMessages || sentMessages.length === 0) return 9999;

  const sorted = [...sentMessages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
  const lastTime = new Date(sorted[0].sentAt).getTime();
  const diffMs = Date.now() - lastTime;
  return diffMs / (1000 * 60);
}

/**
 * Check if contact already received this campaign message (Duplicate protection)
 */
export function isDuplicateSend(contactEmail: string, campaignId?: string): boolean {
  if (!campaignId) return false;
  const sentMessages = db.get('sent_messages');
  return sentMessages.some(
    (m) =>
      m.recipientEmail.toLowerCase() === contactEmail.toLowerCase() &&
      m.campaignId === campaignId
  );
}

/**
 * Process the outbound queue according to rules:
 * - Campaign status must be ACTIVE (or individual message approved)
 * - Automatic sending setting must be respected
 * - Daily sending limit
 * - Delay between consecutive sends
 * - Valid Gmail connection & access token
 */
export async function processOutboundQueue(): Promise<{ processed: number; reason?: string }> {
  if (isRunning) return { processed: 0, reason: 'Already running' };
  isRunning = true;

  try {
    const settings = db.get('settings');
    const gmailAccounts = db.get('gmail_accounts');
    const primaryAccount = gmailAccounts.find((a) => a.isConnected && a.accessToken);

    if (!primaryAccount || !primaryAccount.accessToken || (primaryAccount as any).needsReauth) {
      return { processed: 0, reason: 'No active Gmail connection' };
    }

    if (!settings.automation.automaticSending) {
      return { processed: 0, reason: 'Automated sending disabled' };
    }

    const scheduled = db.get('scheduled_messages');
    const now = new Date();

    // Find messages ready to be dispatched
    const readyMessages = scheduled.filter((m) => {
      if (m.status !== 'QUEUED' && m.status !== 'APPROVED') return false;
      const scheduledTime = new Date(m.scheduledTime);
      return scheduledTime <= now;
    });

    if (readyMessages.length === 0) return { processed: 0, reason: 'Queue empty' };

    // Check server-side daily sending limit & user role permission
    const perm = checkSendingPermission(primaryAccount.email);
    if (!perm.allowed) {
      return { processed: 0, reason: perm.reason || 'Daily sending limit reached' };
    }

    // Check delay between emails
    const requiredDelayMinutes = settings.automation.delayMinutes || 10;
    const minutesSinceLast = getMinutesSinceLastSend();
    if (minutesSinceLast < requiredDelayMinutes) {
      return { processed: 0, reason: `Delay cooldown: ${Math.round(requiredDelayMinutes - minutesSinceLast)}m remaining` };
    }

    // Pick the first queued message
    const msg = readyMessages[0];

    // Check campaign status if part of a campaign
    if (msg.campaignId) {
      const campaigns = db.get('campaigns');
      const campaign = campaigns.find((c) => c.id === msg.campaignId);
      if (campaign && campaign.status !== 'ACTIVE') {
        return; // Campaign is PAUSED, COMPLETED, or CANCELLED
      }
    }

    // Duplicate protection check
    if (msg.campaignId && isDuplicateSend(msg.recipientEmail, msg.campaignId)) {
      db.update('scheduled_messages', (list) =>
        list.map((item) =>
          item.id === msg.id
            ? {
                ...item,
                status: 'FAILED' as const,
                error: 'Prevented duplicate send: recipient already received this campaign.',
              }
            : item
        )
      );
      db.logAudit(
        'DUPLICATE_PREVENTED',
        `Blocked duplicate send to ${msg.recipientEmail} for campaign ${msg.campaignName}`,
        'ERROR'
      );
      return;
    }

    // Attempt Gmail send
    try {
      // Find matching contact for accurate variable interpolation
      const contact = msg.recipientId
        ? db.get('contacts').find((c) => c.id === msg.recipientId)
        : db.get('contacts').find((c) => c.email.toLowerCase() === msg.recipientEmail.toLowerCase());

      const finalSubject = interpolateVariables(msg.subject, {
        contact,
        customName: msg.recipientName,
        customEmail: msg.recipientEmail,
        settings,
      }, true);

      const finalBody = interpolateVariables(msg.messageBody, {
        contact,
        customName: msg.recipientName,
        customEmail: msg.recipientEmail,
        settings,
      }, true);

      // Resolve attachments from storage / Google Drive into base64 payload
      const resolvedAttachments = await resolveAttachmentsForEmail(
        msg.attachments || [],
        primaryAccount.accessToken
      );

      const sendResult = await sendGmailMessage({
        accessToken: primaryAccount.accessToken,
        to: msg.recipientEmail,
        toName: msg.recipientName,
        subject: finalSubject,
        body: finalBody,
        attachments: resolvedAttachments,
        fromName: settings.profile.name,
        fromEmail: primaryAccount.email,
      });

      const sentTime = new Date().toISOString();

      // Record in sent_messages
      const sentItem: SentMessage = {
        id: 'sent-' + Date.now(),
        userId: msg.userId || 'user-1',
        userEmail: msg.userEmail || primaryAccount.email,
        recipientId: msg.recipientId,
        recipientEmail: msg.recipientEmail,
        recipientName: msg.recipientName,
        campaignId: msg.campaignId,
        campaignName: msg.campaignName,
        templateId: msg.templateId,
        subject: finalSubject,
        messageBody: finalBody,
        body: finalBody,
        attachments: resolvedAttachments,
        attachmentIds: (msg.attachments || []).map((a: any) => a.id || a.fileId).filter(Boolean),
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        sentAt: sentTime,
        status: 'DELIVERED',
        scheduledTime: msg.scheduledTime,
        providerMetadata: {
          id: sendResult.id,
          threadId: sendResult.threadId,
        },
      };

      db.update('sent_messages', (sent) => [sentItem, ...sent]);

      // Update scheduled message status
      db.update('scheduled_messages', (list) =>
        list.map((item) =>
          item.id === msg.id
            ? {
                ...item,
                status: 'SENT' as const,
                sentTime,
                gmailMessageId: sendResult.id,
                gmailThreadId: sendResult.threadId,
              }
            : item
        )
      );

      // Track thread
      db.update('email_threads', (threads) => {
        const existing = threads.find((t) => t.threadId === sendResult.threadId);
        if (existing) {
          return threads.map((t) =>
            t.threadId === sendResult.threadId
              ? { ...t, lastMessageAt: sentTime, messageCount: t.messageCount + 1 }
              : t
          );
        }
        return [
          ...threads,
          {
            threadId: sendResult.threadId,
            contactEmail: msg.recipientEmail,
            campaignId: msg.campaignId,
            lastMessageAt: sentTime,
            messageCount: 1,
          },
        ];
      });

      db.logAudit(
        'EMAIL_SENT',
        `Dispatched email to ${msg.recipientName} <${msg.recipientEmail}> (Thread: ${sendResult.threadId})`
      );

      db.addNotification(
        'success',
        'Email Dispatched',
        `Successfully sent email to ${msg.recipientName} (${msg.subject})`
      );

      // Schedule follow-ups if enabled and campaign has follow-up rules
      if (settings.automation.automaticFollowUp && msg.campaignId) {
        const rules = db.get('follow_ups').filter((r) => r.campaignId === msg.campaignId && r.status === 'ACTIVE');
        for (const rule of rules) {
          const scheduledFor = new Date(Date.now() + rule.daysAfterPrevious * 86400000).toISOString();
          db.update('follow_up_instances', (instances) => [
            ...instances,
            {
              id: 'fui-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
              ruleId: rule.id,
              contactId: msg.recipientId,
              contactEmail: msg.recipientEmail,
              contactName: msg.recipientName,
              campaignId: msg.campaignId!,
              scheduledFor,
              status: 'SCHEDULED',
              previousMessageId: sendResult.id,
            },
          ]);
        }
      }
      return { processed: 1 };
    } catch (sendErr: any) {
      const errMsg = sendErr.message || 'Unknown send error';
      console.error('Failed to send queued email:', errMsg);

      const isScopeError =
        errMsg.includes('insufficient authentication scopes') ||
        errMsg.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT') ||
        errMsg.includes('invalid_grant');

      const is401Error =
        errMsg.includes('401') ||
        errMsg.includes('invalid authentication credentials') ||
        errMsg.includes('Token has been expired') ||
        errMsg.includes('invalid_token') ||
        sendErr?.status === 401;

      if (isScopeError || is401Error) {
        db.update('gmail_accounts', (accs) =>
          accs.map((a) => (a.email === primaryAccount.email ? { ...a, needsReauth: true } : a))
        );
        db.addNotification(
          'warning',
          'Gmail Authorization Required',
          isScopeError
            ? 'Updated Workspace permissions are required to dispatch emails. Please reconnect your Gmail account.'
            : 'Your Gmail access token has expired. Please click "Authorize Gmail" in Settings or the header to resume sending.'
        );
        console.warn(`Gmail outbound queue paused: Account ${primaryAccount.email} credentials expired or require re-authorization.`);
        try {
          db.flush();
        } catch {}
      }

      db.update('scheduled_messages', (list) =>
        list.map((item) =>
          item.id === msg.id
            ? {
                ...item,
                status: 'FAILED' as const,
                retryCount: (item.retryCount || 0) + 1,
                error: errMsg,
              }
            : item
        )
      );
      db.logAudit(
        'SEND_FAILED',
        `Failed send to ${msg.recipientEmail}: ${errMsg}`,
        'ERROR'
      );
      db.addNotification(
        'error',
        'Email Send Failed',
        `Failed to send email to ${msg.recipientEmail}: ${errMsg}`
      );
      return { processed: 0, reason: errMsg };
    }
  } catch (err: any) {
    console.error('Outbound queue processing error:', err);
    return { processed: 0, reason: err.message || 'Processing error' };
  } finally {
    isRunning = false;
  }
}

/**
 * Periodically polls Gmail for incoming replies and matches them to campaigns & sent messages
 */
export async function syncGmailReplies(targetUserId?: string, targetUserEmail?: string): Promise<{ newRepliesCount: number }> {
  const gmailAccounts = db.get('gmail_accounts');
  const account = gmailAccounts.find((a) => a.isConnected && a.accessToken);
  if (!account || !account.accessToken || (account as any).needsReauth) {
    return { newRepliesCount: 0 };
  }

  try {
    // Search recent inbox messages addressed to the user
    const messages = await searchGmailMessages(account.accessToken, 'to:me newer_than:7d', 15);
    if (!messages || messages.length === 0) {
      db.update('gmail_accounts', (accs) =>
        accs.map((a) => (a.email === account.email ? { ...a, lastSyncTime: new Date().toISOString() } : a))
      );
      return { newRepliesCount: 0 };
    }

    const incomingMessages = db.get('incoming_messages');
    const sentMessages = db.get('sent_messages');
    const contacts = db.get('contacts');
    let newCount = 0;

    for (const m of messages) {
      // Check if we already processed this message
      const alreadyStored = incomingMessages.some((inc) => inc.gmailMessageId === m.id);
      if (alreadyStored) continue;

      try {
        const fullMsg = await getGmailMessage(account.accessToken, m.id);
        const headers = fullMsg.payload?.headers || [];
        const fromHeader = getHeader(headers, 'From');
        const subjectHeader = getHeader(headers, 'Subject');
        const dateHeader = getHeader(headers, 'Date');
        const threadId = fullMsg.threadId;

        // Parse sender email
        const emailMatch = fromHeader.match(/<([^>]+)>/) || [null, fromHeader];
        const senderEmail = (emailMatch[1] || fromHeader).trim().toLowerCase();

        // Match against our contacts or sent messages
        const matchedContact = contacts.find((c) => c.email.toLowerCase() === senderEmail);
        const matchedSent = sentMessages.find(
          (s) =>
            s.gmailThreadId === threadId ||
            s.recipientEmail.toLowerCase() === senderEmail ||
            (subjectHeader.toLowerCase().includes(s.subject.toLowerCase().replace(/^re:\s*/i, '')) && s.recipientEmail.toLowerCase() === senderEmail)
        );

        // Only store if matched to outreach sent or existing contact!
        if (matchedContact || matchedSent) {
          const bodyText = extractBodyText(fullMsg.payload);
          const snippet = fullMsg.snippet || bodyText.slice(0, 160);

          // AI classification
          const classificationResult = await classifyIncomingReply(
            subjectHeader,
            bodyText,
            matchedSent?.subject,
            matchedSent?.messageBody
          );

          const newInc: IncomingMessage = {
            id: 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
            userId: targetUserId || matchedSent?.userId || matchedContact?.userId || 'user-1',
            userEmail: targetUserEmail || account.email,
            contactId: matchedContact?.id || matchedSent?.recipientId,
            contactName: matchedContact?.name || matchedSent?.recipientName || fromHeader,
            contactEmail: senderEmail,
            organization: matchedContact?.organization,
            campaignId: matchedSent?.campaignId,
            campaignName: matchedSent?.campaignName,
            gmailMessageId: m.id,
            gmailThreadId: threadId,
            subject: subjectHeader,
            snippet,
            bodyText,
            receivedDate: dateHeader ? new Date(dateHeader).toISOString() : new Date().toISOString(),
            originalOutreachSnippet: matchedSent?.messageBody?.slice(0, 200),
            classification: classificationResult.classification,
            classificationReason: classificationResult.reason,
            userResponseStatus: 'PENDING',
          };

          db.update('incoming_messages', (incs) => [newInc, ...incs]);
          newCount++;

          // Mark corresponding sent message as REPLIED
          if (matchedSent) {
            db.update('sent_messages', (sents) =>
              sents.map((s) => (s.id === matchedSent.id ? { ...s, status: 'REPLIED' as const } : s))
            );
          }

          // STOP FUTURE FOLLOW-UPS FOR THIS CONTACT & CAMPAIGN!
          db.update('follow_up_instances', (instances) =>
            instances.map((f) =>
              f.contactEmail.toLowerCase() === senderEmail && (!matchedSent?.campaignId || f.campaignId === matchedSent.campaignId)
                ? { ...f, status: 'STOPPED_REPLY_RECEIVED' as const }
                : f
            )
          );

          db.logAudit(
            'REPLY_DETECTED',
            `Matched incoming reply from ${senderEmail} (${classificationResult.classification})`
          );

          db.addNotification(
            'success',
            'New Reply Received',
            `Received response from ${matchedContact?.name || senderEmail} (${classificationResult.classification})`
          );
        }
      } catch (msgErr: any) {
        const msgErrMsg = msgErr?.message || String(msgErr);
        if (
          msgErrMsg.includes('401') ||
          msgErrMsg.includes('invalid authentication credentials') ||
          msgErrMsg.includes('invalid_token') ||
          msgErr?.status === 401
        ) {
          db.update('gmail_accounts', (accs) =>
            accs.map((a) => (a.email === account.email ? { ...a, needsReauth: true } : a))
          );
          console.warn(`Gmail token expired while fetching reply message ${m.id}. Marked account for re-authorization.`);
          try {
            db.flush();
          } catch {}
          break;
        }
        console.warn('Could not parse incoming message ' + m.id, msgErrMsg);
      }
    }

    db.update('gmail_accounts', (accs) =>
      accs.map((a) => (a.email === account.email ? { ...a, lastSyncTime: new Date().toISOString() } : a))
    );

    return { newRepliesCount: newCount };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isScopeError =
      errMsg.includes('insufficient authentication scopes') ||
      errMsg.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT') ||
      errMsg.includes('invalid_grant');

    const is401Error =
      errMsg.includes('401') ||
      errMsg.includes('invalid authentication credentials') ||
      errMsg.includes('Token has been expired') ||
      errMsg.includes('invalid_token') ||
      err?.status === 401;

    if (isScopeError || is401Error) {
      db.update('gmail_accounts', (accs) =>
        accs.map((a) => (a.email === account.email ? { ...a, needsReauth: true } : a))
      );
      console.warn(`Gmail reply sync paused for ${account.email}: ${isScopeError ? 'scopes updated' : 'credentials expired'}. Requires re-authorization.`);
      try {
        db.flush();
      } catch {}
    } else {
      console.error('Error during Gmail reply sync:', err);
    }
    return { newRepliesCount: 0 };
  }
}

/**
 * Synchronizes recent sent messages from Gmail into OutreachOS.
 * Discovers any cold emails sent directly or during previous sessions,
 * populates contacts, logs sent messages, tracks threads, and updates campaign stats.
 */
export async function syncGmailSent(targetUserId?: string, targetUserEmail?: string): Promise<{ newSentCount: number; newContactsCount: number }> {
  const gmailAccounts = db.get('gmail_accounts');
  const account = gmailAccounts.find((a) => a.isConnected && a.accessToken);
  if (!account || !account.accessToken || (account as any).needsReauth) {
    return { newSentCount: 0, newContactsCount: 0 };
  }

  try {
    // Search recent sent messages from this user's Gmail
    const messages = await searchGmailMessages(account.accessToken, 'from:me newer_than:30d', 40);
    if (!messages || messages.length === 0) {
      return { newSentCount: 0, newContactsCount: 0 };
    }

    const sentMessages = db.get('sent_messages') || [];
    const contacts = db.get('contacts') || [];
    const defaultCamp = db.get('campaigns').find((c) => c.status === 'ACTIVE') || db.get('campaigns')[0];

    let newSentCount = 0;
    let newContactsCount = 0;

    for (const m of messages) {
      // Check if already in sent_messages
      const alreadyStored = sentMessages.some((s) => s.gmailMessageId === m.id);
      if (alreadyStored) continue;

      try {
        const fullMsg = await getGmailMessage(account.accessToken, m.id);
        const headers = fullMsg.payload?.headers || [];
        const toHeader = getHeader(headers, 'To');
        const subjectHeader = getHeader(headers, 'Subject') || '(No Subject)';
        const dateHeader = getHeader(headers, 'Date');
        const threadId = fullMsg.threadId || m.threadId;

        if (!toHeader) continue;

        const recipient = parseEmailRecipient(toHeader);
        if (!recipient.email || recipient.email.toLowerCase() === account.email.toLowerCase()) {
          continue; // Skip self-sent or invalid
        }

        const internalMs = parseInt(fullMsg.internalDate, 10);
        const sentTime = !isNaN(internalMs)
          ? new Date(internalMs).toISOString()
          : (dateHeader ? new Date(dateHeader).toISOString() : new Date().toISOString());

        // Check if contact already exists
        let contact = contacts.find((c) => c.email.toLowerCase() === recipient.email.toLowerCase());
        let contactId = contact?.id;

        if (!contact) {
          const inferredOrg = inferOrganizationFromEmail(recipient.email);
          contactId = 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
          const newContact: Contact = {
            id: contactId,
            userId: targetUserId || 'user-1',
            userEmail: targetUserEmail || account.email,
            name: recipient.name || recipient.email.split('@')[0],
            email: recipient.email,
            organization: inferredOrg,
            organizationType: 'Company',
            role: 'Prospect',
            country: 'United States',
            tags: ['Outreach Contact', 'Gmail Sent'],
            status: 'CONTACTED',
            createdAt: sentTime,
            updatedAt: sentTime,
            lastContactedAt: sentTime,
            notes: 'Imported from connected Gmail sent history',
          };
          db.update('contacts', (prev) => [newContact, ...prev]);
          contacts.unshift(newContact);
          newContactsCount++;
        } else {
          // Update status if needed
          if (contact.status === 'PROSPECT') {
            db.update('contacts', (prev) =>
              prev.map((c) => (c.id === contact!.id ? { ...c, status: 'CONTACTED', lastContactedAt: sentTime } : c))
            );
          }
        }

        const bodyText = extractBodyText(fullMsg.payload) || fullMsg.snippet || '';
        const sentItem: SentMessage = {
          id: 'sent-' + m.id,
          userId: targetUserId || 'user-1',
          userEmail: targetUserEmail || account.email,
          gmailMessageId: m.id,
          gmailThreadId: threadId,
          recipientId: contactId || 'contact-' + recipient.email,
          recipientName: recipient.name || recipient.email.split('@')[0],
          recipientEmail: recipient.email,
          subject: subjectHeader,
          messageBody: bodyText,
          body: bodyText,
          attachments: [],
          campaignId: defaultCamp?.id,
          campaignName: defaultCamp?.name,
          sentAt: sentTime,
          status: 'DELIVERED',
        };

        db.update('sent_messages', (prev) => [sentItem, ...prev]);
        sentMessages.unshift(sentItem);
        newSentCount++;

        // Thread tracking
        db.update('email_threads', (threads) => {
          const existing = threads.find((t) => t.threadId === threadId);
          if (existing) {
            return threads.map((t) =>
              t.threadId === threadId ? { ...t, lastMessageAt: sentTime, messageCount: t.messageCount + 1 } : t
            );
          }
          return [
            ...threads,
            {
              threadId,
              contactEmail: recipient.email,
              campaignId: defaultCamp?.id,
              lastMessageAt: sentTime,
              messageCount: 1,
            },
          ];
        });

        // If default campaign exists, increment sent count
        if (defaultCamp) {
          db.update('campaigns', (camps) =>
            camps.map((c) =>
              c.id === defaultCamp.id ? { ...c, sentCount: (c.sentCount || 0) + 1 } : c
            )
          );
        }
      } catch (msgErr: any) {
        const msgErrMsg = msgErr?.message || String(msgErr);
        if (
          msgErrMsg.includes('401') ||
          msgErrMsg.includes('invalid authentication credentials') ||
          msgErrMsg.includes('invalid_token') ||
          msgErr?.status === 401
        ) {
          db.update('gmail_accounts', (accs) =>
            accs.map((a) => (a.email === account.email ? { ...a, needsReauth: true } : a))
          );
          console.warn(`Gmail token expired while fetching sent message ${m.id}. Marked account for re-authorization.`);
          try {
            db.flush();
          } catch {}
          break;
        }
        console.warn(`Could not parse sent message ${m.id}:`, msgErrMsg);
      }
    }

    if (newSentCount > 0) {
      db.logAudit(
        'GMAIL_SENT_SYNCED',
        `Synchronized ${newSentCount} sent messages and ${newContactsCount} contacts from Gmail`
      );
      await db.flush();
    }

    return { newSentCount, newContactsCount };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isScopeError =
      errMsg.includes('insufficient authentication scopes') ||
      errMsg.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT') ||
      errMsg.includes('invalid_grant');

    const is401Error =
      errMsg.includes('401') ||
      errMsg.includes('invalid authentication credentials') ||
      errMsg.includes('Token has been expired') ||
      errMsg.includes('invalid_token') ||
      err?.status === 401;

    if (isScopeError || is401Error) {
      db.update('gmail_accounts', (accs) =>
        accs.map((a) => (a.email === account.email ? { ...a, needsReauth: true } : a))
      );
      console.warn(`Gmail sent sync paused for ${account.email}: ${isScopeError ? 'scopes updated' : 'credentials expired'}. Requires re-authorization.`);
      try {
        db.flush();
      } catch {}
    } else {
      console.error('Error in syncGmailSent:', err);
    }
    return { newSentCount: 0, newContactsCount: 0 };
  }
}

/**
 * Initializes the background queue runner
 */
export function startScheduler() {
  console.log('OutreachOS background scheduler initialized');

  // Run outbound queue check every 30 seconds
  setInterval(async () => {
    try {
      await processOutboundQueue();
    } catch (e) {
      console.error('Scheduler queue error:', e);
    }
  }, 30 * 1000);

  // Poll Gmail sent & replies every 2 minutes
  setInterval(async () => {
    try {
      const now = Date.now();
      if (now - lastSyncTimestamp > 2 * 60 * 1000) {
        lastSyncTimestamp = now;
        await syncGmailSent();
        await syncGmailReplies();
      }
    } catch (e) {
      console.error('Scheduler sync error:', e);
    }
  }, 60 * 1000);
}
