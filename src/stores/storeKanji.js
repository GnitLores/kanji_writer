import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";
import { useStoreOptions } from "@/stores/storeOptions";

export const useStoreKanji = defineStore("storeKanji", {
  state: () => {
    return {
      // Selected kanji data:
      kanjiData: {},
      kanji: "",
      writingData: {},
      // Kanji list data:
      kanjiList: [],
      indexMap: null,
      sortingName: "",
      nrOfLevels: 0,
      levelNames: [],
      levelIndices: [],
      kanjiByLevel: [],
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
      this.kanjiList = [];
      docSnap.data().list.forEach((kanji, idx) => {
        this.kanjiList.push({ kanji, idx, selected: false });
      });

      // Map each kanji to its index
      const nKanji = this.kanjiList.length;
      const indices = [...Array(nKanji).keys(nKanji)];
      const map = new Map();
      for (let i = 0; i < nKanji; i++) {
        map.set(this.kanjiList[i].kanji, indices[i]);
      }
      this.indexMap = map;

      this.loadSortingList();
    },
    async loadSortingList(listName = "kanken") {
      const docRef = doc(db, "lists", listName);
      const docSnap = await getDoc(docRef);
      this.sortingName = listName;
      this.nrOfLevels = docSnap.data().nrOfLevels;
      this.levelNames = docSnap.data().levelNames;
      this.levelIndices = docSnap.data().levelList;

      // Initialize list of levelnames to display (checkboxes are bound to this list)
      const storeOptions = useStoreOptions();
      storeOptions.displayLevelNames = [...this.levelNames];

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
      let idxInLevel = 0;
      let currentLevel = 0;
      this.levelIndices.forEach((levelIdx, KanjiIdx) => {
        this.kanjiByLevel[levelIdx].kanji.push(this.kanjiList[KanjiIdx]);
        this.kanjiList[KanjiIdx].level = levelIdx;

        if (levelIdx !== currentLevel) {
          currentLevel += 1;
          idxInLevel = 0;
        }
        this.kanjiList[KanjiIdx].idxInLevel = idxInLevel;
        idxInLevel += 1;
      });
    },
    setDisplayList() {
      const storeOptions = useStoreOptions();

      const selectedLevels = [];
      this.levelNames.forEach((name, index) => {
        if (storeOptions.doDisplayLevels) {
          if (storeOptions.displayLevelNames.includes(name))
            selectedLevels.push(this.kanjiByLevel[index]);
        } else {
          if (storeOptions.displayLevelNames.includes(name))
            selectedLevels.push(...this.kanjiByLevel[index].kanji);
        }
      });
      this.displayList = storeOptions.doDisplayLevels
        ? selectedLevels
        : [{ name: "All Selected Levels", kanji: selectedLevels }];
    },
  },
});
