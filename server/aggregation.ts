import { db as defaultDb, Database } from './db.js';
import {
  Contact,
  Campaign,
  SentMessage,
  IncomingMessage,
  ScheduledMessage,
  DashboardStats,
} from '../src/types.js';

export interface JoinedInteraction {
  id: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
  organization: string;
  organizationType: string;
  role: string;
  country: string;
  campaignId?: string;
  campaignName?: string;
  sentMessageId?: string;
  sentAt?: string;
  sentSubject?: string;
  incomingReplyId?: string;
  replyReceivedAt?: string;
  replySubject?: string;
  replyClassification?: string;
  scheduledMessageId?: string;
  scheduledTime?: string;
  status: 'REPLIED' | 'DELIVERED' | 'QUEUED' | 'FAILED' | 'NO_OUTREACH';
  gmailThreadId?: string;
}

export interface JoinedCampaignSummary {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  repliesCount: number;
  replyRatePercentage: number;
  queuedCount: number;
  failedCount: number;
  lastSentAt?: string;
}

export interface JoinedContactEngagement {
  contactId: string;
  name: string;
  email: string;
  organization: string;
  organizationType: string;
  role: string;
  country: string;
  status: 'REPLIED' | 'DELIVERED' | 'QUEUED' | 'FAILED' | 'NO_OUTREACH';
  campaigns: Array<{ id: string; name: string }>;
  sentCount: number;
  lastSentAt?: string;
  replyCount: number;
  lastReplyAt?: string;
  lastClassification?: string;
  queuedCount: number;
}

export interface AggregationOutput {
  stats: DashboardStats;
  joinedInteractions: JoinedInteraction[];
  campaignSummaries: JoinedCampaignSummary[];
  contactEngagements: JoinedContactEngagement[];
}

/**
 * Robust server-side data aggregation service that executes a single,
 * consistent relational JOIN across contacts, campaigns, sent messages,
 * incoming replies, and scheduled queues.
 */
