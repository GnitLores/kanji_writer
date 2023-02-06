import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";
import { useStoreList } from "@/stores/storeList";

export const useStoreOptions = defineStore("storeOptions", {
  state: () => {
    return {
      // Kanji display options:
      doDisplayLevels: true,
      ignoredLevels: [],
      showDisplayOptions: false,
      reverseOrder: false,
    };
  },
  actions: {
    isLevelIgnored(name) {
      return this.ignoredLevels.includes(name);
    },
    allLevelsIgnored() {
      const storeList = useStoreList();
      return this.ignoredLevels.length === storeList.nrOfLevels;
    },
  },
});
