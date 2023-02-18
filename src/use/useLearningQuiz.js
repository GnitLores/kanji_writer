import { ref } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import { useSelection } from "@/use/useSelection";

const kanjiToQuiz = ref([]);
const batchReviewQueue = ref([]);
const activeReviewQueue = ref([]);
const currentReview = ref(null);

export function useLearningQuiz() {
  const storeOptions = useStoreOptions();
  const storeList = useStoreList();
  const { selected } = useSelection();

  const startQuiz = () => {
    initQuiz();
    createReviewBatch();
    popNextReview();
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
      const minsPassed = millisPassed * 1000 * 60;
      if (minsPassed >= storeOptions.learnReviewDelay) {
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
      popNextReview();
    }

    currentReview.value = null;
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
    if (currentReview.value.stepType === "quic") passQuizReview();

    currentReview.value = null;
  };

  const passLearnReview = () => {
    const char = currentReview.value.char;
    const stepType = currentReview.value.stepType;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnLearningStepRepetitions) {
      pushActiveReview(char, stepType, repetition + 1);
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
    const stepType = currentReview.value.stepType;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnReinforcementStepRepetitions) {
      pushActiveReview(char, stepType, repetition + 1);
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
    const stepType = currentReview.value.stepType;
    const repetition = currentReview.value.repetition;

    if (repetition < storeOptions.learnQuizStepRepetitions) {
      pushActiveReview(char, stepType, repetition + 1);
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

  return { currentReview, startQuiz, failCurrentReview, passCurrentReview };
}
