<template>
  <AppKanjiGridHeader />
  <div class="select-none">
    <div v-for="levelList in storeList.displayList" :key="levelList.name">
      <h3 class="text-sky-200 text-center mb-1 mt-2 font-bold tracking-wide">
        {{ levelList.name }}:
      </h3>
      <div
        v-for="kanji in levelList.kanji"
        :key="kanji.kanji"
        class="kanji-character inline-block cursor-pointer hover:text-green-400 text-sky-400 border-transparent border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
        :class="[kanji.selected ? 'text-orange-400' : '']"
        @click.prevent="kanjiClickHandler(kanji.kanji)"
        @mousedown.prevent="onMouseDown"
        @mouseenter.prevent="onMouseEnter"
      >
        {{ kanji.kanji }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
} from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import AppKanjiGridHeader from "@/components/kanjiGridComponents/AppKanjiGridHeader.vue";

const storeList = useStoreList();
const storeOptions = useStoreOptions();

let isDragging = false;
let isRemoving = false;
let startDragIdx = -1;
let minDragIdx = -1;
let maxDragIdx = -1;

const getMouseIndex = (event) => {
  const kanji = event.target.__vnode.key;
  return storeList.indexMap.get(kanji);
};
const addrangeToSelection = (min, max) => {
  const toggleVal = isRemoving ? false : true;
  for (let i = min; i < max; i++) {
    const level = storeList.kanjiList[i].level;
    const idxInLevel = storeList.kanjiList[i].idxInLevel;
    storeList.displayList[level].kanji[idxInLevel].selected = toggleVal;
  }
};
const removerangeFromSelection = (min, max) => {
  const toggleVal = isRemoving ? true : false;
  for (let i = min; i < max; i++) {
    const level = storeList.kanjiList[i].level;
    const idxInLevel = storeList.kanjiList[i].idxInLevel;
    storeList.displayList[level].kanji[idxInLevel].selected = toggleVal;
  }
};
const onMouseDown = (event) => {
  isDragging = true;
  if (event.target.classList.contains("text-orange-400")) isRemoving = true;
  startDragIdx = getMouseIndex(event);
  minDragIdx = startDragIdx;
  maxDragIdx = startDragIdx;
};
const onMouseEnter = (event) => {
  if (!isDragging) return;
  const stopDragIdx = getMouseIndex(event);
  const newMinDragIdx = Math.min(startDragIdx, stopDragIdx);
  const newMaxDragIdx = Math.max(startDragIdx, stopDragIdx);
  if (newMinDragIdx < minDragIdx)
    addrangeToSelection(newMinDragIdx, minDragIdx + 1);
  if (newMinDragIdx > minDragIdx)
    removerangeFromSelection(minDragIdx, newMinDragIdx);
  if (newMaxDragIdx > maxDragIdx)
    addrangeToSelection(maxDragIdx, newMaxDragIdx + 1);
  if (newMaxDragIdx < maxDragIdx)
    removerangeFromSelection(newMaxDragIdx, maxDragIdx);

  minDragIdx = newMinDragIdx;
  maxDragIdx = newMaxDragIdx;
};
const onMouseUp = (event) => {
  if (!isDragging || !event.target.classList.contains("kanji-character")) {
    isDragging = false;
    isRemoving = false;
    startDragIdx = -1;
    minDragIdx = -1;
    maxDragIdx = -1;
    return;
  }
  isDragging = false;
  isRemoving = false;
  startDragIdx = -1;
  minDragIdx = -1;
  maxDragIdx = -1;
};
document.addEventListener("mouseup", onMouseUp);

const emit = defineEmits(["singleKanjiSelected"]);

const kanjiClickHandler = (kanji) => {
  emit("singleKanjiSelected", kanji);
};

onMounted(() => {
  // console.log("on mounted");
});
onBeforeUnmount(() => {
  // console.log("before unmount");
  document.removeEventListener("mouseup", onMouseUp);
});
onUnmounted(() => {
  // console.log("on unmounted");
});
</script>

<style scoped></style>
