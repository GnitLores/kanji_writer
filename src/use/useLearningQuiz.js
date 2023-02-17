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
  };

  const createReviewBatch = () => {};

  return { initQuiz };
}
