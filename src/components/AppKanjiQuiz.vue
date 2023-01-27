<template>
  <div class="p-2 inline-block">
    <div>
      <h4
        class="font-medium leading-tight text-center text-2xl mt-0 mb-2 text-sky-400"
      >
        {{ storeQuiz.title }}
      </h4>
    </div>
    <AppKanjiWriter ref="writerRef" />
    <div class="flex justify-evenly mt-2">
      <button
        class="bg-transparent hover:bg-blue-500 text-sky-400 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-14 disabled:opacity-50"
        :disabled="!storeQuiz.quizIsActive"
      >
        Type
      </button>
      <button
        class="bg-transparent hover:bg-blue-500 text-sky-400 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-14 disabled:opacity-50"
        :disabled="!storeQuiz.quizIsActive || !storeQuiz.strokesRemain"
        @click.prevent="giveHint"
      >
        Hint
      </button>
      <button
        class="bg-transparent hover:bg-blue-500 text-sky-400 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-14 disabled:opacity-50"
        :disabled="!storeQuiz.quizIsActive"
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

const onMistake = (status) => {
  storeQuiz.addMistake(status);
};

const giveHint = () => {
  writerRef.value.giveHint();
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
