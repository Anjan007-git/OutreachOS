import handler from './index.js';

export default function healthHandler(req: any, res: any) {
  if (req && (!req.url || req.url === '/' || req.url === '' || req.url === '/api/health')) {
    req.url = '/api/health';
  }
  return handler(req, res);
}
