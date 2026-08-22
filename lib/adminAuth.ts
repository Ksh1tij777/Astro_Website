// Signs/verifies the admin session cookie with HMAC-SHA256 via Web Crypto,
// which is available both in Next.js middleware (Edge runtime) and in
// Node-runtime API routes — so this one implementation covers both.

const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
export const ADMIN_COOKIE_NAME = 'admin_session';

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Missing ADMIN_SESSION_SECRET env var.');
  return secret;
}

async function importHmacKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, usages);
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getSecret();
  const expiry = Date.now() + SESSION_MAX_AGE_MS;
  const key = await importHmacKey(secret, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(expiry)));
  return `${expiry}.${toBase64Url(sig)}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, sigB64] = token.split('.');
  if (!expiryStr || !sigB64) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  try {
    const secret = getSecret();
    const key = await importHmacKey(secret, ['verify']);
    const sigBytes = fromBase64Url(sigB64);
    return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(expiryStr));
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;
