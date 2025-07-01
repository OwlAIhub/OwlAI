import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyChervEXPg9unoA8LQOYN73kQV2zkQrkY0",
authDomain: "owl-ai-1ef31.firebaseapp.com",
projectId: "owl-ai-1ef31",
storageBucket: "owl-ai-1ef31.firebasestorage.app",
messagingSenderId: "202604444478",
appId: "1:202604444478:web:dd2fc34ca902361ccbca6f",
measurementId: "G-LY2D6QL6B9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { 
auth, 
db, 
RecaptchaVerifier, 
signInWithPhoneNumber 
};
