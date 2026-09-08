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
   * Saves a file buffer to persistent storage (Vercel Blob in production, or secure local storage in dev).
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

    // 1. Production Vercel Blob
    const blobModule = await getVercelBlob();
    if (blobModule?.put) {
      try {
        const blob = await blobModule.put(`documents/${storageKey}`, buffer, {
          access: 'public',
          contentType: mimeType,
        });
        return {
          storageKey,
          storageUrl: blob.url,
          size: buffer.length,
        };
      } catch (err: any) {
        console.warn('Vercel Blob upload failed, falling back to local storage:', err.message);
      }
    }

    // 2. Local dev storage (.storage/ directory)
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
      // 3. In-memory fallback for ephemeral environments
      memoryStorage.set(storageKey, { buffer, mimeType, filename });
      return {
        storageKey,
        storageUrl: undefined,
        size: buffer.length,
      };
    }
  }

  /**
   * Retrieves the binary Buffer for a given storageKey / storageUrl.
   */
  async getFileBuffer(storageKey: string, storageUrl?: string): Promise<Buffer | null> {
    // 1. If remote storage URL exists, fetch it
    if (storageUrl) {
      try {
        const res = await fetch(storageUrl);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          return Buffer.from(ab);
        }
      } catch (err: any) {
        console.warn(`Could not fetch file from storageUrl (${storageUrl}):`, err.message);
      }
    }

    // 2. Check local disk storage
    try {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey);
      if (fs.existsSync(localFilePath)) {
        return fs.readFileSync(localFilePath);
      }
    } catch (err) {
      // ignore
    }

    // 3. Check in-memory store
    if (memoryStorage.has(storageKey)) {
      return memoryStorage.get(storageKey)!.buffer;
    }

    return null;
  }

  /**
   * Deletes a file from storage.
   */
  async deleteFile(storageKey: string, storageUrl?: string): Promise<void> {
    if (storageUrl) {
      const blobModule = await getVercelBlob();
      if (blobModule?.del) {
        try {
          await blobModule.del(storageUrl);
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
