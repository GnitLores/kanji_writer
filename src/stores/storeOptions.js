import { reactive } from "vue";
import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db, kanjiCollection } from "@/includes/firebase";
import { useStoreList } from "@/stores/storeList";
import { useKanji } from "@/use/useKanji";

export const useStoreOptions = defineStore("storeOptions", {
  state: () => {
    return {
      // Kanji grid display options:
      doDisplayLevels: true,
      ignoredLevels: [],
      showDisplayOptions: false,
      reverseOrder: false,

      // Writing options:
      hintDelay: 500,
      showDetailsOutline: true,
      showDetailsHints: true,
      showDetailsStrokeOrder: true,
      outlineOpacity: 0.7,
      showLines: true,
      // gridUiMinHeight: "min-h-[550px]",
      // gridUiMinHeightCompact: "min-h-[400px]",
      writerSize: 300,
      gridUiMinHeight: "h-[550px]",
      gridUiMinHeightCompact: "h-[400px]",

      // Details modal display:
      modalKanji: {},
      showDetailsModal: false,
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
    async displayKanjiDetailsModal(char) {
      this.modalKanji = reactive(useKanji());
      await this.modalKanji.loadKanji(char);
      this.showDetailsModal = true;
    },
    hideDetailsModal() {
      this.modalKanji = {};
      this.showDetailsModal = false;
    },
  },
});
