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

  <div
    v-if="!storeOptions.allLevelsIgnored()"
    class="container mx-auto select-none"
  >
    <div v-for="level in displayData" :key="level.name">
      <div class="flex justify-evenly">
        <h3
          @click.prevent="toggleLevelSelection(level.kanji)"
          @contextmenu.prevent.stop="
            onLevelTitleContext($event, level.levelIdx)
          "
          class="inline-block text-sky-200 cursor-pointer hover:text-white text-center mb-1 mt-2 font-bold tracking-wide"
        >
          {{ level.name }}:
        </h3>
      </div>
      <div
        v-for="kanji in level.kanji"
        :key="kanji.char"
        class="kanji-character inline-block cursor-pointer hover:text-white text-white border-transparent border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
        :class="[
          (kanji.selected && !kanji.unselectedWhileDragging) ||
          (!kanji.selected && kanji.selectedWhileDragging)
            ? 'drag-selected text-darkmode-50 text-opacity-100'
            : 'text-opacity-80',
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
import { useSelection } from "@/use/useSelection";
import { useContextMenu } from "@/use/useContextMenu";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

const {
  displayData,
  updateDisplayData,
  getDisplayedKanjiByChar,
  getDisplayedKanjiByCount,
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
  levelTitleContextOptions,
  levelTitleContextOptionClicked,
  onLevelTitleContext,
  levelTitleContextRef,

  kanjiContextOptions,
  kanjiContextOptionClicked,
  onKanjiContext,
  kanjiContextRef,
} = useContextMenu();

/*
===============
Kanji selection
===============
*/

const {
  updateDraggingSelection,
  applyDraggingSelection,
  toggleLevelSelection,
  toggleKanjiSelection,
} = useSelection();

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
