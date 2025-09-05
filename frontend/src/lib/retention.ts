import { adminDb, FieldValue } from '@/lib/firebase-admin';

export const SOFT_QUOTA_MESSAGES = 500; // warn/trim history used for LLM
export const KEEP_LAST_MESSAGES = 10000; // retention: keep last N online
export const ARCHIVE_COLLECTION = 'archives';

export async function getMessageCount(chatId: string): Promise<number> {
  const chatRef = adminDb.collection('chats').doc(chatId);
  const snap = await chatRef.get();
  const count = (snap.data()?.meta?.messageCount as number) || 0;
  return count;
}

// Returns messages in ascending order (oldest first)
export async function getAllMessagesAsc(chatId: string) {
  const msgsSnap = await adminDb
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .get();
  return msgsSnap.docs;
}

// Archive oldest messages so only keepLast remain under /chats/{chatId}/messages
export async function archiveOldMessages(
  chatId: string,
  keepLast: number = KEEP_LAST_MESSAGES
) {
  const docs = await getAllMessagesAsc(chatId);
  if (docs.length <= keepLast) return { archived: 0 };
  const toArchive = docs.slice(0, docs.length - keepLast);

  const archiveCol = adminDb
    .collection(ARCHIVE_COLLECTION)
    .doc(chatId)
    .collection('messages');

  // Firestore batch writes limited to 500 ops; chunk operations
  let archived = 0;
  for (let i = 0; i < toArchive.length; i += 450) {
    const chunk = toArchive.slice(i, i + 450);
    const batch = adminDb.batch();
    for (const d of chunk) {
      const data = d.data();
      const destRef = archiveCol.doc(d.id);
      batch.set(destRef, { ...data, archivedAt: FieldValue.serverTimestamp() });
      batch.delete(d.ref);
      archived += 1;
    }
    await batch.commit();
  }

  // Update chat meta after archiving
  await adminDb
    .collection('chats')
    .doc(chatId)
    .update({
      'meta.messageCount': docs.length - archived,
      updatedAt: FieldValue.serverTimestamp(),
    });

  return { archived };
}

// Build a trimmed history for LLM within soft quota
export function buildTrimmedHistory(
  messages: Array<{ role: 'user' | 'ai'; text: string }>,
  maxCount: number = SOFT_QUOTA_MESSAGES
) {
  if (messages.length <= maxCount) return messages;
  return messages.slice(-maxCount);
}
