import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { listCollection } from "@/includes/firebase";
import { useStoreOptions } from "@/stores/storeOptions";

export const useStoreList = defineStore("storeList", {
  state: () => {
    return {
      kanjiList: [],
      indexMap: null,
      sortingName: "",
      nrOfLevels: 0,
      levelNames: [],
      levelIndices: [],
      kanjiByLevel: [],
    };
  },
  actions: {
    async loadKanjiList() {
      const docRef = doc(listCollection, "kanji");
      const docSnap = await getDoc(docRef);
      this.kanjiList = [];
      docSnap.data().list.forEach((kanji, idx) => {
        this.kanjiList.push({
          kanji,
          idx,
        });
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
      const docRef = doc(listCollection, listName);
      const docSnap = await getDoc(docRef);
      this.sortingName = listName;
      this.nrOfLevels = docSnap.data().nrOfLevels;
      this.levelNames = docSnap.data().levelNames;
      this.levelIndices = docSnap.data().levelList;

      // Initialize list of levelnames to display (checkboxes are bound to this list)
      const storeOptions = useStoreOptions();
      storeOptions.displayLevelNames = [...this.levelNames];

      this.sortKanjiByLevel();
    },
    sortKanjiByLevel() {
      // Initialize list of level objects:
      const data = [];
      this.levelNames.forEach((name) => {
        data.push({
          name,
          kanji: [],
        });
      });

      this.levelIndices.forEach((levelIdx, mainIdx) => {
        // clone:
        const source = this.kanjiList[mainIdx];
        const target = {
          kanji: source.kanji,
          mainIdx: mainIdx,
          selected: false,
        };
        data[levelIdx].kanji.push(target);
      });

      this.kanjiByLevel = data;
    },
  },
});
