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

const onMistake = () => {
  storeQuiz.addMistake();
};

const startQuiz = (kanji) => {
  const properties = {
    showCharacter: false,
    showOutline: false,
    showHintAfterMisses: 3,
  };

  const options = {
    onMistake: onMistake,
  };

  writerRef.value.startQuiz(kanji, properties, options);
};

defineExpose({
  startQuiz,
});
</script>

<style scoped></style>
