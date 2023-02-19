import {} from "vue";
import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";
import { useStoreList } from "@/stores/storeList";

export const useStoreUser = defineStore("storeUser", {
  state: () => {
    return {
      known: [],
    };
  },
  actions: {
    initUser() {
      const storeList = useStoreList();
      this.known = new Array(storeList.kanjiList.length).fill(false);
    },
    setSelectionAsKnown(selection, toggle = true) {
      this.known = selection.map((isSelected, idx) =>
        isSelected ? toggle : this.known[idx]
      );
    },
    setKanjiAsKnown(char, toggle = true) {
      const storeList = useStoreList();
      const mainIdx = storeList.getMainIndex(char);
      this.known[mainIdx] = toggle;
    },
  },
});
