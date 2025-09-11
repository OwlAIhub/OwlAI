// Simple Contact Service
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  company?: string;
  inquiryType: string;
}

export interface ContactSubmission extends ContactFormData {
  id?: string;
  status: string;
  createdAt: unknown;
}

class ContactService {
  private contactsCollection = collection(db, "contacts");

  async submitContact(data: ContactFormData): Promise<string> {
    try {
      // Create simple contact submission
      const contactData: Omit<ContactSubmission, "id"> = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim(),
        phone: data.phone?.trim() || "",
        subject: data.subject?.trim() || "",
        company: data.company?.trim() || "",
        inquiryType: data.inquiryType || "general",
        status: "new",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.contactsCollection, contactData);
      return docRef.id;
    } catch (error) {
      console.error("Contact submission error:", error);
      throw new Error("Failed to submit contact form. Please try again.");
    }
  }
}

export const contactService = new ContactService();
