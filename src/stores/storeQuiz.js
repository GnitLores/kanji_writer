import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStoreKanji } from "@/stores/storeKanji";

export const useStoreQuiz = defineStore("storeQuiz", {
  state: () => {
    return {
      title: "Kanji Writer",
      // kanji: "",
      quizType: "Quiz",
      mistakes: 0,
      currentStroke: 0,
      status: {},
      quizSize: 300, // pixels
      quizIsActive: false,
    };
  },
  actions: {
    initQuiz(kanji) {
      this.mistakes = 0;
      this.currentStroke = 0;
      this.quizIsActive = true;
      // this.status = {};
      // this.kanji = kanji;
    },
    completeQuiz() {
      const storeKanji = useStoreKanji();
      this.quizIsActive = false;
      this.currentStroke = storeKanji.nStrokes;
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
    addMistake() {
      this.mistakes += 1;
    },
    addStroke() {
      this.currentStroke += 1;
    },
  },
  getters: {
    strokesRemain: (state) => {
      const storeKanji = useStoreKanji();
      return !(state.currentStroke === storeKanji.nStrokes);
    },
  },
});
