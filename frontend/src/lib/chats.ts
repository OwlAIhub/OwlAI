import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase-client';
import { Persona, getDefaultPersona, getGuestId, getPersona } from './guest';

const CURRENT_CHAT_ID_KEY = 'currentChatId';

export function setCurrentChatId(chatId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_CHAT_ID_KEY, chatId);
}

export function getCurrentChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_CHAT_ID_KEY);
}

export async function createNewChat(options?: {
  title?: string;
  persona?: Persona;
}) {
  const guestId = getGuestId();
  if (!guestId) throw new Error('guestId unavailable');
  const persona = options?.persona ?? getPersona() ?? getDefaultPersona();
  const title = options?.title ?? 'Untitled Chat';

  const ref = await addDoc(collection(db, 'chats'), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    guestId,
    persona,
    meta: {},
  });
  if (typeof window !== 'undefined') setCurrentChatId(ref.id);
  return ref.id;
}

export async function deleteChatById(chatId: string) {
  if (!chatId) return;
  // Delete messages in batches (max 500 per batch)
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  // Read all messages and batch delete
  const msgsSnap = await getDocs(messagesCol);
  let batch = writeBatch(db);
  let opCount = 0;
  for (const d of msgsSnap.docs) {
    batch.delete(d.ref);
    opCount++;
    if (opCount >= 450) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  }
  if (opCount > 0) await batch.commit();
  // Delete chat document
  await deleteDoc(doc(db, 'chats', chatId));
}

export async function deleteAllChatsForGuest(guestId: string) {
  if (!guestId) return;
  const q = query(collection(db, 'chats'), where('guestId', '==', guestId));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    await deleteChatById(d.id);
  }
}
