import { createApp, normalizeUrl } from '../server/app.js';

const app = createApp();

export default function handler(req: any, res: any) {
  if (req) {
    req.url = normalizeUrl(req);
  }
  return app(req, res);
}
