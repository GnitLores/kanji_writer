<template>
  <transition name="slide">
    <div v-show="storeOptions.showDetailsStrokeOrder" class="">
      <div class="flex">
        <div class="flex flex-wrap" ref="strokeOrderRef"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { storeToRefs } from "pinia";
import { useStoreQuiz } from "@/stores/storeQuiz";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreOptions } from "@/stores/storeOptions";
import { useKanjiWriter } from "@/use/useKanjiWriter";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const storeOptions = useStoreOptions();
const { kanjiData } = storeToRefs(storeKanji);

const strokeOrderRef = ref(null);

const totalWidth = 300; // pixels
const margin = 2; // pixels
const borderWidth = 1; // pixels
const perRowBig = 5; // boxes
const perRowMed = 6; // boxes
const perRowSmall = 7; // boxes
const perRowExtraSmall = 8; // boxes
const bigUpTo = 10; // boxes
const medUpTo = 18; // boxes
const smallUpTo = 21; // boxes
let doSeparate = true;

const emit = defineEmits(["strokeOrderClicked"]);

const drawStrokeOrder = () => {
  const storeKanji = useStoreKanji();
  const strokes = storeKanji.writingData.strokes;
  const target = strokeOrderRef.value;
  for (var i = 0; i < storeKanji.nStrokes; i++) {
    var strokesPortion = strokes.slice(0, i + 1);
    renderFanningStrokes(target, strokesPortion, storeKanji.nStrokes, i + 1);
  }
};

const renderFanningStrokes = (target, strokes, nStrokes, strokeNr) => {
  const boxSize = calcBoxSize(nStrokes);
  const svg = createStrokeSvg(strokes, boxSize);

  svg.addEventListener("click", () => {
    emit("strokeOrderClicked", strokeNr, nStrokes);
  });

  target.appendChild(svg);
};

const calcBoxSize = (nStrokes) => {
  // The more strokes in the kanji, the more strokes per row which results in smaller boxes.
  const nBoxesPerRow =
    nStrokes <= bigUpTo
      ? perRowBig
      : nStrokes <= medUpTo
      ? perRowMed
      : nStrokes <= smallUpTo
      ? perRowSmall
      : perRowExtraSmall;

  const totalMarginWidth = doSeparate ? nBoxesPerRow * margin * 2 : 0;
  const totalBorderWidth = 2 * borderWidth * nBoxesPerRow;
  const spaceForBoxes = totalWidth - totalMarginWidth - totalBorderWidth;

  const boxSize = Math.floor(spaceForBoxes / nBoxesPerRow);

  // console.log("NEW CALC");
  // console.log("totalMarginWidth", totalMarginWidth);
  // console.log("totalBorderWidth", totalBorderWidth);
  // console.log("spaceForBoxes", spaceForBoxes);
  // console.log("boxSize", boxSize);
  // const effectiveWidth =
  //   nBoxesPerRow * boxSize + nBoxesPerRow * 2 * (borderWidth + margin);
  // console.log("effectiveWidth", effectiveWidth);

  return boxSize;
};

const createStrokeSvg = (strokes, boxSize) => {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.width = boxSize + "px";
  svg.style.height = boxSize + "px";
  svg.classList =
    "inline-block border-gray-600 bg-darkmode-700 hover:cursor-pointer hover:border-white";
  if (doSeparate) svg.classList += ` m-[${margin}px] rounded`;
  svg.classList += borderWidth === 1 ? " border" : ` border-${borderWidth}`;

  svg.appendChild(renderStrokes(strokes, boxSize));

  return svg;
};

const renderStrokes = (strokes, boxSize) => {
  // set the transform property on the g element so the character renders at the boxSize
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const KanjiWriter = useKanjiWriter();
  var transformData = KanjiWriter.getScalingTransform(boxSize, boxSize);
  group.setAttributeNS(null, "transform", transformData.transform);

  strokes.forEach(function (strokePath) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "d", strokePath);
    path.style.fill = "white";
    path.style.fillOpacity = "80%";
    group.appendChild(path);
  });
  return group;
};

const initVisualization = () => {
  if (strokeOrderRef.value) {
    [].slice
      .call(strokeOrderRef.value.children)
      .forEach((child) => strokeOrderRef.value.removeChild(child));
  }
};

watch(kanjiData, () => {
  if (storeKanji.char === "") return;
  initVisualization();
  drawStrokeOrder();
});

onMounted(() => {
  if (storeKanji.char === "") return;
  drawStrokeOrder();
});
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.3s;
}
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from, .slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-1rem);
  opacity: 0;
}
</style>
