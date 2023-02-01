import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { kanjiCollection } from "@/includes/firebase";

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
      const docRef = doc(kanjiCollection, char);
      const snapshot = await getDoc(docRef);
      const loadedData = snapshot.data();
      this.kanji = loadedData.kanji;
      this.writingData = JSON.parse(loadedData.data);
      this.kanjiData = loadedData;
    },
  },
});
