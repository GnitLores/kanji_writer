<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="storeQuiz.quizSize"
    :height="storeQuiz.quizSize"
    ref="quizFieldRef"
  ></svg>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreQuiz } from "@/stores/storeQuiz";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const KanjiWriter = useKanjiWriter();
let writer = null;
const quizFieldRef = ref(null);

const giveHint = () => {
  console.log(storeQuiz.currentStroke);
  if (storeQuiz.strokesRemain) writer.highlightStroke(storeQuiz.currentStroke);
};

const startQuiz = (properties = {}, options = {}) => {
  emptyQuiz();

  writer = KanjiWriter.create(quizFieldRef.value, storeQuiz.kanji, {
    charDataLoader: function (char, onComplete) {
      onComplete(storeKanji.writingData);
    },
    width: storeQuiz.quizSize,
    height: storeQuiz.quizSize,
    padding: 0,
    leniency: 1.5,
    ...properties,
  });
  writer.quiz({
    onCorrectStroke: (status) => {
      storeQuiz.addStroke(status);
    },
    ...options,
  });
};

const emptyQuiz = () => {
  if (quizFieldRef.value) {
    [].slice
      .call(quizFieldRef.value.children)
      .forEach((child) => quizFieldRef.value.removeChild(child));
  }
  drawQuizLines();
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
  drawQuizLines(storeQuiz.quizSize);
});

defineExpose({
  startQuiz,
  giveHint,
});
</script>

<style scoped></style>
