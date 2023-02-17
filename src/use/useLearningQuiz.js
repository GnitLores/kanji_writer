import { ref } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import { useSelection } from "@/use/useSelection";

const kanjiToQuiz = ref([]);
const batchReviewQueue = ref([]);
const delayedReviews = ref([]);

export function useLearningQuiz() {
  const storeOptions = useStoreOptions();
  const storeList = useStoreList();
  const { selected, initSelected } = useSelection();

  const initQuiz = () => {
    kanjiToQuiz.value = [];
    batchReviewQueue.value = [];
    delayedReviews.value = [];
    storeList.kanjiByLevel.forEach((level) => {
      level.kanji.forEach((kanji) => {
        if (selected.value[kanji.mainIdx]) kanjiToQuiz.value.push(kanji.char);
      });
    });
    createReviewBatch();
  };

  const createReviewBatch = () => {
    const batchSize = storeOptions.learnBatchSize || kanjiToQuiz.value.length;
    const kanjiBatch = [];
    let i = 0;
    while (i < batchSize && kanjiToQuiz.value.length > 0) {
      kanjiBatch.push(kanjiToQuiz.value.shift());
      i += 1;
    }

    if (storeOptions.learnShowLearningStep) addStep(kanjiBatch, "learn");
    if (storeOptions.learnShowReinforceStep) addStep(kanjiBatch, "reinforce");
    if (storeOptions.learnShowQuizStep) addStep(kanjiBatch, "quiz");
  };

  const addStep = (characters, stepType) => {
    for (let i = 0; i < storeOptions.learnLearningStepRepetitions; i++) {
      characters.forEach((char) => {
        batchReviewQueue.value.push({
          char,
          stepType,
          repetition: i + 1,
        });
      });
    }
  };

  return { initQuiz };
}
