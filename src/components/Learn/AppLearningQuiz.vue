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
import { useWriterSettings } from "@/use/useWriterSettings";

const storeOptions = useStoreOptions();

const { currentReview, startQuiz, failCurrentReview, passCurrentReview } =
  useLearningQuiz();

const currentKanji = reactive(useKanji());
provide("kanji", { kanji: currentKanji });

const loadKanji = async () => {
  await currentKanji.loadKanji(currentReview.value.char);
};

const writerSettings = reactive(useWriterSettings());
provide("writerSettings", writerSettings);

const displayReview = async () => {
  if (currentReview.value.stepType === "learn")
    writerSettings.initLearningQuizLearn();
  await loadKanji();
};

startQuiz();
displayReview();
</script>

<style scoped></style>
