<template>
  <div class="flex">
    <div class="flex-1"></div>
    <div class="w-[300px] flex justify-center"><AppWritingField /></div>
    <div class="flex-1"></div>
  </div>
</template>

<script setup>
import { ref, provide, markRaw } from "vue";
import AppLearningStepLearn from "@/components/Learn/AppLearningStepLearn.vue";
import AppWritingField from "@/components/AppWritingField.vue";
import { useLearningQuiz } from "@/use/useLearningQuiz";

const { initQuiz } = useLearningQuiz();

initQuiz();
</script>

<style scoped></style>
