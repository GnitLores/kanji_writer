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

const overrides = ref({});
provide("overrides", overrides);

const displayReview = async () => {
  overrides.value = {
    doOverrideOutline: false,
    doOverrideHints: false,
    doOverrideStrokes: false,
  };
  if (currentReview.value.stepType === "learn") {
    overrides.value.doOverrideOutline = true;
    overrides.value.doOverrideHints = true;
    overrides.value.showOutline = false;
    overrides.value.showHints = false;
  }
  await loadKanji();
};

startQuiz();
displayReview();
</script>

<style scoped></style>
