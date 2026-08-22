import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

type Credentials = { projectId: string; clientEmail: string; privateKey: string };

// Normalizes the common ways people accidentally mangle a pasted PEM key in
// an env var UI: wrapping quotes left in by mistake, stray "\r" from a
// Windows-originated paste, and escaped "\n" sequences that need to become
// real newlines.
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n').replace(/\r/g, '');
}

function assertValidPem(privateKey: string) {
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error(
      'The Firebase private key does not look like a valid PEM key (missing BEGIN/END markers) — ' +
        're-copy it from the service-account JSON.',
    );
  }
}

// Raw PEM pasted into a single env var is notoriously fragile through web UIs
// (dropped newlines, injected \r, truncated paste). Prefer a single
// base64-encoded copy of the whole service-account JSON — it's one opaque
// string with no special characters, so there's nothing for an env var UI to
// mangle. Falls back to the three separate FIREBASE_* vars for compatibility.
function readCredentials(): Credentials {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (encoded) {
    let json: { project_id?: string; client_email?: string; private_key?: string };
    try {
      json = JSON.parse(Buffer.from(encoded.trim(), 'base64').toString('utf8'));
    } catch (err) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_BASE64 is not valid base64-encoded JSON: ${err instanceof Error ? err.message : err}`,
      );
    }
    if (!json.project_id || !json.client_email || !json.private_key) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 decoded, but is missing project_id/client_email/private_key.');
    }
    const privateKey = normalizePrivateKey(json.private_key);
    assertValidPem(privateKey);
    return { projectId: json.project_id, clientEmail: json.client_email, privateKey };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      'Missing Firebase Admin credentials — set FIREBASE_SERVICE_ACCOUNT_BASE64 (recommended), or ' +
        'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    );
  }

  const privateKey = normalizePrivateKey(rawPrivateKey);
  assertValidPem(privateKey);
  return { projectId, clientEmail, privateKey };
}

// Guard against re-initializing on every Next.js dev hot-reload.
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const { projectId, clientEmail, privateKey } = readCredentials();

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
  }
  return dbInstance;
}
