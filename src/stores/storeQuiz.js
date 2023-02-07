import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStoreQuiz = defineStore("storeQuiz", {
  state: () => {
    return {
      title: "Kanji Writer",
      kanji: "",
      quizType: "Quiz",
      mistakes: 0,
      currentStroke: 0,
      status: {},
      quizSize: 300, // pixels
    };
  },
  actions: {
    initQuiz(kanji) {
      this.mistakes = 0;
      this.currentStroke = 0;
      this.status = {};
      this.kanji = kanji;
    },
    changeQuizType() {
      switch (this.quizType) {
        case "Quiz":
          this.quizType = "Learn";
          break;
        case "Learn":
          this.quizType = "Review";
          break;
        case "Review":
          this.quizType = "Quiz";
          break;
        case "Details":
          this.quizType = "Writing";
          break;
      }
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
