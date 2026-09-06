# OutreachOS

Personal email outreach and automation platform with Gmail integration, contact management, campaign scheduling, and Gemini AI assistance.

## Overview

OutreachOS is a full-stack outreach automation system built with React, TypeScript, Express, and Vite. It connects with your authorized Google Workspace / Gmail account to dispatch personalized email campaigns, monitor message status, and intelligently categorize incoming replies.

## Features

- **Gmail Integration**: Secure OAuth2 connection for dispatching outreach messages and syncing response threads.
- **Smart Campaign Management**: Create and schedule personalized cold outreach sequences with custom merge tags (`{{name}}`, `{{organization}}`, `{{role}}`).
- **Contact Directory & CSV Import**: Add and organize contacts across HR, Technical Recruiters, Hiring Managers, and Admissions offices.
- **Adaptive Rate Limiting & Scheduler**: Queue-based background dispatcher with customizable send delays and daily safety limits.
- **Gemini AI Assistance**: AI-powered subject line generator, email body improvement, and automatic incoming response classification.
- **Role-Based Access Control**: Built-in Administrator tier with unlimited sending capability and audit logging.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Express 4, tsx, Node.js
- **AI**: Google Gen AI SDK (`@google/genai`)
- **Build Tool**: Vite 6, esbuild

## Getting Started

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd outreach-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## License

MIT
