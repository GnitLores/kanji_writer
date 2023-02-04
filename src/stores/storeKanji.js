import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { kanjiCollection } from "@/includes/firebase";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      kanjiData: {},
      char: "",
      writingData: {},
      showModal: false,
    };
  },
  actions: {
    async loadKanji(char) {
      const docRef = doc(kanjiCollection, char);
      const snapshot = await getDoc(docRef);
      const loadedData = snapshot.data();
      this.char = loadedData.kanji;
      this.writingData = JSON.parse(loadedData.data);
      this.kanjiData = loadedData;
    },
    displayKanjiDetailsModal(char) {
      this.loadKanji(char);
      this.showModal = true;
    },
  },
});
