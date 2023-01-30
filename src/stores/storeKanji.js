import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      // Selected kanji data:
      kanjiData: {},
      kanji: "",
      writingData: {},
      // Kanji list data:
      kanjiList: [],
      sortingName: "",
      nrOfLevels: 0,
      levelNames: [],
      levelIndices: [],
      displayList: [],
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
    async loadKanjiList() {
      const docRef = doc(db, "lists", "kanji");
      const docSnap = await getDoc(docRef);
      this.kanjiList = docSnap.data().list;
      this.displayList = this.kanjiList;
    },
    async loadSortingList(listName = "kanken") {
      const docRef = doc(db, "lists", listName);
      const docSnap = await getDoc(docRef);
      this.sortingName = listName;
      this.nrOfLevels = docSnap.data().nrOfLevels;
      this.levelNames = docSnap.data().levelNames;
      this.levelIndices = docSnap.data().levelList;
    },
  },
});
