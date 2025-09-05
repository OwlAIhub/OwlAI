import { db } from '@/lib/firebase-client';
import {
  DocumentData,
  Unsubscribe,
  collection,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

export type MessageModel = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  createdAt?: any; // Firestore Timestamp
  meta?: Record<string, unknown>;
};

export function subscribeToMessages(
  chatId: string,
  onChange: (messages: MessageModel[]) => void,
  pageSize: number = 50
): Unsubscribe {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc'),
    limitToLast(pageSize)
  );

  // Subscribing to messages for chat

  return onSnapshot(
    q,
    snap => {
      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as DocumentData),
      })) as MessageModel[];
      // Messages subscription update
      onChange(items);
    },
    () => {
      // Subscription error handled gracefully
    }
  );
}

export type ChatListItem = {
  id: string;
  title: string;
  updatedAt?: any; // Firestore Timestamp
  guestId: string;
};

export function subscribeToChatsForGuest(
  guestId: string,
  onChange: (chats: ChatListItem[]) => void,
  pageSize: number = 50
): Unsubscribe {
  const q = query(
    collection(db, 'chats'),
    orderBy('updatedAt', 'desc'),
    limit(pageSize)
  );

  // Subscribing to chats for guest

  return onSnapshot(
    q,
    snap => {
      const items = snap.docs
        .map(d => ({ id: d.id, ...(d.data() as DocumentData) }))
        .filter((c: any) => c.guestId === guestId) as ChatListItem[];
      // Chats subscription update
      onChange(items);
    },
    () => {
      // Subscription error handled gracefully
    }
  );
}
