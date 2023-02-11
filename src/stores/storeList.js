import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { listCollection } from "@/includes/firebase";
import { useStoreOptions } from "@/stores/storeOptions";
import { useSelection } from "@/use/useSelection";

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
      docSnap.data().list.forEach((char, idx) => {
        this.kanjiList.push({
          char,
          idx,
        });
      });

      // Map each kanji to its index
      const nKanji = this.kanjiList.length;
      const indices = [...Array(nKanji).keys(nKanji)];
      const map = new Map();
      for (let i = 0; i < nKanji; i++) {
        map.set(this.kanjiList[i].char, indices[i]);
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
          char: source.char,
          mainIdx: mainIdx,
        };
        data[levelIdx].kanji.push(target);
      });

      data.forEach((level, levelIdx) => {
        level.kanji.forEach((kanji, idxInLevel) => {
          kanji.levelIdx = levelIdx;
          kanji.idxInLevel = idxInLevel;
        });
      });

      this.kanjiByLevel = data;

      const { initSelected, initViewing } = useSelection();
      initSelected();
    },
  },
});
