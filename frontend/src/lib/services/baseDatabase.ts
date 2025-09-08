/**
 * Base Database Service - Core CRUD operations
 */

import { db } from '@/lib/firebase';
import type {
  CollectionName,
  DatabaseError,
  PaginationOptions,
  QueryResult,
} from '@/lib/types/database';
import {
  QueryConstraint,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from 'firebase/firestore';

export class DatabaseService {
  protected handleError(error: unknown, operation: string): DatabaseError {
    console.error(`Database ${operation} error:`, error);
    const err = (error as { code?: string; message?: string }) || {};
    return {
      code: err.code || 'unknown',
      message: err.message || `Failed to ${operation}`,
      details: error,
    };
  }

  async create<T extends Record<string, unknown>>(
    collectionName: CollectionName,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ id: string; data: T }> {
    const maxAttempts = 5;
    let attempt = 0;
    let lastError: unknown = null;
    while (attempt < maxAttempts) {
      attempt++;
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Document was not created');
        }

        return {
          id: docRef.id,
          data: { id: docRef.id, ...docSnap.data() } as unknown as T,
        };
      } catch (error) {
        lastError = error;
        // Exponential backoff on contention
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw this.handleError(lastError, 'create');
  }

  async update<T extends Record<string, unknown>>(
    collectionName: CollectionName,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const maxAttempts = 5;
    let attempt = 0;
    let lastError: unknown = null;
    while (attempt < maxAttempts) {
      attempt++;
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Document not found');
        }

        return { id, ...docSnap.data() } as unknown as T;
      } catch (error) {
        lastError = error;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw this.handleError(lastError, 'update');
  }

  async delete(collectionName: CollectionName, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw this.handleError(error, 'delete');
    }
  }

  async getById<T>(
    collectionName: CollectionName,
    id: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return { id, ...docSnap.data() } as unknown as T;
    } catch (error) {
      throw this.handleError(error, 'getById');
    }
  }

  async query<T>(
    collectionName: CollectionName,
    constraints: QueryConstraint[] = [],
    options: PaginationOptions = { limit: 20 }
  ): Promise<QueryResult<T>> {
    try {
      let q = query(collection(db, collectionName), ...constraints);

      if (options.orderBy) {
        q = query(
          q,
          orderBy(options.orderBy, options.orderDirection || 'desc')
        );
      }

      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      q = query(q, limit(options.limit + 1));

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      const hasMore = docs.length > options.limit;

      if (hasMore) {
        docs.pop();
      }

      const data = docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      return {
        data,
        hasMore,
        lastDoc: hasMore ? docs[docs.length - 1] : null,
      };
    } catch (error) {
      throw this.handleError(error, 'query');
    }
  }

  subscribe<T>(
    collectionName: CollectionName,
    constraints: QueryConstraint[] = [],
    callback: (data: T[]) => void
  ): Unsubscribe {
    const q = query(collection(db, collectionName), ...constraints);

    return onSnapshot(q, querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    });
  }
}
