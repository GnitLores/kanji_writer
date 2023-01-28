import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      kanjiData: {},
      kanji: "",
      writingData: {},
    };
  },
  actions: {
    async loadKanji(char) {
      const docRef = doc(db, "kanji", char);
      const snapshot = await getDoc(docRef);
      const loadedData = snapshot.data();
      this.kanji = loadedData.kanji;
      this.writingData = JSON.parse(loadedData.data);
      this.kanjiData = loadedData;
    },
    async loadKanjiList(list = "kanken") {
      const docRef = doc(db, "lists", list);

      const docSnap = await getDoc(docRef);
      return docSnap.data().list;
    },
  },
});
