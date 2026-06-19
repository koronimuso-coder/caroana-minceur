import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore, FieldValue } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";
import { env } from "@/config/env";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;
let cachedStorage: Storage | null = null;

// Dummy PEM private key to bypass Next.js build-time static checks
const DUMMY_PEM_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END PRIVATE KEY-----`;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  let privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n");
  
  // Verify if the key starts with the correct PEM prefix
  const isValidPEM = privateKey.includes("-----BEGIN PRIVATE KEY-----");
  
  if (!isValidPEM) {
    // If not a valid PEM (such as in local .env.local placeholder), use dummy PEM for build compilation
    privateKey = DUMMY_PEM_KEY;
  }

  const serviceAccount = {
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey,
  };

  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    cachedApp = apps[0];
  } else {
    cachedApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return cachedApp;
}

// Export lazy proxies. First time a method is accessed on these objects, 
// they will initialize the Firebase Admin App and service instance.
export const adminDb = new Proxy({} as Firestore, {
  get(target, prop, receiver) {
    if (!cachedDb) {
      cachedDb = getFirestore(getAdminApp());
    }
    return Reflect.get(cachedDb, prop, receiver);
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get(target, prop, receiver) {
    if (!cachedAuth) {
      cachedAuth = getAuth(getAdminApp());
    }
    return Reflect.get(cachedAuth, prop, receiver);
  }
});

export const adminStorage = new Proxy({} as any, {
  get(target, prop, receiver) {
    if (!cachedStorage) {
      cachedStorage = getStorage(getAdminApp());
    }
    return Reflect.get(cachedStorage, prop, receiver);
  }
});

export { FieldValue };
