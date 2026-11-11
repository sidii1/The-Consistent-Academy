import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-only Firestore (Admin SDK — bypasses security rules).
 *
 * Credentials, in order:
 *  1. FIREBASE_SERVICE_ACCOUNT  — the service-account JSON (raw or base64). Set this on Vercel.
 *  2. ./serviceAccountKey.json  — local development only (git-ignored).
 */
const loadCredentials = () => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(text);
  }
  const local = join(process.cwd(), "serviceAccountKey.json");
  if (existsSync(local)) return JSON.parse(readFileSync(local, "utf8"));
  throw new Error(
    "Firebase Admin credentials missing: set FIREBASE_SERVICE_ACCOUNT (JSON or base64) in the server environment."
  );
};

let app: App | undefined;

export const adminDb = (): Firestore => {
  if (!app) {
    app = getApps()[0] ?? initializeApp({ credential: cert(loadCredentials()) });
  }
  return getFirestore(app);
};
