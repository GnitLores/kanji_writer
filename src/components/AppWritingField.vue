<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="quizSize"
    :height="quizSize"
    ref="quizFieldRef"
  ></svg>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from "vue";

import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();

const KanjiWriter = useKanjiWriter();
let writer = null;
const quizFieldRef = ref(null);

const quizSize = storeOptions.writerSize;

let customWriterProps = {};
let customQuizOptions = {};

let centerLines = [];

const { kanji } = inject("kanji");
const writerSettings = inject("writerSettings");

const highlightStroke = (currentStroke) => {
  writer.highlightStroke(currentStroke);
};

const createWriter = (writerProps = {}) => {
  const defaultProperties = {
    width: quizSize,
    height: quizSize,
    padding: 0,
    leniency: 1.5,
    showCharacter: false,
    showOutline: false,
    showHintAfterMisses: 3,
    strokeHighlightSpeed: 1,
    strokeColor: "#FFFFFF",
    highlightColor: "#38BDF8",
    outlineColor: "#374151",
    drawingColor: "#38BDF8",
    highlightOnComplete: true,
    highlightCompleteColor: "#FB923C",
    charDataLoader: (char, onComplete) => {
      onComplete(kanji.writingData);
    },
  };

  customWriterProps = writerProps;

  writer = KanjiWriter.create(quizFieldRef.value, kanji.char, {
    ...defaultProperties,
    ...customWriterProps,
  });
};

const activateWriterQuiz = (quizOptions = {}) => {
  const defaultOptions = {};
  customQuizOptions = quizOptions;
  writer.quiz({
    ...defaultOptions,
    ...customQuizOptions,
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

const completeQuiz = () => {
  cancelQuiz();
  initQuizField();
  createWriter(customQuizOptions);
  writer.showCharacter();
};

const animate = (onCompleteFunction = () => {}) => {
  cancelQuiz();
  const animationProps = {
    strokeAnimationSpeed: 2, // 5x normal speed
    delayBetweenStrokes: 200, // milliseconds
  };

  // This part makes sure the animation can execute with the outline shown or hidden and with the partially or completely written character instantly hidden before animating:
  writer.hideCharacter({ duration: 0 });
  if (writerSettings.showOutline) writer.hideOutline({ duration: 0 });
  createWriter(animationProps);
  if (writerSettings.showOutline) writer.showOutline({ duration: 0 });

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
  return newLine;
};

const drawQuizLines = () => {
  const dim = quizSize;
  const halfDim = dim / 2;
  drawCenterLines();
  drawQuizLine(0, 0, 0, dim);
  drawQuizLine(0, 0, dim, 0);
  drawQuizLine(dim, 0, dim, dim);
  drawQuizLine(0, dim, dim, dim);
};

const drawCenterLines = () => {
  const dim = quizSize;
  const halfDim = dim / 2;
  // drawPlaceHolderLine(0, 0, dim, dim, true);
  // drawPlaceHolderLine(dim, 0, 0, dim, true);
  centerLines = [];
  const line1 = drawQuizLine(halfDim, 0, halfDim, dim, true);
  const line2 = drawQuizLine(0, halfDim, dim, halfDim, true);
  centerLines.push(line1);
  centerLines.push(line2);
  toggleCenterLines();
};

const toggleCenterLines = () => {
  centerLines.forEach((line) => {
    line.style.display = writerSettings.showLines ? "" : "none";
  });
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
  completeQuiz,
  setNewChar,
  highlightStroke,
  animate,
  toggleOutline,
  toggleCenterLines,
});
</script>

<style scoped></style>
