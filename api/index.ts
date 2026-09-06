import { createApp } from '../server/app.js';

const app = createApp();

export default function handler(req: any, res: any) {
  // Normalize incoming URL for Express router
  if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path);
    const urlPath = (req.url || '').split('?')[0];
    if (!urlPath.endsWith('/' + subpath) && !urlPath.includes('/' + subpath + '/')) {
      const qIdx = req.url.indexOf('?');
      const search = qIdx !== -1 ? req.url.substring(qIdx) : '';
      req.url = `/api/${subpath.replace(/^\/+/, '')}${search}`;
    }
  }

  if (req.url) {
    req.url = req.url
      .replace(/^\/api\/api(?=\/|$)/, '/api')
      .replace(/^\/api\/index(?=\/|$)/, '/api')
      .replace(/^\/index(?=\/|$)/, '');
  }

  return app(req, res);
}
