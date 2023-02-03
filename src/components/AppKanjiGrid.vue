<template>
  <VueSimpleContextMenu
    element-id="level-title-context"
    :options="levelTitleContextOptions"
    ref="levelTitleContextRef"
    @option-clicked="levelTitleContextOptionClicked"
  />
  <VueSimpleContextMenu
    element-id="kanji-context"
    :options="kanjiContextOptions"
    ref="kanjiContextRef"
    @option-clicked="kanjiContextOptionClicked"
  />

  <AppKanjiGridHeader />

  <div v-if="!storeOptions.allLevelsIgnored()" class="select-none">
    <div v-for="level in displayData" :key="level.name">
      <div class="flex justify-evenly">
        <h3
          @click.prevent="toggleLevelSelection(level.kanji)"
          @contextmenu.prevent.stop="
            onLevelTitleContext($event, level.levelIdx)
          "
          class="inline-block text-sky-200 cursor-pointer hover:text-green-400 text-center mb-1 mt-2 font-bold tracking-wide"
        >
          {{ level.name }}:
        </h3>
      </div>
      <div
        v-for="kanji in level.kanji"
        :key="kanji.char"
        class="kanji-character inline-block cursor-pointer hover:text-green-400 text-sky-400 border-transparent border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
        :class="[
          (kanji.selected && !kanji.unselectedWhileDragging) ||
          (!kanji.selected && kanji.selectedWhileDragging)
            ? 'drag-selected text-orange-400'
            : '',
        ]"
        @click.prevent="onKanjiClicked"
        @mousedown.prevent="onKanjiMouseDown"
        @mouseenter.prevent="onKanjiMouseEnter"
        @contextmenu.prevent.stop="onKanjiContext($event, kanji.char)"
      >
        {{ kanji.char }}
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
  watch,
} from "vue";
import { storeToRefs } from "pinia";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import AppKanjiGridHeader from "@/components/kanjiGridComponents/AppKanjiGridHeader.vue";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";
import { useDisplayData } from "@/use/useDisplayData";
import { useContextMenu } from "@/use/useContextMenu";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

const {
  displayData,
  updateDisplayData,
  getDisplayedKanjiByChar,
  getDisplayedKanjiByCount,
  updateDraggingSelection,
  applyDraggingSelection,
  toggleLevelSelection,
  selectAllUpToLevel,
  selectAllFromLevel,
  selectAllUpToKanji,
  selectAllFromKanji,
  toggleKanjiSelection,
} = useDisplayData();

// Watch stores and update display data:
const { kanjiByLevel } = storeToRefs(storeList);
watch(kanjiByLevel, updateDisplayData);

const { doDisplayLevels, ignoredLevels, reverseOrder } =
  storeToRefs(storeOptions);
watch(doDisplayLevels, updateDisplayData);
watch(ignoredLevels, updateDisplayData);
watch(reverseOrder, updateDisplayData);

/*
===============
Context Menus:
===============
*/
const {
  onLevelTitleContext,
  levelTitleContextRef,

  onKanjiContext,
  kanjiContextRef,
} = useContextMenu();

const levelTitleContextOptions = [
  { name: "Select up to", class: "select-up-to" },
  { name: "Deselect up to", class: "deselect-up-to" },
  { type: "divider" },
  { name: "Select from", class: "select-from" },
  { name: "Deselect from", class: "deselect-from" },
];
const levelTitleContextOptionClicked = (event) => {
  const levelIdx = event.item;
  const selection = event.option.class;
  switch (selection) {
    case "select-up-to":
      selectAllUpToLevel(levelIdx, true, false);
      break;
    case "deselect-up-to":
      selectAllUpToLevel(levelIdx, false, false);
      break;
    case "select-from":
      selectAllFromLevel(levelIdx, true, false);
      break;
    case "deselect-from":
      selectAllFromLevel(levelIdx, false, false);
      break;
    default:
      console.log("Invalid selection");
  }
};

const kanjiContextOptions = [
  { name: "Display details", class: "display-details" },
  { type: "divider" },
  { name: "Select up to", class: "select-up-to" },
  { name: "Deselect up to", class: "deselect-up-to" },
  { type: "divider" },
  { name: "Select from", class: "select-from" },
  { name: "Deselect from", class: "deselect-from" },
];

const kanjiContextOptionClicked = (event) => {
  const levelIdx = event.item;
  const selection = event.option.class;
  switch (selection) {
    case "display-details":
      console.log("todo");
      break;
    case "select-up-to":
      selectAllUpToKanji(levelIdx, true, false);
      break;
    case "deselect-up-to":
      selectAllUpToKanji(levelIdx, false, false);
      break;
    case "select-from":
      selectAllFromKanji(levelIdx, true, false);
      break;
    case "deselect-from":
      selectAllFromKanji(levelIdx, false, false);
      break;
    default:
      console.log("Invalid selection");
  }
};

/*
===============
Kanji selection
===============
*/

const emit = defineEmits(["kanjiRangeSelected"]);

let isDragging = false;
let isRemoving = false;
let startDragCnt = -1;
let minDragCnt = -1;
let maxDragCnt = -1;

const getMouseChar = (event) => event.target.__vnode.key;

const getMouseKanji = (event) => {
  return getDisplayedKanjiByChar(getMouseChar(event));
};

const onKanjiClicked = (event) => {
  toggleKanjiSelection(getMouseChar(event));
};

const onKanjiMouseDown = (event) => {
  isDragging = true;
  if (event.target.classList.contains("drag-selected")) isRemoving = true;
  startDragCnt = getMouseKanji(event).cnt;
  minDragCnt = startDragCnt;
  maxDragCnt = startDragCnt;
};

const onKanjiMouseEnter = (event) => {
  if (!isDragging) return;
  const stopDragCnt = getMouseKanji(event).cnt;
  minDragCnt = Math.min(startDragCnt, stopDragCnt);
  maxDragCnt = Math.max(startDragCnt, stopDragCnt);
  updateDraggingSelection(minDragCnt, maxDragCnt, isRemoving);
};

const onMouseUp = (event) => {
  if (!isDragging) return;
  isDragging = false;
  isRemoving = false;
  startDragCnt = -1;
  minDragCnt = -1;
  maxDragCnt = -1;

  applyDraggingSelection();
};

/*
===============
Lifecycle:
===============
*/

onMounted(() => {
  // storeList.sortKanjiByLevel(); // list is updated by watching kanji sorted by level
  document.addEventListener("mouseup", onMouseUp);
});
onBeforeUnmount(() => {
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<style scoped></style>
