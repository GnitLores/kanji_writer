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
      kanjiByLevel: [],
      displayLevel: -1, // -1: display all levels, -2: display all kanji without levels, -3: display no kanji
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

      await this.loadSortingList();
    },
    async loadSortingList(listName = "kanken") {
      const docRef = doc(db, "lists", listName);
      const docSnap = await getDoc(docRef);
      this.sortingName = listName;
      this.nrOfLevels = docSnap.data().nrOfLevels;
      this.levelNames = docSnap.data().levelNames;
      this.levelIndices = docSnap.data().levelList;

      this.sortKanjiByLevel();
      this.setDisplayList();
    },
    sortKanjiByLevel() {
      // Initialize list of level objects:
      this.kanjiByLevel = [];
      this.levelNames.forEach((name) => {
        this.kanjiByLevel.push({ name, kanji: [] });
      });

      // Assign kanji to level objects:
      this.levelIndices.forEach((levelIdx, KanjiIdx) => {
        this.kanjiByLevel[levelIdx].kanji.push(this.kanjiList[KanjiIdx]);
      });
    },
    setDisplayList(displayLevel = -1) {
      if (displayLevel === -1) {
        this.displayList = this.kanjiByLevel; // -1: display all levels
        return;
      }
      if (displayLevel === -2) {
        this.displayList = [{ name: "All levels", kanji: this.kanjiList }]; // -2: display all kanji without levels
        return;
      }
      if (displayLevel === -3) {
        this.displayList = []; // -3: display no kanji
        return;
      }
      this.displayList = this.kanjiByLevel[displayLevel];
    },
  },
});
