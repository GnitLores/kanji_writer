<template>
  <div class="bg-gray-900">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="quizdim"
        :height="quizdim"
        id="character-target-svg"
        class="absolute m-50"
      ></svg>
      <div id="placeholder-div" style="min-height: 144px"></div>
      <div id="character-target-div"></div>
    </div>

    <div class="text-sky-400 p-1">
      <div
        v-for="kanji in kanjiList.list"
        :key="kanji"
        class="inline-block p-0.5"
        @click.prevent="startQuiz(kanji)"
      >
        {{ kanji }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
const KanjiWriter = useKanjiWriter();
let currentWriter = null;
const quizdim = ref(144);

const kanjiList = reactive({
  list: [],
});

const loadKanji = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const startQuiz = (char) => {
  // const char = "斤";
  emptyQuiz();

  const userData = storeKanji.loadKanji(char);

  // currentWriter = KanjiWriter.create("character-target-div", char, {
  currentWriter = KanjiWriter.create("character-target-svg", char, {
    charDataLoader: function (char, onComplete) {
      onComplete(userData);
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
  // If this is the first time staring a quiz, delete the empty placeholder used to fill out the quiz space.
  // const placeHolder = document.getElementById("placeholder-div");
  // if (placeHolder) {
  //   placeHolder.remove();
  // }

  // If a previous quiz exists, clear it out.
  // const div = document.querySelector("#character-target-div");
  const div = document.querySelector("#character-target-svg");
  if (div) {
    [].slice.call(div.children).forEach((child) => div.removeChild(child));
  }
  drawPlaceHolderLines();
};

const drawPlaceHolderLine = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {
  const quizBackground = document.getElementById("character-target-svg");
  var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

  // newLine.setAttribute("id", "line");
  newLine.setAttribute("x1", x1);
  newLine.setAttribute("y1", y1);
  newLine.setAttribute("x2", x2);
  newLine.setAttribute("y2", y2);
  newLine.setAttribute("stroke", "#DDD");

  // $("svg").append(newLine);
  quizBackground.append(newLine);
};

const drawPlaceHolderLines = () => {
  const dim = quizdim.value;
  const halfDim = dim / 2;
  drawPlaceHolderLine(0, 0, dim, dim);
  drawPlaceHolderLine(dim, 0, 0, dim);
  drawPlaceHolderLine(halfDim, 0, halfDim, dim);
  drawPlaceHolderLine(0, halfDim, dim, halfDim);
};

onMounted(() => {
  loadKanji();
  drawPlaceHolderLines(quizdim.value);
});
</script>

<style scoped></style>
