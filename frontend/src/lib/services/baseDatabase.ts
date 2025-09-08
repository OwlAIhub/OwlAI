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
  protected handleError(error: any, operation: string): DatabaseError {
    console.error(`Database ${operation} error:`, error);
    return {
      code: error.code || 'unknown',
      message: error.message || `Failed to ${operation}`,
      details: error,
    };
  }

  async create<T extends Record<string, any>>(
    collectionName: CollectionName,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ id: string; data: T }> {
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
      throw this.handleError(error, 'create');
    }
  }

  async update<T extends Record<string, any>>(
    collectionName: CollectionName,
    id: string,
    data: Partial<T>
  ): Promise<T> {
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
      throw this.handleError(error, 'update');
    }
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
    constraints: any[] = [],
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
    constraints: any[] = [],
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
