import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/app.js';
import { startScheduler } from './server/scheduler.js';

const PORT = 3000;

async function startServer() {
  // Create Express application with all API endpoints
  const app = createApp();

  // Start background queue scheduler for local server / container runtime
  startScheduler();

  // Vite development middleware or static asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OutreachOS server running on http://localhost:${PORT}`);
  });
}

startServer();
