<template>
  <div>
    <div class="flex justify-evenly">
      <AppKanjiQuiz ref="quizRef" />
    </div>

    <AppKanjiGrid />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiQuiz from "@/components/AppKanjiQuiz.vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
</script>

<style scoped></style>
