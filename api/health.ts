import 'dotenv/config';

export default function healthHandler(req: any, res: any) {
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

  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  if (res && typeof res.status === 'function') {
    return res.status(200).json({
      database: {
        configured,
      },
    });
  }

  if (res && typeof res.end === 'function') {
    res.statusCode = 200;
    return res.end(JSON.stringify({ database: { configured } }));
  }

  return { database: { configured } };
}

