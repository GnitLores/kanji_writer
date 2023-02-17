<template>
  <div>
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
    <VueSimpleContextMenu
      element-id="details-context"
      :options="detailsContextOptions"
      ref="detailsContextRef"
      @option-clicked="detailsContextOptionClicked"
    />

    <AppKanjiGridHeader />

    <div
      v-if="!storeOptions.allLevelsIgnored()"
      class="container mx-auto select-none"
    >
      <div v-for="level in displayData" :key="level.name">
        <div class="flex justify-evenly">
          <h3
            @click.prevent="onLevelTitleLeftCLick(level.kanji)"
            @contextmenu.prevent.stop="
              onLevelTitleRightClick($event, level.name)
            "
            class="inline-block text-sky-200 cursor-pointer hover:text-white text-center mb-1 mt-2 font-bold tracking-wide"
          >
            {{ level.name }}:
          </h3>
        </div>
        <div
          v-for="kanji in level.kanji"
          :key="kanji.char"
          class="kanji-character inline-block cursor-pointer border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
          :class="[
            selectedWhileDragging[kanji.mainIdx]
              ? 'text-darkmode-200'
              : unselectedWhileDragging[kanji.mainIdx]
              ? 'text-white text-opacity-100'
              : selected[kanji.mainIdx]
              ? 'text-darkmode-50 hover:text-darkmode-200'
              : storeUser.known[kanji.mainIdx]
              ? 'text-emerald-400 hover:text-emerald-200'
              : 'text-white text-opacity-80 hover:text-opacity-100',
            modalKanji === kanji.char
              ? 'border-sky-400'
              : detailsKanji === kanji.char
              ? selected[kanji.mainIdx]
                ? 'border-white'
                : 'border-darkmode-50'
              : 'border-transparent',
          ]"
          @click.prevent="onKanjiClicked"
          @mousedown.prevent="onKanjiMouseDown"
          @mouseenter.prevent="onKanjiMouseEnter"
          @contextmenu.prevent.stop="onKanjiRightClicked($event, kanji)"
        >
          {{ kanji.char }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, inject } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import AppKanjiGridHeader from "@/components/KanjiGrid/AppKanjiGridHeader.vue";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";
import { useDisplayData } from "@/use/useDisplayData";
import { useSelection } from "@/use/useSelection";
import { useDragSelection } from "@/use/useDragSelection";
import { useContextMenu } from "@/use/useContextMenu";
import { useSearch } from "@/use/useSearch";

const emit = defineEmits(["singleKanjiSelected"]);

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { displayData, getDisplayedKanjiByChar } = useDisplayData();

const { selectionType } = inject("selectionType");

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

  detailsContextOptions,
  detailsContextOptionClicked,
  onDetailsContext,
  detailsContextRef,
} = useContextMenu();

const { isSearching } = useSearch();

const onLevelTitleLeftCLick = (kanji) => {
  if (!rangeSelectionEnabled.value) return;
  toggleLevelSelection(kanji);
};

const onLevelTitleRightClick = (event, levelName) => {
  if (!rangeSelectionEnabled.value) return;
  if (isSearching.value || !storeOptions.doDisplayLevels) return;
  onLevelTitleContext(event, levelName);
};

/*
===============
Kanji selection
===============
*/

const {
  selected,
  initSelected,
  toggleLevelSelection,
  detailsKanji,
  modalKanji,
} = useSelection();
const {
  isDragging,
  selectedWhileDragging,
  unselectedWhileDragging,
  startDrag,
  updateDrag,
  stopDrag,
} = useDragSelection();

const getMouseChar = (event) => event.target.__vnode.key;

const getMouseKanji = (event) => {
  return getDisplayedKanjiByChar(getMouseChar(event));
};

const isMouseKanji = (event) => {
  return event.target.classList.contains("kanji-character");
};

const rangeSelectionEnabled = computed(() => selectionType === "range");
const singleSelectionEnabled = computed(() => selectionType === "single");

const onKanjiClicked = (event) => {
  if (!singleSelectionEnabled.value) return;
  const kanji = getMouseKanji(event);
  emit("singleKanjiSelected", kanji.char);
};

const onKanjiMouseDown = (event) => {
  if (!rangeSelectionEnabled.value) return;
  if (!(event.button === 0)) return; // only on left click
  const kanji = getMouseKanji(event);

  const isUnselecting = selected.value[kanji.mainIdx];
  startDrag(kanji, isUnselecting);
};

const onKanjiMouseEnter = (event) => {
  if (!rangeSelectionEnabled.value) return;
  const kanji = getMouseKanji(event);
  updateDrag(kanji);
};

const onMouseUp = (event) => {
  if (!rangeSelectionEnabled.value) return;
  isMouseKanji(event) ? stopDrag(getMouseKanji(event)) : stopDrag();
};

const onKanjiRightClicked = (event, kanji) => {
  if (rangeSelectionEnabled.value) onKanjiContext(event, kanji);
  if (singleSelectionEnabled.value) onDetailsContext(event, kanji);
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
