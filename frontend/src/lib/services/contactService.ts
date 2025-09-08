import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  timestamp?: Timestamp;
  status?: 'new' | 'read' | 'replied';
}

export interface ContactSubmissionWithId extends ContactSubmission {
  id: string;
}

// Collection name for contact submissions
const CONTACTS_COLLECTION = 'contacts';

/**
 * Submit a new contact form
 */
export const submitContactForm = async (contactData: Omit<ContactSubmission, 'timestamp' | 'status'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...contactData,
      timestamp: serverTimestamp(),
      status: 'new'
    });
    
    console.log('Contact form submitted with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form: ', error);
    throw new Error('Failed to submit contact form');
  }
};

/**
 * Get all contact submissions (for admin use)
 */
export const getContactSubmissions = async (limitCount: number = 50): Promise<ContactSubmissionWithId[]> => {
  try {
    const q = query(
      collection(db, CONTACTS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const contacts: ContactSubmissionWithId[] = [];
    
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data() as ContactSubmission
      });
    });
    
    return contacts;
  } catch (error) {
    console.error('Error getting contact submissions: ', error);
    throw new Error('Failed to get contact submissions');
  }
};

/**
 * Real-time listener for contact submissions (for admin dashboard)
 */
export const subscribeToContactSubmissions = (callback: (contacts: ContactSubmissionWithId[]) => void) => {
  // This would be implemented with onSnapshot for real-time updates
  // For now, we'll just return the unsubscribe function
  return () => {};
};