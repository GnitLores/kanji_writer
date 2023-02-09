<template>
  <div class="p-2 inline-block select-none">
    <div>
      <h4
        class="font-medium leading-tight text-center text-2xl mt-0 mb-2 text-sky-200"
      >
        {{ storeQuiz.quizType }}
      </h4>
    </div>
    <AppWritingField ref="writerRef" />
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
        @click.prevent="writerRef.giveHint"
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
import AppWritingField from "@/components/AppWritingField.vue";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const { kanjiData } = storeToRefs(storeKanji);
const writerRef = ref(null);

const hintDelay = 500; // ms

const changeQuizType = () => {
  storeQuiz.changeQuizType();
  startQuiz();
};

const startQuiz = () => {
  storeQuiz.initQuiz();
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
    showHintAfterMisses: false,
  };
  const quizOptions = {};

  writerRef.value.startQuiz(writerProps, quizOptions);
};

const startLearningQuiz = () => {
  const writerProps = {
    showHintAfterMisses: 1,
    showOutline: true,
  };
  const quizOptions = {
    onCorrectStroke: (status) => {
      writerRef.value.markStrokeCorrect(status);
      setTimeout(writerRef.value.giveHint, hintDelay);
    },
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
  setTimeout(writerRef.value.giveHint, hintDelay);
};

const startReviewQuiz = () => {
  const writerProps = {
    showHintAfterMisses: 1,
  };
  const quizOptions = {
    onCorrectStroke: (status) => {
      writerRef.value.markStrokeCorrect(status);
      setTimeout(writerRef.value.giveHint, hintDelay);
    },
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
  setTimeout(writerRef.value.giveHint, hintDelay);
};

watch(kanjiData, (newVal, oldVal) => {
  startQuiz();
});

defineExpose({});
</script>

<style scoped></style>
