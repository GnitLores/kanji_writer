<template>
  <div>
    <AppLearningStepLearn />
  </div>
</template>

<script setup>
import { ref, provide, markRaw } from "vue";
import AppLearningStepLearn from "@/components/Learn/AppLearningStepLearn.vue";
import { useLearningQuiz } from "@/use/useLearningQuiz";

const { initQuiz } = useLearningQuiz();

initQuiz();
</script>

<style scoped></style>
