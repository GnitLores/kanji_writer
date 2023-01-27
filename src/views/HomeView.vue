<template>
  <div class="bg-gray-900">
    <div class="flex justify-evenly">
      <AppKanjiQuiz ref="quizRef" />
    </div>

    <AppKanjiGrid @kanji-clicked="startQuiz" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiQuiz from "@/components/AppKanjiQuiz.vue";
import AppKanjiGrid from "@/components/AppKanjiGrid.vue";

const quizRef = ref(null);

const startQuiz = (kanji) => {
  quizRef.value.prepareQuiz(kanji);
  quizRef.value.startQuiz();
};
</script>

<style scoped></style>
