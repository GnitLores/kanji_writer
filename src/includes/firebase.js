import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaZaf_a8waPL3pBGkAw2Bc9gt2DLz5IOs",
  authDomain: "kanji-writer.firebaseapp.com",
  projectId: "kanji-writer",
  storageBucket: "kanji-writer.appspot.com",
  messagingSenderId: "609278274279",
  appId: "1:609278274279:web:5673c50fb91ac90fa61042",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// console.log(db);
// const kanjiCollection = db.collection("kanji");
const kanjiCollection = collection(db, "kanji");
const listCollection = collection(db, "lists");

export { db, auth, storage, kanjiCollection, listCollection };
