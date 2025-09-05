import { db } from '@/lib/firebase-client';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

export type Page<T> = {
  items: T[];
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
};

export async function fetchLatestMessagesPage(
  chatId: string,
  pageSize: number = 50
): Promise<Page<{ id: string; [k: string]: unknown }>> {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc'),
    limitToLast(pageSize)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as DocumentData),
  }));
  const lastDoc = snap.docs.length
    ? (snap.docs[0] as QueryDocumentSnapshot<DocumentData>)
    : null; // first doc in asc order page to back-paginate
  return { items, lastDoc };
}

export async function fetchOlderMessagesPage(
  chatId: string,
  beforeDoc: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = 50
): Promise<Page<{ id: string; [k: string]: unknown }>> {
  // Fetch older messages by starting after the earliest doc we have
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc'),
    startAfter(beforeDoc),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as DocumentData),
  }));
  const lastDoc = snap.docs.length
    ? (snap.docs[0] as QueryDocumentSnapshot<DocumentData>)
    : null;
  return { items, lastDoc };
}

export async function fetchChatsPageForGuest(
  guestId: string,
  pageSize: number = 50,
  cursor?: QueryDocumentSnapshot<DocumentData>
): Promise<Page<{ id: string; [k: string]: unknown }>> {
  const baseCol = collection(db, 'chats');
  const baseOrder = orderBy('updatedAt', 'desc');
  let q;
  if (cursor) {
    q = query(
      baseCol,
      where('guestId', '==', guestId),
      baseOrder,
      startAfter(cursor),
      limit(pageSize)
    );
  } else {
    q = query(
      baseCol,
      where('guestId', '==', guestId),
      baseOrder,
      limit(pageSize)
    );
  }
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as DocumentData),
  }));
  const lastDoc = snap.docs.length
    ? (snap.docs[snap.docs.length - 1] as QueryDocumentSnapshot<DocumentData>)
    : null;
  return { items, lastDoc };
}
