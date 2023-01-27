import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/includes/firebase";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      writingData: {},
    };
  },
  actions: {
    async loadKanji(char) {
      const docRef = doc(db, "kanji", char);
      const docSnap = await getDoc(docRef);
      this.writingData = JSON.parse(docSnap.data().data);
    },
    async loadKanjiList(list = "kanken") {
      const docRef = doc(db, "lists", list);

      const docSnap = await getDoc(docRef);
      // console.log(docSnap.data());
      // const kanjiList = docSnap.data();
      // console.log(docSnap.data());
      return docSnap.data().list;
    },
  },
});
