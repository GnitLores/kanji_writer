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
      displayList: [],
      displayMap: [],
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
          selected: false,
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
      const storeOptions = useStoreOptions();

      // Initialize list of level objects:
      this.kanjiByLevel = [];
      this.levelNames.forEach((name) => {
        this.kanjiByLevel.push({
          name,
          kanji: [],
        });
      });

      this.levelIndices.forEach((levelIdx, mainIdx) => {
        // clone:
        const source = this.kanjiList[mainIdx];
        const target = { kanji: source.kanji, mainIdx: mainIdx };
        this.kanjiByLevel[levelIdx].kanji.push(target);
      });
      this.updateDisplayList();
    },
    updateDisplayList() {
      const storeOptions = useStoreOptions();

      // Create deep copy of kanji sorted by levels:
      const data = JSON.parse(JSON.stringify(this.kanjiByLevel));

      // Reverse display list if ascending order:
      if (storeOptions.reverseOrder) {
        data.reverse();
        for (const level of data) level.kanji.reverse();
      }

      // Handle processing that differs if levels are not displayed
      if (storeOptions.doDisplayLevels) {
        this.setDisplayListByLevels(data, storeOptions.displayLevelNames);
      } else {
        this.setDisplayListNoLevels(data, storeOptions.displayLevelNames);
      }
    },
    setDisplayListByLevels(data, displaylevels) {
      // Toggle display of each level:
      data.forEach((level) => {
        level.doDisplay = displaylevels.includes(level.name);
      });

      // Map kanji to level and index in level of displayed list:
      const map = new Map();
      data.forEach((level, levelIdx) => {
        level.kanji.forEach((kanji, idxInLevel) => {
          map.set(kanji.kanji, { levelIdx, idxInLevel });
        });
      });
      this.displayMap = map;

      // Assign to display list to update display:
      this.displayList = data;
    },
    setDisplayListNoLevels(data, displaylevels) {
      // Collapse kanji list while excluding hidden levels:
      const collapsedList = [];
      this.levelNames.forEach((name, index) => {
        if (displaylevels.includes(name))
          collapsedList.push(...data[index].kanji);
      });

      // Map kanji to level and index in level of displayed list:
      const map = new Map();
      for (let i = 0; i < collapsedList.length; i++) {
        map.set(collapsedList[i].kanji, { level: 1, idxInLevel: i });
      }
      this.displayMap = map;

      // Assign to display list to update display:
      this.displayList = [
        { kanji: collapsedList, name: "All selected levels" },
      ];
    },
  },
});