export function aggregateWorkspaceData(
  database: Database = defaultDb,
  userEmail?: string
): AggregationOutput {
  const contacts: Contact[] = database.get('contacts') || [];
  const campaigns: Campaign[] = database.get('campaigns') || [];
  const sentMessages: SentMessage[] = database.get('sent_messages') || [];
  const incomingMessages: IncomingMessage[] = database.get('incoming_messages') || [];
  const scheduledMessages: ScheduledMessage[] = database.get('scheduled_messages') || [];
  const followUps = database.get('follow_ups') || [];

  // 1. Build lookup indices for fast relational joins
  const contactById = new Map<string, Contact>();
  const contactByEmail = new Map<string, Contact>();
  contacts.forEach((c) => {
    if (c.id) contactById.set(c.id, c);
    if (c.email) contactByEmail.set(c.email.trim().toLowerCase(), c);
  });

  const campaignById = new Map<string, Campaign>();
  campaigns.forEach((camp) => {
    if (camp.id) campaignById.set(camp.id, camp);
  });

  // Group sent messages by recipient email and by threadId
  const sentByEmail = new Map<string, SentMessage[]>();
  const sentByThreadId = new Map<string, SentMessage>();
  sentMessages.forEach((sm) => {
    const emailKey = sm.recipientEmail ? sm.recipientEmail.trim().toLowerCase() : '';
    if (emailKey) {
      const list = sentByEmail.get(emailKey) || [];
      list.push(sm);
      sentByEmail.set(emailKey, list);
    }
    if (sm.gmailThreadId) {
      sentByThreadId.set(sm.gmailThreadId, sm);
    }
  });

  // Group incoming replies by contact email and by threadId
  const repliesByEmail = new Map<string, IncomingMessage[]>();
  const repliesByThreadId = new Map<string, IncomingMessage[]>();
  incomingMessages.forEach((im) => {
    const emailKey = im.contactEmail ? im.contactEmail.trim().toLowerCase() : '';
    if (emailKey) {
      const list = repliesByEmail.get(emailKey) || [];
      list.push(im);
      repliesByEmail.set(emailKey, list);
    }
    if (im.gmailThreadId) {
      const threadList = repliesByThreadId.get(im.gmailThreadId) || [];
      threadList.push(im);
      repliesByThreadId.set(im.gmailThreadId, threadList);
    }
  });

  // Group scheduled queue items by recipient email
  const scheduledByEmail = new Map<string, ScheduledMessage[]>();
  scheduledMessages.forEach((sch) => {
    const emailKey = sch.recipientEmail ? sch.recipientEmail.trim().toLowerCase() : '';
    if (emailKey) {
      const list = scheduledByEmail.get(emailKey) || [];
      list.push(sch);
      scheduledByEmail.set(emailKey, list);
    }
  });

  // 2. Consistent JOIN across Contacts ⇄ Campaigns ⇄ Sent ⇄ Incoming Replies ⇄ Scheduled
  const joinedInteractions: JoinedInteraction[] = [];
  const contactEngagements: JoinedContactEngagement[] = [];

  // Track all processed sent & incoming message IDs to catch any orphan records
  const processedSentIds = new Set<string>();
  const processedReplyIds = new Set<string>();

  contacts.forEach((c) => {
    const emailKey = c.email.trim().toLowerCase();
    const contactSent = sentByEmail.get(emailKey) || [];
    const contactReplies = repliesByEmail.get(emailKey) || [];
    const contactScheduled = scheduledByEmail.get(emailKey) || [];

    // Find associated campaigns
    const linkedCampaignIds = new Set<string>();
    if (c.id) {
      campaigns.forEach((camp) => {
        if (
          camp.recipientIds?.includes(c.id) ||
          camp.contactIds?.includes(c.id)
        ) {
          linkedCampaignIds.add(camp.id);
        }
      });
    }
    contactSent.forEach((s) => {
      if (s.campaignId) linkedCampaignIds.add(s.campaignId);
    });
    contactScheduled.forEach((sc) => {
      if (sc.campaignId) linkedCampaignIds.add(sc.campaignId);
    });

    const linkedCampaigns = Array.from(linkedCampaignIds)
      .map((id) => campaignById.get(id))
      .filter((camp): camp is Campaign => Boolean(camp))
      .map((camp) => ({ id: camp.id, name: camp.name }));

    // Determine contact engagement status
    let status: JoinedContactEngagement['status'] = 'NO_OUTREACH';
    if (contactReplies.length > 0) {
      status = 'REPLIED';
    } else if (contactSent.length > 0) {
      status = 'DELIVERED';
    } else if (contactScheduled.some((s) => s.status === 'QUEUED')) {
      status = 'QUEUED';
    } else if (contactScheduled.some((s) => s.status === 'FAILED')) {
      status = 'FAILED';
    }

    // Sort sent messages descending by sentAt
    const sortedSent = [...contactSent].sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    const lastSent = sortedSent[0];

    // Sort replies descending by receivedDate
    const sortedReplies = [...contactReplies].sort(
      (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
    );
    const lastReply = sortedReplies[0];

    contactEngagements.push({
      contactId: c.id,
      name: c.name,
      email: c.email,
      organization: c.organization || 'Individual',
      organizationType: c.organizationType || 'Other',
      role: c.role || c.jobTitle || 'Contact',
      country: c.country || 'Unspecified',
      status,
      campaigns: linkedCampaigns,
      sentCount: contactSent.length,
      lastSentAt: lastSent?.sentAt,
      replyCount: contactReplies.length,
      lastReplyAt: lastReply?.receivedDate,
      lastClassification: lastReply?.classification,
      queuedCount: contactScheduled.filter((s) => s.status === 'QUEUED').length,
    });

    // Create joined interaction records for this contact
    if (contactSent.length > 0) {
      contactSent.forEach((sent) => {
        processedSentIds.add(sent.id);
        // Find matching replies for this sent message (by threadId or recipient email)
        const matchingReply =
          (sent.gmailThreadId ? repliesByThreadId.get(sent.gmailThreadId)?.[0] : null) ||
          contactReplies.find((r) => r.gmailThreadId === sent.gmailThreadId) ||
          (contactReplies.length === 1 ? contactReplies[0] : null);

        if (matchingReply) {
          processedReplyIds.add(matchingReply.id);
        }

        const camp = sent.campaignId ? campaignById.get(sent.campaignId) : undefined;

        joinedInteractions.push({
          id: `int-${sent.id}`,
          contactId: c.id,
          contactName: c.name,
          contactEmail: c.email,
          organization: c.organization || 'Individual',
          organizationType: c.organizationType || 'Other',
          role: c.role || 'Contact',
          country: c.country || 'Unspecified',
          campaignId: camp?.id || sent.campaignId,
          campaignName: camp?.name || sent.campaignName || 'Direct Outreach',
          sentMessageId: sent.id,
          sentAt: sent.sentAt,
          sentSubject: sent.subject,
          incomingReplyId: matchingReply?.id,
          replyReceivedAt: matchingReply?.receivedDate,
          replySubject: matchingReply?.subject,
          replyClassification: matchingReply?.classification,
          status: matchingReply ? 'REPLIED' : 'DELIVERED',
          gmailThreadId: sent.gmailThreadId,
        });
      });
    } else if (contactScheduled.length > 0) {
      contactScheduled.forEach((sch) => {
        const camp = sch.campaignId ? campaignById.get(sch.campaignId) : undefined;
        joinedInteractions.push({
          id: `int-${sch.id}`,
          contactId: c.id,
          contactName: c.name,
          contactEmail: c.email,
          organization: c.organization || 'Individual',
          organizationType: c.organizationType || 'Other',
          role: c.role || 'Contact',
          country: c.country || 'Unspecified',
          campaignId: camp?.id || sch.campaignId,
          campaignName: camp?.name || sch.campaignName || 'Direct Outreach',
          scheduledMessageId: sch.id,
          scheduledTime: sch.scheduledTime,
          status: sch.status === 'FAILED' ? 'FAILED' : 'QUEUED',
        });
      });
    }
  });

  // Handle sent messages that might not be mapped to an explicit contact record
  sentMessages.forEach((sent) => {
    if (!processedSentIds.has(sent.id)) {
      processedSentIds.add(sent.id);
      const camp = sent.campaignId ? campaignById.get(sent.campaignId) : undefined;
      const matchingReply = sent.gmailThreadId ? repliesByThreadId.get(sent.gmailThreadId)?.[0] : null;
      if (matchingReply) processedReplyIds.add(matchingReply.id);

      joinedInteractions.push({
        id: `int-${sent.id}`,
        contactId: sent.recipientId,
        contactName: sent.recipientName || sent.recipientEmail,
        contactEmail: sent.recipientEmail,
        organization: 'Direct Contact',
        organizationType: 'Other',
        role: 'Contact',
        country: 'Unspecified',
        campaignId: camp?.id || sent.campaignId,
        campaignName: camp?.name || sent.campaignName || 'Direct Outreach',
        sentMessageId: sent.id,
        sentAt: sent.sentAt,
        sentSubject: sent.subject,
        incomingReplyId: matchingReply?.id,
        replyReceivedAt: matchingReply?.receivedDate,
        replySubject: matchingReply?.subject,
        replyClassification: matchingReply?.classification,
        status: matchingReply ? 'REPLIED' : 'DELIVERED',
        gmailThreadId: sent.gmailThreadId,
      });
    }
  });

  // Handle orphan replies (e.g. replies without prior sent messages in local DB)
  incomingMessages.forEach((rep) => {
    if (!processedReplyIds.has(rep.id)) {
      processedReplyIds.add(rep.id);
      const matchedContact = rep.contactEmail ? contactByEmail.get(rep.contactEmail.toLowerCase()) : null;
      joinedInteractions.push({
        id: `int-rep-${rep.id}`,
        contactId: matchedContact?.id || rep.contactId,
        contactName: matchedContact?.name || rep.contactName || rep.contactEmail,
        contactEmail: rep.contactEmail,
        organization: matchedContact?.organization || rep.organization || 'External Partner',
        organizationType: matchedContact?.organizationType || 'Other',
        role: matchedContact?.role || 'Prospect',
        country: matchedContact?.country || 'Unspecified',
        campaignId: rep.campaignId,
        campaignName: rep.campaignName || 'Direct Outreach',
        incomingReplyId: rep.id,
        replyReceivedAt: rep.receivedDate,
        replySubject: rep.subject,
        replyClassification: rep.classification,
        status: 'REPLIED',
        gmailThreadId: rep.gmailThreadId,
      });
    }
  });

  // 3. Campaign summaries derived from the JOIN
  const campaignSummaries: JoinedCampaignSummary[] = campaigns.map((camp) => {
    const campSent = sentMessages.filter((s) => s.campaignId === camp.id);
    const campReplies = incomingMessages.filter((r) => r.campaignId === camp.id);
    const campQueued = scheduledMessages.filter((s) => s.campaignId === camp.id && s.status === 'QUEUED');
    const campFailed = scheduledMessages.filter((s) => s.campaignId === camp.id && s.status === 'FAILED');

    const replyRate = campSent.length > 0 ? Math.round((campReplies.length / campSent.length) * 100) : 0;
    const sortedSent = [...campSent].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    return {
      campaignId: camp.id,
      campaignName: camp.name,
      campaignType: camp.type,
      status: camp.status,
      totalRecipients: (camp.recipientIds || []).length,
      sentCount: campSent.length,
      repliesCount: campReplies.length,
      replyRatePercentage: replyRate,
      queuedCount: campQueued.length,
      failedCount: campFailed.length,
      lastSentAt: sortedSent[0]?.sentAt,
    };
  });

  // 4. Real-time metrics calculations directly from the DB data
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sentToday = sentMessages.filter((m) => new Date(m.sentAt).getTime() >= startOfDay).length;

  const totalSent = sentMessages.length;
  const repliesCount = incomingMessages.length;
  const replyRatePercentage = totalSent > 0 ? Math.round((repliesCount / totalSent) * 100) : 0;

  // Rolling 7-day timeline joined by date
  const sentOverTime: { date: string; sent: number; replies: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;

    const sentCount = sentMessages.filter((m) => {
      const t = new Date(m.sentAt).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;

    const repCount = incomingMessages.filter((m) => {
      const t = new Date(m.receivedDate).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;

    sentOverTime.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      sent: sentCount,
      replies: repCount,
    });
  }

  // Breakdown by organization type derived directly from contacts & sent interactions
  const orgCountMap: Record<string, number> = {};
  contacts.forEach((c) => {
    const orgType = c.organizationType || 'Other';
    orgCountMap[orgType] = (orgCountMap[orgType] || 0) + 1;
  });
  const outreachBreakdown = Object.entries(orgCountMap).map(([name, count]) => ({ name, count }));

  // Top countries derived from contacts
  const countryMap: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.country && c.country.trim()) {
      const cleanCountry = c.country.trim();
      countryMap[cleanCountry] = (countryMap[cleanCountry] || 0) + 1;
    }
  });
  const topCountries = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent activity stream joined with contact & campaign information
  const recentActivities: DashboardStats['recentActivities'] = [
    ...sentMessages.map((s) => {
      const contact = s.recipientEmail ? contactByEmail.get(s.recipientEmail.toLowerCase()) : null;
      return {
        id: s.id,
        type: 'sent' as const,
        title: `Outreach Sent: ${s.subject}`,
        timestamp: s.sentAt,
        recipientOrContact: contact ? `${contact.name} (${contact.email})` : `${s.recipientName || s.recipientEmail}`,
        campaignName: s.campaignName,
        organization: contact?.organization,
      };
    }),
    ...incomingMessages.map((r) => {
      const contact = r.contactEmail ? contactByEmail.get(r.contactEmail.toLowerCase()) : null;
      return {
        id: r.id,
        type: 'reply' as const,
        title: r.classification ? `Reply Received: ${r.subject} [${r.classification}]` : `Reply Received: ${r.subject}`,
        timestamp: r.receivedDate,
        recipientOrContact: contact ? `${contact.name} (${contact.email})` : (r.contactName || r.contactEmail),
        campaignName: r.campaignName,
        organization: contact?.organization || r.organization,
      };
    }),
    ...scheduledMessages.map((sc) => {
      const contact = sc.recipientEmail ? contactByEmail.get(sc.recipientEmail.toLowerCase()) : null;
      return {
        id: sc.id,
        type: sc.status === 'FAILED' ? ('failed' as const) : ('scheduled' as const),
        title: sc.status === 'FAILED' ? `Failed: ${sc.subject}` : `Queued: ${sc.subject}`,
        timestamp: sc.scheduledTime,
        recipientOrContact: contact ? `${contact.name} (${contact.email})` : `${sc.recipientName || sc.recipientEmail}`,
        campaignName: sc.campaignName,
        organization: contact?.organization,
      };
    }),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const weekAgo = Date.now() - 7 * 86400000;
  const contactsAddedThisWeek = contacts.filter(
    (c) => new Date(c.createdAt).getTime() >= weekAgo
  ).length;

  const stats: DashboardStats = {
    totalContacts: contacts.length,
    scheduledCount: scheduledMessages.filter((m) => m.status === 'QUEUED').length,
    sentToday,
    totalSent,
    repliesCount,
    followUpsCount: followUps.filter((f) => f.status === 'ACTIVE').length,
    failedCount: scheduledMessages.filter((m) => m.status === 'FAILED').length,
    activeCampaigns: campaigns.filter((c) => c.status === 'ACTIVE').length,
    replyRatePercentage,
    recentActivities,
    sentOverTime,
    outreachBreakdown,
    topCountries,
    contactsAddedThisWeek,
  };

  return {
    stats,
    joinedInteractions,
    campaignSummaries,
    contactEngagements,
  };
}
