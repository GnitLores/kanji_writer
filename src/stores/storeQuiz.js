import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStoreQuiz = defineStore("storeQuiz", {
  state: () => {
    return {
      kanji: "",
      mistakes: 0,
    };
  },
  actions: {
    initQuiz() {
      this.kanji = "";
      this.mistakes = 0;
    },
    startQuiz(kanji) {
      this.initQuiz();
      this.kanji = kanji;
    },
    addMistake() {
      this.mistakes += 1;
    },
  },
});
