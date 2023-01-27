<template>
  <AppKanjiWriter ref="writerRef" />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreQuiz } from "@/stores/storeQuiz";
import AppKanjiWriter from "@/components/AppKanjiWriter.vue";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const writerRef = ref(null);

const startQuiz = (kanji) => {
  writerRef.value.startQuiz(kanji);
};

defineExpose({
  startQuiz,
});
</script>

<style scoped></style>
