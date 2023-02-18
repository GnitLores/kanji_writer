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
  // console.log(currentReview, currentReview.value);

  await currentKanji.loadKanji(currentReview.value.char);
};

startQuiz();
loadKanji();
</script>

<style scoped></style>
