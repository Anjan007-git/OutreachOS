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

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
provider.setCustomParameters({
  prompt: 'consent',
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
    } else if (!isSigningIn) {
      // Check server if Gmail account is already active
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (data.isConnected && user) {
          // Token is saved server-side
          onAuthSuccess?.(user, 'server-managed');
          return;
        }
      } catch {}
      onAuthFailure?.();
    }
  });
};

export const connectGoogleAccount = async (): Promise<{
  user: User;
  email: string;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
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
