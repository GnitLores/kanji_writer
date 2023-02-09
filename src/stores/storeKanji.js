import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { kanjiCollection } from "@/includes/firebase";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      kanjiData: {},
      char: "",
      writingData: {},
      nStrokes: 0,
      showModal: false,
    };
  },
  actions: {
    init() {
      this.char = "";
      this.writingData = {};
      this.kanjiData = {};
      this.nStrokes = 0;
    },
    async loadKanji(char) {
      const docRef = doc(kanjiCollection, char);
      const snapshot = await getDoc(docRef);
      const loadedData = snapshot.data();
      this.char = loadedData.kanji;
      this.writingData = JSON.parse(loadedData.data);
      this.nStrokes = this.writingData.strokes.length;
      this.kanjiData = loadedData;
      console.log(this.kanjiData);
    },
    async displayKanjiDetailsModal(char) {
      await this.loadKanji(char);
      this.showModal = true;
    },
    hideDetailsModal() {
      this.showModal = false;
      this.init();
    },
  },
});
