import { db } from '../server/db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dbStatus = await db.getDbStatus();

    const responsePayload = {
      success: dbStatus.success,
      environment: dbStatus.environment,
      database: dbStatus.database,
      databaseProvider: dbStatus.databaseProvider,
      timestamp: new Date().toISOString(),
      version: dbStatus.version || '1.0.0',
      isPersistent: dbStatus.isPersistent,
      counts: dbStatus.counts,
      ...(dbStatus.error ? { error: dbStatus.error } : {}),
    };

    const statusCode = dbStatus.success ? 200 : 503;
    return res.status(statusCode).json(responsePayload);
  } catch (err: any) {
    return res.status(503).json({
      success: false,
      environment: process.env.VERCEL ? 'production' : (process.env.NODE_ENV || 'development'),
      database: 'error',
      databaseProvider: 'Upstash Redis/KV',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      error: `Health check failed: ${err.message || 'Unknown database error'}`,
    });
  }
}
