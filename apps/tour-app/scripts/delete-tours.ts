import {pathToFileURL} from 'node:url';

import {adminDb} from '../lib/firebase/admin';
import {commitInBatches} from './lib/firestore-batch';

export async function deleteTours() {
  if (!adminDb) {
    throw new Error(
      'Firebase Admin SDK is not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
    );
  }

  const collectionRef = adminDb.collection('tours');
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log('No tours found.');
    return;
  }

  await commitInBatches(adminDb, snapshot.docs, (batch, doc) => {
    batch.delete(doc.ref);
  });

  console.log(`Deleted ${snapshot.size} tours.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  deleteTours().catch((error) => {
    console.error('Delete failed', error);
    process.exit(1);
  });
}
