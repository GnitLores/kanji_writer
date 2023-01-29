<template>
  <div class="p-2 inline-block">
    <div>
      <h4
        class="font-medium leading-tight text-center text-2xl mt-0 mb-2 text-sky-400"
      >
        {{ storeQuiz.quizType }}
      </h4>
    </div>
    <AppKanjiWriter ref="writerRef" />
    <div class="flex justify-evenly mt-2">
      <button
        class="bg-transparent hover:bg-blue-500 text-sky-400 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-14 disabled:opacity-50"
        :disabled="!storeQuiz.quizIsActive"
        @click.prevent="changeQuizType"
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
        @click.prevent="startQuiz"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreQuiz } from "@/stores/storeQuiz";
import AppKanjiWriter from "@/components/AppKanjiWriter.vue";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const { kanjiData } = storeToRefs(storeKanji);
const writerRef = ref(null);

const changeQuizType = () => {
  storeQuiz.changeQuizType();
  startQuiz();
};

const giveHint = () => {
  writerRef.value.giveHint();
};

const onMistake = (status) => {
  storeQuiz.addMistake(status);
};

const startQuiz = () => {
  storeQuiz.initQuiz(storeKanji.kanji);
  switch (storeQuiz.quizType) {
    case "Quiz":
      startNormalQuiz();
      break;
    case "Learn":
      startLearningQuiz();
      break;
    case "Review":
      startReviewQuiz();
      break;
  }
};

const startNormalQuiz = () => {
  const writerProps = {
    showCharacter: false,
    showOutline: false,
    showHintAfterMisses: 3,
  };

  const quizOptions = {
    onMistake: onMistake,
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
};

const startLearningQuiz = () => {
  const writerProps = {
    showCharacter: false,
    showOutline: true,
    showHintAfterMisses: 3,
  };

  const quizOptions = {
    onMistake: onMistake,
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
};

const startReviewQuiz = () => {
  const writerProps = {
    showCharacter: false,
    showOutline: false,
    showHintAfterMisses: 1,
  };

  const quizOptions = {
    onMistake: onMistake,
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
};

watch(kanjiData, (newVal, oldVal) => {
  startQuiz();
});

defineExpose({});
</script>

<style scoped></style>
