import { db } from '../server/db.js';
import { processOutboundQueue, syncGmailReplies } from '../server/scheduler.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // CRON_SECRET verification (required for protected cron executions on Vercel)
  if (process.env.CRON_SECRET) {
    const authHeader = req.headers.authorization;
    const querySecret = req.query?.secret;
    const normalizedQuerySecret = querySecret ? querySecret.replace(/ /g, '+') : undefined;
    const isAuthorized =
      authHeader === `Bearer ${process.env.CRON_SECRET}` ||
      querySecret === process.env.CRON_SECRET ||
      normalizedQuerySecret === process.env.CRON_SECRET;

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or missing CRON_SECRET token',
      });
    }
  }

  try {
    // 1. Synchronize database state from primary storage engine (Upstash Redis in production)
    await db.ensureLoaded(true);

    // 2. Execute scheduled outbound email queue
    const queueResult = await processOutboundQueue();

    // 3. Synchronize incoming Gmail replies & categorize
    let replyCount = 0;
    try {
      const syncRes = await syncGmailReplies();
      replyCount = syncRes.newRepliesCount;
    } catch (e: any) {
      console.warn('Cron reply sync check warning:', e.message);
    }

    // 4. Flush all updates to Upstash Redis
    await db.flush();

    const dbStatus = await db.getDbStatus();

    return res.status(200).json({
      success: true,
      dispatchedAt: new Date().toISOString(),
      environment: dbStatus.environment,
      databaseProvider: dbStatus.databaseProvider,
      queueProcessed: queueResult.processed,
      newReplies: replyCount,
      message: 'Scheduled outbound queue execution and Gmail reply sync completed successfully.',
    });
  } catch (err: any) {
    console.error('Vercel cron execution error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Scheduled cron task execution failed',
      timestamp: new Date().toISOString(),
    });
  }
}
