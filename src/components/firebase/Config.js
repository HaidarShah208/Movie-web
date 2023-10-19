import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {collection} from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyARfvuRuh3lRiisTlEnSp4FD1BbyLB1z0w",
  authDomain: "filmidunia-6d549.firebaseapp.com",
  projectId: "filmidunia-6d549",
  storageBucket: "filmidunia-6d549.appspot.com",
  messagingSenderId: "88895496396",
  appId: "1:88895496396:web:38d9daba51797e2d206269",
  measurementId: "G-7CS586DF85"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const movieRef=collection(db,'movie')
export const reviewsRef=collection(db,'reviews')
export const userRef=collection(db,'users')
 


const analytics = getAnalytics(app);
export default app;