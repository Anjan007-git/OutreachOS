import { AttachmentRef } from '../src/types.js';

interface SendEmailParams {
  accessToken: string;
  to: string;
  toName?: string;
  subject: string;
  body: string;
  attachments?: AttachmentRef[];
  threadId?: string;
  inReplyTo?: string;
  fromName?: string;
  fromEmail?: string;
}

/**
 * Builds RFC 2822 base64url encoded message with MIME multipart support.
 */
export function buildRfc2822Raw({
  to,
  toName,
  subject,
  body,
  attachments = [],
  inReplyTo,
  fromName,
  fromEmail,
}: SendEmailParams): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const lines: string[] = [];

  const formattedTo = toName ? `"${toName.replace(/"/g, '')}" <${to}>` : to;
  const formattedFrom = fromName && fromEmail ? `"${fromName.replace(/"/g, '')}" <${fromEmail}>` : (fromEmail || 'me');

  // RFC 2047 encoded subject
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

  lines.push(`From: ${formattedFrom}`);
  lines.push(`To: ${formattedTo}`);
  lines.push(`Subject: ${encodedSubject}`);
  lines.push(`Date: ${new Date().toUTCString()}`);
  lines.push(`MIME-Version: 1.0`);

  if (inReplyTo) {
    lines.push(`In-Reply-To: ${inReplyTo}`);
    lines.push(`References: ${inReplyTo}`);
  }

  if (attachments && attachments.length > 0) {
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    lines.push('');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: base64');
    lines.push('');
    lines.push(Buffer.from(body, 'utf-8').toString('base64'));

    for (const att of attachments) {
      lines.push(`--${boundary}`);
      const mime = att.type || 'application/octet-stream';
      const safeName = att.name.replace(/"/g, '');
      lines.push(`Content-Type: ${mime}; name="${safeName}"`);
      lines.push('Content-Transfer-Encoding: base64');
      lines.push(`Content-Disposition: attachment; filename="${safeName}"`);
      lines.push('');
      // If we have base64 payload, use it, else empty or simulated bytes
      const base64Data = att.dataBase64
        ? att.dataBase64.replace(/^data:[^;]+;base64,/, '')
        : Buffer.from(`Outreach document: ${att.name}`).toString('base64');
      lines.push(base64Data);
    }
    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: base64');
    lines.push('');
    lines.push(Buffer.from(body, 'utf-8').toString('base64'));
  }

  const emailRaw = lines.join('\r\n');
  return Buffer.from(emailRaw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends a message via the Gmail API
 */
export async function sendGmailMessage(params: SendEmailParams): Promise<{ id: string; threadId: string }> {
  const raw = buildRfc2822Raw(params);
  const payload: any = { raw };
  if (params.threadId) {
    payload.threadId = params.threadId;
  }

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errorDetail = errText;
    try {
      const errJson = JSON.parse(errText);
      errorDetail = errJson.error?.message || errText;
    } catch {}
    throw new Error(`Gmail send error (${response.status}): ${errorDetail}`);
  }

  return (await response.json()) as { id: string; threadId: string };
}

/**
 * Retrieves current authenticated Gmail user profile
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number }> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    let errorDetail = errText;
    try {
      const errJson = JSON.parse(errText);
      errorDetail = errJson.error?.message || errText;
    } catch {}
    throw new Error(`Failed to fetch Gmail profile (${response.status}): ${errorDetail}`);
  }

  return (await response.json()) as { emailAddress: string; messagesTotal: number; threadsTotal: number };
}

/**
 * Searches and fetches messages from Gmail
 */
export async function searchGmailMessages(accessToken: string, query: string, maxResults = 20): Promise<any[]> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    let errorDetail = errText;
    try {
      const errJson = JSON.parse(errText);
      errorDetail = errJson.error?.message || errText;
    } catch {}
    throw new Error(`Failed to search Gmail messages (${response.status}): ${errorDetail}`);
  }

  const data = await response.json();
  return data.messages || [];
}

/**
 * Gets details for a specific message
 */
export async function getGmailMessage(accessToken: string, messageId: string): Promise<any> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    let errorDetail = errText;
    try {
      const errJson = JSON.parse(errText);
      errorDetail = errJson.error?.message || errText;
    } catch {}
    throw new Error(`Failed to get Gmail message (${response.status}): ${errorDetail}`);
  }

  return await response.json();
}

/**
 * Helper to extract email headers
 */
export function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  const header = headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

/**
 * Recursively extracts plain text body from a message payload
 */
export function extractBodyText(payload: any): string {
  if (!payload) return '';
  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }
  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    }
    for (const part of payload.parts) {
      const text = extractBodyText(part);
      if (text) return text;
    }
  }
  return payload.snippet || '';
}

/**
 * List files from Google Drive with metadata
 */
export async function listGoogleDriveFiles(accessToken: string, pageSize = 25): Promise<any[]> {
  const fields = 'files(id,name,mimeType,size,webViewLink,createdTime,modifiedTime,iconLink)';
  const query = "trashed=false and (mimeType contains 'pdf' or mimeType contains 'document' or mimeType contains 'sheet' or mimeType contains 'presentation')";
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=${encodeURIComponent(fields)}&q=${encodeURIComponent(query)}&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Read values from a Google Spreadsheet
 */
export async function readGoogleSpreadsheet(accessToken: string, spreadsheetId: string, range = 'A1:Z500'): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Sheets API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.values || [];
}
