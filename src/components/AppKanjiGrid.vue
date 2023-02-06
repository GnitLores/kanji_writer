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
  <AppKanjiGridSearch />
  <div
    v-if="!storeOptions.allLevelsIgnored()"
    class="container mx-auto select-none"
  >
    <div v-for="level in displayData" :key="level.name">
      <div class="flex justify-evenly">
        <h3
          @click.prevent="toggleLevelSelection(level.kanji)"
          @contextmenu.prevent.stop="onLevelTitleContext($event, level.name)"
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
          (selected[kanji.mainIdx] &&
            !unselectedWhileDragging[kanji.mainIdx]) ||
          (!selected[kanji.mainIdx] && selectedWhileDragging[kanji.mainIdx])
            ? 'text-darkmode-50 text-opacity-100'
            : 'text-opacity-80',
        ]"
        @click.prevent="onKanjiClicked"
        @mousedown.prevent="onKanjiMouseDown"
        @mouseenter.prevent="onKanjiMouseEnter"
        @contextmenu.prevent.stop="onKanjiContext($event, kanji)"
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
import AppKanjiGridSearch from "@/components/kanjiGridComponents/AppKanjiGridSearch.vue";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";
import { useDisplayData } from "@/use/useDisplayData";
import { useSelection } from "@/use/useSelection";
import { useDragSelection } from "@/use/useDragSelection";
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

const { selected, toggleLevelSelection, toggleKanjiSelection } = useSelection();
const {
  selectedWhileDragging,
  unselectedWhileDragging,
  startDrag,
  updateDrag,
  stopDrag,
} = useDragSelection();

const emit = defineEmits(["kanjiRangeSelected"]);

const getMouseChar = (event) => event.target.__vnode.key;

const getMouseKanji = (event) => {
  return getDisplayedKanjiByChar(getMouseChar(event));
};

const onKanjiClicked = (event) => {
  toggleKanjiSelection(getMouseKanji(event));
};

const onKanjiMouseDown = (event) => {
  const kanji = getMouseKanji(event);
  const isUnselecting = selected.value[kanji.mainIdx];
  startDrag(kanji, isUnselecting);
};

const onKanjiMouseEnter = (event) => {
  const kanji = getMouseKanji(event);
  updateDrag(kanji);
};

const onMouseUp = () => {
  stopDrag();
};

/*
===============
Lifecycle:
===============
*/

onMounted(() => {
  document.addEventListener("mouseup", onMouseUp);
});
onBeforeUnmount(() => {
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<style scoped></style>
