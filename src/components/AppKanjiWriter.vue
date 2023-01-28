<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="storeQuiz.quizSize"
    :height="storeQuiz.quizSize"
    ref="quizFieldRef"
  ></svg>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";

import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreQuiz } from "@/stores/storeQuiz";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();

const KanjiWriter = useKanjiWriter();
let writer = null;
const quizFieldRef = ref(null);

const giveHint = () => {
  if (storeQuiz.strokesRemain) writer.highlightStroke(storeQuiz.currentStroke);
};

const createWriter = (writerProps = {}) => {
  const universalProperties = {
    charDataLoader: function (char, onComplete) {
      onComplete(storeKanji.writingData);
    },
    width: storeQuiz.quizSize,
    height: storeQuiz.quizSize,
    padding: 0,
    leniency: 1.5,
  };

  writer = KanjiWriter.create(quizFieldRef.value, storeQuiz.kanji, {
    ...universalProperties,
    ...writerProps,
  });
};

const activateWriterQuiz = (quizOptions = {}) => {
  const universalOptions = {
    onCorrectStroke: (status) => {
      storeQuiz.addStroke(status);
    },
  };

  writer.quiz({
    ...universalOptions,
    ...quizOptions,
  });
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

  if (writer) writer.cancelQuiz();
  initQuizField();
  createWriter(writerProps);
  activateWriterQuiz(quizOptions);
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

  if (writer) writer.cancelQuiz();
  initQuizField();
  createWriter(writerProps);
  activateWriterQuiz(quizOptions);
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

  if (writer) writer.cancelQuiz();
  initQuizField();
  createWriter(writerProps);
  activateWriterQuiz(quizOptions);
};

const initQuizField = () => {
  if (quizFieldRef.value) {
    [].slice
      .call(quizFieldRef.value.children)
      .forEach((child) => quizFieldRef.value.removeChild(child));
  }
  drawQuizLines();
};

const onMistake = (status) => {
  console.log(status);
  storeQuiz.addMistake(status);
};

const drawQuizLine = (x1 = 0, y1 = 0, x2 = 0, y2 = 0, dashed = false) => {
  const quizBackground = quizFieldRef.value;
  var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

  newLine.setAttribute("x1", x1);
  newLine.setAttribute("y1", y1);
  newLine.setAttribute("x2", x2);
  newLine.setAttribute("y2", y2);
  newLine.setAttribute("stroke", "#DDD");
  if (dashed) {
    newLine.setAttribute("stroke-dasharray", "5,5");
  }
  quizBackground.append(newLine);
};

const drawQuizLines = () => {
  const dim = storeQuiz.quizSize;
  const halfDim = dim / 2;
  // drawPlaceHolderLine(0, 0, dim, dim, true);
  // drawPlaceHolderLine(dim, 0, 0, dim, true);
  drawQuizLine(halfDim, 0, halfDim, dim, true);
  drawQuizLine(0, halfDim, dim, halfDim, true);
  drawQuizLine(0, 0, 0, dim);
  drawQuizLine(0, 0, dim, 0);
  drawQuizLine(dim, 0, dim, dim);
  drawQuizLine(0, dim, dim, dim);
};

onMounted(() => {
  initQuizField();
});

defineExpose({
  startNormalQuiz,
  startLearningQuiz,
  startReviewQuiz,
  giveHint,
});
</script>

<style scoped></style>
