import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";

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
    isLevelDisplayed(name) {
      return !this.ignoredLevels.includes(name);
    },
  },
});
