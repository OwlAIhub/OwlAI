import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase-client';

export async function sendUserMessage(chatId: string, text: string) {
  if (!chatId) throw new Error('chatId is required');
  if (!text || !text.trim()) throw new Error('text is required');

  // 1) Add user message
  const msgRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
    role: 'user',
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  // 2) Update chat.updatedAt in a batch
  const batch = writeBatch(db);
  batch.update(doc(db, 'chats', chatId), { updatedAt: serverTimestamp() });
  await batch.commit();

  // 3) Ensure chat document exists before calling backend
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    throw new Error(`Chat document ${chatId} does not exist`);
  }

  // 4) Call backend to produce AI reply
  await fetch('/api/ai/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, messageId: msgRef.id }),
  });

  return msgRef.id;
}
