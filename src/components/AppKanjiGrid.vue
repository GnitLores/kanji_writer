<template>
  <AppKanjiGridHeader />
  <div class="select-none">
    <div
      v-for="levelList in storeList.displayList"
      v-show="levelList.doDisplay"
      :key="levelList.name"
    >
      <div class="flex justify-evenly">
        <h3
          @click.prevent="storeList.toggleLevelSelection(levelList.kanji)"
          class="inline-block text-sky-200 cursor-pointer hover:text-green-400 text-center mb-1 mt-2 font-bold tracking-wide"
        >
          {{ levelList.name }}:
        </h3>
      </div>
      <div
        v-for="kanji in levelList.kanji"
        :key="kanji.kanji"
        class="kanji-character inline-block cursor-pointer hover:text-green-400 text-sky-400 border-transparent border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
        :class="[
          (kanji.selected && !kanji.unselectedWhileDragging) ||
          (!kanji.selected && kanji.selectedWhileDragging)
            ? 'text-orange-400'
            : '',
        ]"
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
import { connectStorageEmulator } from "@firebase/storage";

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
  minDragIdx = Math.min(startDragIdx, stopDragIdx);
  maxDragIdx = Math.max(startDragIdx, stopDragIdx);
  storeList.updateDraggingSelection(minDragIdx, maxDragIdx, isRemoving);
};
const onMouseUp = (event) => {
  isDragging = false;
  isRemoving = false;
  startDragIdx = -1;
  minDragIdx = -1;
  maxDragIdx = -1;

  storeList.applyDraggingSelection();
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
