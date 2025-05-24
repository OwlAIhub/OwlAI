import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBP84jQKc5qOpq_iGwlvNgqCmLlmnPnfG0",
  authDomain: "mvp-3234.firebaseapp.com",
  projectId: "mvp-3234",
  storageBucket: "mvp-3234.firebasestorage.app",
  messagingSenderId: "416496021940",
  appId: "1:416496021940:web:1ae40846e7ff15eba142e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
