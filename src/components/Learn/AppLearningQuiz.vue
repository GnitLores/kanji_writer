<template>
  <div class="flex">
    <div class="flex-1"></div>
    <div class="w-[300px] flex justify-center"><AppWriting /></div>
    <div class="flex-1"></div>
  </div>
</template>

<script setup>
import { ref, reactive, provide, markRaw } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
// import AppLearningStepLearn from "@/components/Learn/AppLearningStepLearn.vue";
import AppWriting from "@/components/AppWriting.vue";
import { useLearningQuiz } from "@/use/useLearningQuiz";
import { useKanji } from "@/use/useKanji";

const storeOptions = useStoreOptions();

const { currentReview, startQuiz, failCurrentReview, passCurrentReview } =
  useLearningQuiz();

const currentKanji = reactive(useKanji());
provide("kanji", { kanji: currentKanji });

const loadKanji = async () => {
  await currentKanji.loadKanji(currentReview.value.char);
};

const writerSettings = reactive({
  canToggleHints: true,
  showHints: true,
  canToggleOutline: true,
  showOutline: true,
  canToggleStrokes: true,
  showStrokes: true,
  canToggleLines: true,
  showLines: true,
  canReset: true,
  canAnimate: true,
  canManualHint: true,
});
provide("writerSettings", { writerSettings: writerSettings });

const displayReview = async () => {
  if (currentReview.value.stepType === "learn") {
    writerSettings.canToggleHints = false;
    writerSettings.canToggleOutline = false;
    writerSettings.showHints = true;
    writerSettings.showOutline = true;
  }
  await loadKanji();
};

startQuiz();
displayReview();
</script>

<style scoped></style>
