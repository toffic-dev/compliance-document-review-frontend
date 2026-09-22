import { User } from '@/types';

/**
 * Client session handling.
 *
 * The session is a bearer token plus a cached user in `localStorage`. Everything
 * that reads, clears or invalidates it goes through this module, so the shared
 * API client, the auth provider and the pages agree on one definition of
 * "signed in" and on what happens when the backend rejects the token.
 *
 * Two ways a session ends:
 *   1. locally — `exp` in the stored JWT has passed (checked on load);
 *   2. remotely — any authenticated request answers 401, whenever it happens.
 * Both funnel into `endSession()`.
 */

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

/** Sign-in route. Public, so redirecting to it can never loop. */
export const SIGN_IN_PATH = '/login';

/** Query flag the sign-in page reads to explain an automatic redirect. */
export const SESSION_EXPIRED_REASON = 'session-expired';

/** Copy shared by the redirect notice and the API error it replaces. */
export const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. Please sign in again.';

/** Routes that stay reachable without a session. */
const PUBLIC_PATHS = ['/', SIGN_IN_PATH, '/signup'];

export interface SessionState {
  user: User | null;
  status: 'valid' | 'missing' | 'expired';
}

/** Accepts the sign-in page itself and anything nested under it. */
export function isPublicPath(pathname: string): boolean {
  if (!pathname) return true;
  return PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))
  );
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    // A corrupt entry is treated as "no cached user" rather than crashing a
    // page that only wanted to render a name.
    return null;
  }
}

export function saveSession(token: string, user: User | null): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // A fresh token re-arms the expiry redirect for this page load.
  isRedirectingToSignIn = false;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/**
 * Reads the `exp` claim without verifying the signature. The backend stays the
 * authority on validity; this is only used to avoid rendering a protected page
 * with a token we already know has expired.
 */
function readTokenExpiry(token: string): number | null {
  const payloadSegment = token.split('.')[1];
  if (!payloadSegment) return null;

  try {
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    // Not a JWT, or not base64url: leave the decision to the API.
    return null;
  }
}

/**
 * Returns false for tokens whose expiry cannot be read (opaque tokens), because
 * an unreadable `exp` is not evidence of expiry.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return false;

  const expiresAt = readTokenExpiry(token);
  return expiresAt !== null && expiresAt <= Date.now();
}

/** Reads the persisted session and reports whether it is usable. */
export function readSession(): SessionState {
  const token = getToken();

  if (!token) return { user: null, status: 'missing' };
  if (isTokenExpired(token)) return { user: null, status: 'expired' };

  return { user: getStoredUser(), status: 'valid' };
}

export function hasValidSession(): boolean {
  return readSession().status === 'valid';
}

type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();

/** Subscribes to session invalidation; returns an unsubscribe function. */
export function onSessionExpired(listener: SessionExpiredListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notifySessionExpired(): void {
  for (const listener of Array.from(listeners)) {
    listener();
  }
}

export function signInUrl(reason?: string): string {
  return reason
    ? `${SIGN_IN_PATH}?reason=${encodeURIComponent(reason)}`
    : SIGN_IN_PATH;
}

/** One redirect per page load, even when several requests fail together. */
let isRedirectingToSignIn = false;

export function redirectToSignIn(reason?: string): void {
  if (typeof window === 'undefined') return;
  // Already on a public route (usually sign-in itself): nothing to redirect to,
  // and this is what keeps a failing request from looping.
  if (isPublicPath(window.location.pathname)) return;
  if (isRedirectingToSignIn) return;

  isRedirectingToSignIn = true;

  // A full navigation is deliberate: it discards every cached component, so no
  // protected page can keep rendering, and `replace` leaves nothing behind for
  // the back button to return to.
  window.location.replace(signInUrl(reason));
}

/**
 * The single reaction to a session the backend no longer accepts, however it
 * was detected: drop the stored session, tell the app (so the in-memory user is
 * cleared), and move to sign-in with an explanation.
 */
export function endSession(): void {
  clearSession();
  notifySessionExpired();
  redirectToSignIn(SESSION_EXPIRED_REASON);
}
