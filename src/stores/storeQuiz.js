import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStoreQuiz = defineStore("storeQuiz", {
  state: () => {
    return {
      title: "Kanji Writer",
      kanji: "",
      mistakes: 0,
      currentStroke: 0,
      status: {},
      quizSize: 200, // pixels
    };
  },
  actions: {
    initQuiz() {
      this.title = "Kanji Writer";
      this.kanji = "";
      this.mistakes = 0;
      this.currentStroke = 0;
      this.status = {};
    },
    resetQuiz() {
      this.mistakes = 0;
      this.currentStroke = 0;
      this.status = {};
    },
    startQuiz(kanji) {
      this.resetQuiz();
      this.kanji = kanji;
      this.title = "Quiz";
    },
    startLearning(kanji) {
      this.resetQuiz();
      this.kanji = kanji;
      this.title = "Learn";
    },
    addMistake(status) {
      this.mistakes += 1;
      this.status = status;
    },
    addStroke(status) {
      this.currentStroke += 1;
      this.status = status;
    },
  },
  getters: {
    strokesRemain: (state) =>
      !(state.status && state.status.strokesRemaining == 0),
    quizIsActive: (state) => state.kanji !== "",
  },
});
