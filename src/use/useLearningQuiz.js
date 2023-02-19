import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useStoreList } from "@/stores/storeList";
import { useSelection } from "@/use/useSelection";

const kanjiToQuiz = ref([]);
const batchReviewQueue = ref([]);
const activeReviewQueue = ref([]);
const currentReview = ref({ stepType: "none", repetition: 0, char: "" });
const nBatchReviews = ref(0);
const nCorrectBatchReviews = ref(0);
const nReviewsPrKanji = ref(0);
const nCorrectReviewsPrKanji = ref(new Map());

export function useLearningQuiz() {
  const storeOptions = useStoreOptions();
  const storeUser = useStoreUser();
  const storeList = useStoreList();
  const { selected } = useSelection();

  const startQuiz = () => {
    initQuiz();
    createReviewBatch();
  };

  const initQuiz = () => {
    kanjiToQuiz.value = [];
    batchReviewQueue.value = [];
    activeReviewQueue.value = [];
    storeList.kanjiByLevel.forEach((level) => {
      level.kanji.forEach((kanji) => {
        if (selected.value[kanji.mainIdx]) kanjiToQuiz.value.push(kanji.char);
      });
    });

    nReviewsPrKanji.value = 0;
    if (storeOptions.learnShowLearningStep)
      nReviewsPrKanji.value += storeOptions.learnLearningStepRepetitions;
    if (storeOptions.learnShowReinforceStep)
      nReviewsPrKanji.value += storeOptions.learnReinforcementStepRepetitions;
    if (storeOptions.learnShowQuizStep)
      nReviewsPrKanji.value += storeOptions.learnQuizStepRepetitions;
  };

  const createReviewBatch = () => {
    const batchSize = storeOptions.learnBatchSize || kanjiToQuiz.value.length;
    const kanjiBatch = [];
    let i = 0;
    while (i < batchSize && kanjiToQuiz.value.length > 0) {
      kanjiBatch.push(kanjiToQuiz.value.shift());
      i += 1;
    }

    if (storeOptions.learnShowLearningStep) {
      addStep(kanjiBatch, "learn");
    } else if (storeOptions.learnShowReinforceStep) {
      addStep(kanjiBatch, "reinforce");
    } else if (storeOptions.learnShowQuizStep) {
      addStep(kanjiBatch, "quiz");
    }

    nBatchReviews.value = nReviewsPrKanji.value * kanjiBatch.length;
    nCorrectReviewsPrKanji.value = new Map();
    nCorrectBatchReviews.value = 0;
    kanjiBatch.forEach((char) => nCorrectReviewsPrKanji.value.set(char, 0));
    popNextReview();
  };

  const addStep = (characters, stepType) => {
    characters.forEach((char) => {
      batchReviewQueue.value.push({
        char,
        stepType,
        repetition: 1,
      });
    });
  };

  const popNextReview = () => {
    if (activeReviewQueue.value.length > 0) {
      const firstReviewTime = activeReviewQueue.value[0].time;
      const millisPassed = Date.now() - firstReviewTime;
      const minsPassed = millisPassed / 1000 / 60;
      console.log("mins passed", minsPassed, storeOptions.learnReviewDelay);
      if (
        minsPassed >= storeOptions.learnReviewDelay ||
        batchReviewQueue.value.length === 0
      ) {
        currentReview.value = activeReviewQueue.value.shift();
        return;
      }
    }

    if (batchReviewQueue.value.length > 0) {
      currentReview.value = batchReviewQueue.value.shift();
      return;
    }

    if (kanjiToQuiz.value.length > 0) {
      createReviewBatch();
      return;
    }

    currentReview.value = { stepType: "none", repetition: 0, char: "" };
    return;
  };

  const failCurrentReview = () => {
    const char = currentReview.value.char;
    const stepType = currentReview.value.stepType;
    const repetition = currentReview.value.repetition;
    pushActiveReview(char, stepType, repetition);
  };

  const passCurrentReview = () => {
    if (currentReview.value.stepType === "learn") passLearnReview();
    if (currentReview.value.stepType === "reinforce") passReinforceReview();
    if (currentReview.value.stepType === "quiz") passQuizReview();

    const char = currentReview.value.char;
    const currentCorrect = nCorrectReviewsPrKanji.value.get(char);
    nCorrectReviewsPrKanji.value.set(char, currentCorrect + 1);
    nCorrectBatchReviews.value += 1;

    if (isFinalReviewForKanji.value) storeUser.setKanjiAsKnown(char);

    currentReview.value = null;
  };

  const passLearnReview = () => {
    const char = currentReview.value.char;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnLearningStepRepetitions) {
      pushActiveReview(char, "learn", repetition + 1);
      return;
    } else {
      if (storeOptions.learnShowReinforceStep) {
        pushActiveReview(char, "reinforce", 1);
        return;
      }
      if (storeOptions.learnShowQuizStep) {
        pushActiveReview(char, "quiz", 1);
        return;
      }
    }
  };

  const passReinforceReview = () => {
    const char = currentReview.value.char;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnReinforcementStepRepetitions) {
      pushActiveReview(char, "reinforce", repetition + 1);
      return;
    } else {
      if (storeOptions.learnShowQuizStep) {
        pushActiveReview(char, "quiz", 1);
        return;
      }
    }
  };

  const passQuizReview = () => {
    const char = currentReview.value.char;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnQuizStepRepetitions) {
      pushActiveReview(char, "quiz", repetition + 1);
      return;
    }
  };

  const pushActiveReview = (char, stepType, repetition) => {
    activeReviewQueue.value.push({
      char,
      stepType,
      repetition,
      time: Date.now(),
    });
  };

  const finalStep = computed(() => {
    if (storeOptions.learnShowQuizStep) return "quiz";
    if (storeOptions.learnShowReinforceStep) return "reinforce";
    return "learn";
  });

  const isFinalReviewForKanji = computed(() => {
    if (currentReview.value.stepType !== finalStep.value) return false;

    const rep = currentReview.value.repetition;
    switch (finalStep.value) {
      case "learn":
        return rep === storeOptions.learnLearningStepRepetitions;
      case "reinforce":
        return rep === storeOptions.learnReinforcementStepRepetitions;
      case "quiz":
        return rep === storeOptions.learnQuizStepRepetitions;
      default:
        return false;
    }
  });

  const isFinalReview = computed(() => {
    if (kanjiToQuiz.value.length > 0) return false;
    if (batchReviewQueue.value.length > 0) return false;
    if (activeReviewQueue.value.length > 0) return false;
    return isFinalReviewForKanji.value;
  });

  return {
    currentReview,
    nBatchReviews,
    nCorrectBatchReviews,
    nReviewsPrKanji,
    nCorrectReviewsPrKanji,
    isFinalReview,
    startQuiz,
    failCurrentReview,
    passCurrentReview,
    popNextReview,
  };
}
