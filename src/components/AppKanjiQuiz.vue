<template>
  <!-- <div id="writer-div" class="mx-auto p-2"> -->
  <div class="p-2 inline-block">
    <AppKanjiWriter ref="writerRef" />
    <div class="m-1">
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-2 w-20"
      >
        Hint
      </button>
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-2 w-20"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreQuiz } from "@/stores/storeQuiz";
import AppKanjiWriter from "@/components/AppKanjiWriter.vue";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const writerRef = ref(null);

const quizdimPx = ref(storeQuiz.quizSize + "px");

const onMistake = () => {
  storeQuiz.addMistake();
};

const startQuiz = (kanji) => {
  // console.log(quizdimPx);
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

<style scoped>
/* #writer-div {
  max-width: v-bind(quizdimPx);
} */
</style>
