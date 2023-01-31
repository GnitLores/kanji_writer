<template>
  <div>
    <div class="flex justify-evenly">
      <AppKanjiQuiz ref="quizRef" />
    </div>

    <AppKanjiGrid @singleKanjiSelected="onKanjiSelected" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiQuiz from "@/components/AppKanjiQuiz.vue";
import AppKanjiGrid from "@/components/AppKanjiGrid.vue";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();

const onKanjiSelected = (kanji) => {
  storeKanji.loadKanji(kanji);
};
</script>

<style scoped></style>
