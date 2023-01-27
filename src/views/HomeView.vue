<template>
  <div class="bg-gray-900">
    <div>
      <AppKanjiQuiz ref="quizRef" />
      <AppKanjiQuiz ref="quizRef2" />
      <AppKanjiQuiz ref="quizRef3" />
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
  quizRef.value.startQuiz(kanji);
};
</script>

<style scoped></style>
