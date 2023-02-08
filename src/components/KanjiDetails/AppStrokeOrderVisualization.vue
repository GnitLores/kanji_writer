<template>
  <transition name="slide">
    <div v-show="storeOptions.showDetailsStrokeOrder">
      <div class="flex">
        <div class="flex flex-wrap p-2" ref="strokeOrderRef"></div>
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
import { useStoreQuiz } from "@/stores/storeQuiz";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreOptions } from "@/stores/storeOptions";

import { useKanjiWriter } from "@/use/useKanjiWriter";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const storeOptions = useStoreOptions();

const KanjiWriter = useKanjiWriter();
const strokeOrderRef = ref(null);

const renderFanningStrokes = (target, strokes, nStrokes, strokeNr) => {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const boxSize = nStrokes <= 10 ? 80 : nStrokes <= 20 ? 70 : 60;
  svg.style.width = boxSize + "px";
  svg.style.height = boxSize + "px";
  svg.classList = "inline-block border border-gray-600 m-0.5";
  target.appendChild(svg);
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // set the transform property on the g element so the character renders at the boxSize
  var transformData = KanjiWriter.getScalingTransform(boxSize, boxSize);
  group.setAttributeNS(null, "transform", transformData.transform);
  svg.appendChild(group);

  strokes.forEach(function (strokePath) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "d", strokePath);
    path.style.fill = "white";
    path.style.fillOpacity = "80%";
    group.appendChild(path);
  });
};

const drawStrokeOrder = () => {
  KanjiWriter.loadCharacterData(storeKanji.char).then(function (charData) {
    var target = strokeOrderRef.value;
    const nStrokes = charData.strokes.length;
    for (var i = 0; i < nStrokes; i++) {
      var strokesPortion = charData.strokes.slice(0, i + 1);
      renderFanningStrokes(target, strokesPortion, nStrokes, i + 1);
    }
  });
};

onMounted(() => {
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
