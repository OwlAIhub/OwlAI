import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(
  /\\n/g,
  '\n'
);

// Firebase Admin configuration loaded

if (!admin.apps.length) {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin env vars');
  }
  admin.initializeApp(
    {
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    },
    'owlaidb-admin'
  ); // Named app for admin
}

export const adminDb = getFirestore(admin.app('owlaidb-admin'), 'owlaidb');

export const FieldValue = admin.firestore.FieldValue;
