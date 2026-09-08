import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((s) => provider.addScope(s));
// Use select_account so the user does NOT get repeatedly forced through the consent screen
provider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline',
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthSuccess?.(user, cachedAccessToken);
      return;
    }

    if (!isSigningIn) {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (data.isConnected) {
          // Token is saved and active server-side
          onAuthSuccess?.(
            user || ({ email: data.email, displayName: data.displayName } as any),
            'server-managed'
          );
          return;
        }
      } catch (err) {
        console.warn('Could not check auth status from server:', err);
      }

      // If user is signed in with Firebase, keep session active
      if (user) {
        onAuthSuccess?.(user, 'firebase-session');
        return;
      }

      onAuthFailure?.();
    }
  });
};

export const connectGoogleAccount = async (forceConsent = false): Promise<{
  user: User;
  email: string;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    if (forceConsent) {
      provider.setCustomParameters({ prompt: 'consent', access_type: 'offline' });
    } else {
      provider.setCustomParameters({ prompt: 'select_account', access_type: 'offline' });
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    if (!token) {
      throw new Error('Google OAuth succeeded but no access token was returned.');
    }

    cachedAccessToken = token;

    // Send token securely to server-side Gmail service
    const response = await fetch('/api/auth/connect-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: token,
        email: result.user.email,
        displayName: result.user.displayName,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server failed to initialize Gmail integration.');
    }

    return {
      user: result.user,
      email: result.user.email || 'connected',
      accessToken: token,
    };
  } finally {
    isSigningIn = false;
  }
};

/**
 * Attempts a silent token refresh via Google Identity Services (GIS) without user popups.
 */
export async function refreshGoogleAccessToken(hintEmail?: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
        return resolve(null);
      }

      // Extract client_id from config
      const clientId =
        (firebaseConfig as any).oAuthClientId ||
        (firebaseConfig as any).clientId ||
        (firebaseConfig as any).apiKey;

      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES.join(' '),
        hint: hintEmail || auth.currentUser?.email || '',
        prompt: '',
        callback: async (resp: any) => {
          if (resp?.access_token) {
            cachedAccessToken = resp.access_token;
            try {
              await fetch('/api/auth/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  accessToken: resp.access_token,
                  expiresIn: resp.expires_in,
                }),
              });
            } catch (err) {
              console.warn('Failed to sync refreshed token with backend:', err);
            }
            resolve(resp.access_token);
          } else {
            resolve(null);
          }
        },
        error_callback: () => resolve(null),
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch {
      resolve(null);
    }
  });
}

export const disconnectGoogleAccount = async () => {
  try {
    await fetch('/api/auth/disconnect-google', { method: 'POST' });
    await signOut(auth);
    cachedAccessToken = null;
  } catch (err) {
    console.error('Failed to disconnect Google account:', err);
  }
};

export const getCachedAccessToken = () => cachedAccessToken;
