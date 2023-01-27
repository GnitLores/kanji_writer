<template>
  <div class="bg-gray-900">
    <div id="writer-div" class="mx-auto p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="quizdim"
        :height="quizdim"
        id="character-target-svg"
      ></svg>
      <div id="character-target-div"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();

const KanjiWriter = useKanjiWriter();
let currentWriter = null;
const quizdim = ref(200);
const quizdimStyle = ref(quizdim.value + "px");

const startQuiz = (char) => {
  // const char = "斤";
  emptyQuiz();

  const writingData = storeKanji.loadKanji(char);

  currentWriter = KanjiWriter.create("character-target-svg", char, {
    charDataLoader: function (char, onComplete) {
      onComplete(writingData);
    },
    showCharacter: false,
    // showOutline: false,
    width: quizdim.value,
    height: quizdim.value,
    showHintAfterMisses: 1,
    padding: 0,
  });
  currentWriter.quiz();
};

const emptyQuiz = () => {
  const div = document.querySelector("#character-target-svg");
  if (div) {
    [].slice.call(div.children).forEach((child) => div.removeChild(child));
  }
  drawQuizLines();
};

const drawQuizLine = (x1 = 0, y1 = 0, x2 = 0, y2 = 0, dashed = false) => {
  const quizBackground = document.getElementById("character-target-svg");
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
  const dim = quizdim.value;
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
  drawQuizLines(quizdim.value);
});

defineExpose({
  startQuiz,
});
</script>

<style scoped>
#writer-div {
  max-width: v-bind(quizdimStyle);
}

#placeholder-div {
  min-height: v-bind(quizdimStyle);
}
</style>
