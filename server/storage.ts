import fs from 'fs';
import path from 'path';

// Production Vercel Blob lazy loader (safe for CJS output without top-level await)
let vercelBlobPromise: Promise<any> | null = null;
async function getVercelBlob(): Promise<any> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  if (!vercelBlobPromise) {
    vercelBlobPromise = import('@vercel/blob').catch((e) => {
      console.warn('@vercel/blob is not installed or failed to load:', e.message);
      return null;
    });
  }
  return await vercelBlobPromise;
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), '.storage');

// Ensure local storage dir exists for dev environment
function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    try {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create local .storage dir:', e);
    }
  }
}

// In-memory fallback if filesystem is read-only (e.g. ephemeral serverless without Blob token)
const memoryStorage = new Map<string, { buffer: Buffer; mimeType: string; filename: string }>();

export interface SaveFileResult {
  storageKey: string;
  storageUrl?: string;
  size: number;
}

export class StorageService {
  /**
   * Saves a file buffer to persistent storage (Private Vercel Blob in production).
   * Ensures no local disk is used for permanent files when BLOB_READ_WRITE_TOKEN is configured.
   */
  async saveFile(
    filename: string,
    buffer: Buffer,
    mimeType: string,
    userId = 'default'
  ): Promise<SaveFileResult> {
    const timestamp = Date.now();
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `${userId}/${timestamp}-${cleanName}`;

    // 1. Private Vercel Blob Store
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobModule = await getVercelBlob();
      if (!blobModule?.put) {
        throw new Error('Vercel Blob SDK is not available to complete upload to private store.');
      }

      try {
        const blob = await blobModule.put(`documents/${storageKey}`, buffer, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: mimeType,
        });

        return {
          storageKey,
          storageUrl: blob.url,
          size: buffer.length,
        };
      } catch (err: any) {
        console.error('Private Vercel Blob upload failed:', err.message);
        throw new Error(`Failed to upload document to private Vercel Blob: ${err.message}`);
      }
    }

    // Strict constraint: Do not use local filesystem storage for permanent files in production
    const isProd = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) || process.env.NODE_ENV === 'production';
    if (isProd) {
      throw new Error(
        'Production storage unavailable: BLOB_READ_WRITE_TOKEN is required for private Vercel Blob store.'
      );
    }

    // 2. Local dev storage (.storage/ directory) — ONLY for offline dev testing without credentials
    try {
      ensureLocalDir();
      const userDir = path.join(LOCAL_STORAGE_DIR, userId);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey);
      fs.writeFileSync(localFilePath, buffer);
      return {
        storageKey,
        storageUrl: undefined,
        size: buffer.length,
      };
    } catch (fsErr: any) {
      console.warn('Filesystem write failed, falling back to in-memory store:', fsErr.message);
      // 3. In-memory fallback for local dev
      memoryStorage.set(storageKey, { buffer, mimeType, filename });
      return {
        storageKey,
        storageUrl: undefined,
        size: buffer.length,
      };
    }
  }

  /**
   * Retrieves the binary Buffer for a given storageKey / storageUrl from private Vercel Blob.
   */
  async getFileBuffer(storageKey: string, storageUrl?: string): Promise<Buffer | null> {
    // 1. Private Vercel Blob authenticated retrieval
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobModule = await getVercelBlob();
      if (blobModule?.get) {
        try {
          const target =
            storageUrl ||
            (storageKey.startsWith('documents/') ? storageKey : `documents/${storageKey}`);
          const result = await blobModule.get(target, {
            access: 'private',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });

          if (result && result.statusCode === 200 && result.stream) {
            const resp = new Response(result.stream);
            const arrayBuf = await resp.arrayBuffer();
            return Buffer.from(arrayBuf);
          }
        } catch (err: any) {
          console.warn(`Could not retrieve private blob from Vercel Blob (${storageUrl || storageKey}):`, err.message);
        }
      }
    }

    // 2. Check local disk storage (dev only)
    try {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey);
      if (fs.existsSync(localFilePath)) {
        return fs.readFileSync(localFilePath);
      }
    } catch (err) {
      // ignore
    }

    // 3. Check in-memory store (dev only)
    if (memoryStorage.has(storageKey)) {
      return memoryStorage.get(storageKey)!.buffer;
    }

    return null;
  }

  /**
   * Deletes a file from storage.
   */
  async deleteFile(storageKey: string, storageUrl?: string): Promise<void> {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobModule = await getVercelBlob();
      if (blobModule?.del) {
        try {
          const target =
            storageUrl ||
            (storageKey.startsWith('documents/') ? storageKey : `documents/${storageKey}`);
          await blobModule.del(target, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
        } catch (err: any) {
          console.warn('Vercel Blob del failed:', err.message);
        }
      }
    }

    try {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch {
      // ignore
    }

    memoryStorage.delete(storageKey);
  }
}

export const storageService = new StorageService();
