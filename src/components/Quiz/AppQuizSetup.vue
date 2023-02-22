<template>
  <div class="container mx-auto">
    <AppQuizControls @startQuiz="startQuiz" />
    <AppKanjiGrid />
  </div>
</template>

<script setup>
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import AppQuizControls from "@/components/Quiz/AppQuizControls.vue";

const emit = defineEmits(["startQuiz"]);
const startQuiz = () => {
  emit("startQuiz");
};
</script>

<style scoped></style>
