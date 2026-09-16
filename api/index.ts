import 'dotenv/config';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let cachedApp: any = null;

function getApp() {
  if (!cachedApp) {
    try {
      // 1. Production bundle generated during build step
      const bundled = require('../dist/api.cjs');
      cachedApp = bundled.createApp ? bundled.createApp() : (bundled.default || bundled);
    } catch (e1) {
      try {
        // 2. Local tsx fallback for development
        const local = require('../server/app.ts');
        cachedApp = local.createApp ? local.createApp() : (local.default || local);
      } catch (e2) {
        console.error('Failed to initialize server application:', e1, e2);
        throw e1;
      }
    }
  }
  return cachedApp;
}

export default function handler(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
    try {
      const app = getApp();

      if (req) {
        const rawUrl = req.url || '';
        if (req.query && req.query.path) {
          const p = String(req.query.path);
          req.url = p.startsWith('/') ? `/api${p}` : `/api/${p}`;
        } else if (!rawUrl.startsWith('/api')) {
          req.url = `/api${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
        }
      }

      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);

      app(req, res);
    } catch (err: any) {
      console.error('Vercel serverless function invocation error:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'Internal server error during function invocation',
          details: err?.message || String(err),
        }));
      }
      resolve();
    }
  });
}
