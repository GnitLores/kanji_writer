import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStoreQuiz = defineStore("storeQuiz", {
  state: () => {
    return {
      title: "Kanji Writer",
      kanji: "",
      mistakes: 0,
      quizSize: 200, // pixels
    };
  },
  actions: {
    initQuiz() {
      this.title = "Kanji Writer";
      this.kanji = "";
      this.mistakes = 0;
    },
    startQuiz(kanji) {
      this.initQuiz();
      this.kanji = kanji;
      this.title = "Quiz";
    },
    startLearning(kanji) {
      this.initQuiz();
      this.kanji = kanji;
      this.title = "Learn";
    },
    addMistake() {
      this.mistakes += 1;
    },
  },
});
