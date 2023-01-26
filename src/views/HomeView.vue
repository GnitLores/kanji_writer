<template>
  <AppKanjiQuiz ref="quizRef" />
  <AppKanjiGrid @kanji-clicked="startQuiz" />
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
