import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";

export const useStoreOptions = defineStore("storeOptions", {
  state: () => {
    return {
      // Kanji display options:
      doDisplayLevels: true,
      displayLevelNames: [],
    };
  },
  actions: {},
});
