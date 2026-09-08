import handler from './index.js';

export default function cronHandler(req: any, res: any) {
  if (req && (!req.url || req.url === '/' || req.url === '' || !req.url.startsWith('/api/cron'))) {
    req.url = '/api/cron';
  }
  return handler(req, res);
}
