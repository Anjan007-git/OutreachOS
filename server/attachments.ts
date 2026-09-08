import { AttachmentRef, StoredFile } from '../src/types';
import { db } from './db';
import { storageService } from './storage';
import { downloadGoogleDriveFile } from './gmail';

const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024; // 25 MB Gmail limit

export interface ResolvedAttachment extends AttachmentRef {
  dataBase64: string;
  mimeType: string;
}

/**
 * Resolves attachment binaries from either:
 * 1. Persistent storage (Vercel Blob / Local object store via storageKey)
 * 2. Google Drive API (using accessToken)
 * 3. Already-present dataBase64 (if any)
 *
 * Ensures Gmail RFC 2822 payload contains real file bytes and total size does not exceed 25MB.
 */
export async function resolveAttachmentsForEmail(
  attachments: AttachmentRef[],
  accessToken?: string
): Promise<ResolvedAttachment[]> {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  const storedFiles = db.get('attachments') as StoredFile[];
  const resolved: ResolvedAttachment[] = [];
  let totalBytes = 0;

  for (const att of attachments) {
    // 1. Try to find stored file metadata in database
    const stored =
      (att.fileId && storedFiles.find((f) => f.id === att.fileId)) ||
      storedFiles.find((f) => f.name === att.name) ||
      (att.driveFileId && storedFiles.find((f) => f.driveFileId === att.driveFileId)) ||
      null;

    let buffer: Buffer | null = null;
    let mimeType = att.mimeType || att.type || stored?.mimeType || 'application/pdf';
    let filename = att.name || stored?.name || 'document.pdf';

    // A. Is it already base64 encoded?
    if (att.dataBase64) {
      buffer = Buffer.from(att.dataBase64, 'base64');
    }

    // B. Is it a Google Drive file?
    const driveFileId = att.driveFileId || (att.source === 'drive' ? att.fileId : undefined) || stored?.driveFileId;
    if (!buffer && driveFileId && accessToken) {
      try {
        const driveResult = await downloadGoogleDriveFile(accessToken, driveFileId, mimeType);
        buffer = driveResult.buffer;
        mimeType = driveResult.mimeType || mimeType;
        if (driveResult.filenameExt && !filename.endsWith(driveResult.filenameExt)) {
          filename = `${filename}${driveResult.filenameExt}`;
        }
      } catch (err: any) {
        console.error(`Failed to download Drive attachment "${filename}" (${driveFileId}):`, err.message);
        throw new Error(`Failed to load attachment "${filename}" from Google Drive: ${err.message}`);
      }
    }

    // C. Is it in persistent storage (Vercel Blob or local storage)?
    const storageKey = att.storageKey || stored?.storageKey;
    const storageUrl = att.url || stored?.storageUrl;
    if (!buffer && storageKey) {
      try {
        buffer = await storageService.getFileBuffer(storageKey, storageUrl);
      } catch (err: any) {
        console.error(`Failed to load attachment "${filename}" from storage (${storageKey}):`, err.message);
      }
    }

    // D. Backwards compatibility check: stored.dataBase64
    if (!buffer && stored?.dataBase64) {
      buffer = Buffer.from(stored.dataBase64, 'base64');
    }

    if (!buffer) {
      console.warn(`Could not resolve binary data for attachment: ${filename}`);
      throw new Error(
        `Unable to load binary data for attached document: "${filename}". Please verify the document exists in your Document Repository or Google Drive.`
      );
    }

    totalBytes += buffer.length;
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      throw new Error(
        `Total attachments size (${(totalBytes / (1024 * 1024)).toFixed(1)} MB) exceeds Gmail's 25 MB limit.`
      );
    }

    resolved.push({
      ...att,
      name: filename,
      mimeType,
      type: mimeType,
      size: buffer.length,
      dataBase64: buffer.toString('base64'),
    });
  }

  return resolved;
}
