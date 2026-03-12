import {cert, getApps, initializeApp} from 'firebase-admin/app';
import {getFirestore, type Firestore} from 'firebase-admin/firestore';

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  return key?.replace(/\\n/g, '\n');
}

function hasServiceAccountEnv() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && getPrivateKey());
}

let adminDb: Firestore | null = null;

if (hasServiceAccountEnv()) {
  try {
    const app =
      getApps()[0] ??
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: getPrivateKey()
        })
      });

    adminDb = getFirestore(app);
  } catch (error) {
    console.error('[firebase-admin] Failed to initialize Firebase Admin SDK.', error);
  }
} else {
  console.warn(
    '[firebase-admin] FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is missing. Admin reads are disabled.'
  );
}

export {adminDb};
