<template>
  <div class="container mx-auto">
    <AppLearnControls @startLearning="startLearningQuiz" />
    <AppKanjiGrid />
  </div>
</template>

<script setup>
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import AppLearnControls from "@/components/Learn/AppLearnControls.vue";

const emit = defineEmits(["startLearning"]);
const startLearningQuiz = () => {
  emit("startLearning");
};
</script>

<style scoped></style>
