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

const markStrokeMistake = (status) => {
  storeQuiz.addMistake(status);
};

const markStrokeCorrect = (status) => {
  storeQuiz.addStroke(status);
};

const createWriter = (writerProps = {}) => {
  const defaultProperties = {
    width: storeQuiz.quizSize,
    height: storeQuiz.quizSize,
    padding: 0,
    leniency: 1.5,
    showCharacter: false,
    showOutline: false,
    showHintAfterMisses: 3,
    strokeHighlightSpeed: 1,
    // strokeColor: "#38BDF8",
    strokeColor: "#FFFFFF",
    highlightColor: "#FFFFFF",
    outlineColor: "#6B7280",
    drawingColor: "#38BDF8",
    highlightOnComplete: true,
    highlightCompleteColor: "#FB923C",
  };

  writer = KanjiWriter.create(quizFieldRef.value, storeQuiz.kanji, {
    ...defaultProperties,
    ...writerProps,
  });
};

const activateWriterQuiz = (quizOptions = {}) => {
  const defaultOptions = {
    onCorrectStroke: markStrokeCorrect,
    onMistake: markStrokeMistake,
  };

  writer.quiz({
    ...defaultOptions,
    ...quizOptions,
  });
};

const cancelQuiz = () => {
  if (!writer) return;

  writer.pauseAnimation(); // important to prevent canceled animations from firing onCompleted functions
  writer.cancelQuiz();
  writer.target.removeEventListeners();
};

const startQuiz = (writerProps = {}, quizOptions = {}) => {
  cancelQuiz();
  initQuizField();
  createWriter(writerProps);
  activateWriterQuiz(quizOptions);
};

const animate = (onCompleteFunction = () => {}) => {
  const writerProps = {
    strokeAnimationSpeed: 2, // 5x normal speed
    delayBetweenStrokes: 200, // milliseconds
  };
  startQuiz(writerProps, {});
  writer.animateCharacter({
    onComplete: function () {
      setTimeout(onCompleteFunction, 500);
    },
  });
};

const toggleOutline = (toggle) => {
  toggle ? writer.showOutline() : writer.hideOutline();
};

const initQuizField = () => {
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

const setNewChar = (char) => {
  writer.setCharacter(char);
};

onMounted(() => {
  initQuizField();
});

defineExpose({
  startQuiz,
  cancelQuiz,
  setNewChar,
  giveHint,
  animate,
  markStrokeMistake,
  markStrokeCorrect,
  toggleOutline,
});
</script>

<style scoped></style>
