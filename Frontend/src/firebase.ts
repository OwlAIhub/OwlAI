// FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
// import { initializeApp, FirebaseApp } from "firebase/app";
// import {
//   getAuth,
//   Auth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   ConfirmationResult,
// } from "firebase/auth";
// import { getFirestore, Firestore } from "firebase/firestore";

// // Firebase configuration interface
// interface FirebaseConfig {
//   apiKey: string;
//   authDomain: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId: string;
//   appId: string;
//   measurementId: string;
// }

// // Temporary mock Firebase config to prevent auth errors
// const firebaseConfig: FirebaseConfig = {
//   apiKey: "mock-api-key",
//   authDomain: "mock-domain.firebaseapp.com",
//   projectId: "mock-project",
//   storageBucket: "mock-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "mock-app-id",
//   measurementId: "mock-measurement-id",
// };

// // Initialize Firebase
// const app: FirebaseApp = initializeApp(firebaseConfig);

// // Initialize Firebase Auth
// const auth: Auth = getAuth(app);

// // Initialize Firestore
// const db: Firestore = getFirestore(app);

// // Export Firebase services with proper types
// export {
//   auth,
//   db,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   type ConfirmationResult,
//   type FirebaseConfig,
// };

// Mock Firebase exports for development
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null);
    return () => {};
  },
  signOut: () => Promise.resolve(),
} as any;

export const db = {} as any;
export const RecaptchaVerifier = class MockRecaptchaVerifier {};
export const signInWithPhoneNumber = () => Promise.resolve({} as any);
export type ConfirmationResult = any;
export type FirebaseConfig = any;
