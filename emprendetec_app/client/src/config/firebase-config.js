import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtTnHyVuGu3OmlWb2WDiruFZSAu4bLuHA",
  authDomain: "emprendetec-7fe80.firebaseapp.com",
  projectId: "emprendetec-7fe80",
  storageBucket: "emprendetec-7fe80.appspot.com",
  messagingSenderId: "209184059134",
  appId: "1:209184059134:web:e4b3f5f4dabbe5b68bbfaf",
  measurementId: "G-HBQCQLKPBV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (
  process.env.NODE_ENV !== "development" &&
  window.location.hostname !== "localhost"
) {
  getAnalytics(app);
}