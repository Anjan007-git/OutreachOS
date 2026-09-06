import { db } from './db.js';
import { sendGmailMessage, searchGmailMessages, getGmailMessage, getHeader, extractBodyText } from './gmail.js';
import { classifyIncomingReply } from './gemini.js';
import { ScheduledMessage, SentMessage, IncomingMessage } from '../src/types.js';

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
      const sendResult = await sendGmailMessage({
        accessToken: primaryAccount.accessToken,
        to: msg.recipientEmail,
        toName: msg.recipientName,
        subject: msg.subject,
        body: msg.messageBody,
        attachments: msg.attachments,
        fromName: settings.profile.name,
        fromEmail: primaryAccount.email,
      });

      const sentTime = new Date().toISOString();

      // Record in sent_messages
      const sentItem: SentMessage = {
        id: 'sent-' + Date.now(),
        recipientId: msg.recipientId,
        recipientEmail: msg.recipientEmail,
        recipientName: msg.recipientName,
        campaignId: msg.campaignId,
        campaignName: msg.campaignName,
        subject: msg.subject,
        messageBody: msg.messageBody,
        attachments: msg.attachments,
        gmailMessageId: sendResult.id,
        gmailThreadId: sendResult.threadId,
        sentAt: sentTime,
        status: 'DELIVERED',
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

      const isAuthScopeError =
        errMsg.includes('insufficient authentication scopes') ||
        errMsg.includes('403') ||
        errMsg.includes('401');

      if (isAuthScopeError) {
        db.update('gmail_accounts', (accs) =>
          accs.map((a) => (a.email === primaryAccount.email ? { ...a, needsReauth: true } : a))
        );
        db.addNotification(
          'warning',
          'Gmail Authorization Required',
          'Updated Workspace permissions are required to dispatch emails. Please reconnect your Gmail account.'
        );
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
export async function syncGmailReplies(): Promise<{ newRepliesCount: number }> {
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
      } catch (msgErr) {
        console.error('Error parsing message ' + m.id, msgErr);
      }
    }

    db.update('gmail_accounts', (accs) =>
      accs.map((a) => (a.email === account.email ? { ...a, lastSyncTime: new Date().toISOString() } : a))
    );

    return { newRepliesCount: newCount };
  } catch (err: any) {
    const errMsg = err.message || '';
    const isAuthScopeError =
      errMsg.includes('insufficient authentication scopes') ||
      errMsg.includes('403') ||
      errMsg.includes('401');

    if (isAuthScopeError) {
      db.update('gmail_accounts', (accs) =>
        accs.map((a) => (a.email === account.email ? { ...a, needsReauth: true } : a))
      );
      console.warn('Gmail reply sync paused: Gmail account requires re-authorization with new scopes.');
    } else {
      console.error('Error during Gmail reply sync:', err);
    }
    return { newRepliesCount: 0 };
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

  // Poll Gmail replies every 3 minutes
  setInterval(async () => {
    try {
      const now = Date.now();
      if (now - lastSyncTimestamp > 3 * 60 * 1000) {
        lastSyncTimestamp = now;
        await syncGmailReplies();
      }
    } catch (e) {
      console.error('Scheduler reply sync error:', e);
    }
  }, 60 * 1000);
}
