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
    setIndicesAsKnown(indices, toggle = true) {
      indices.forEach((idx) => {
        this.known[idx] = toggle;
      });
    },
  },
});
