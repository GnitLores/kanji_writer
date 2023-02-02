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

  <AppKanjiGridHeader
    @levelClicked="selectAllUpToLevel"
    :selectionStats="selectionStats"
  />
  <div v-if="!storeOptions.allLevelsIgnored()" class="select-none">
    <div
      v-for="levelList in displayList"
      v-show="levelList.doDisplay"
      :key="levelList.name"
    >
      <div class="flex justify-evenly">
        <h3
          @click.prevent="toggleLevelSelection(levelList.kanji)"
          @contextmenu.prevent.stop="onLevelTitleContext($event, item)"
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
            ? 'drag-selected text-orange-400'
            : '',
        ]"
        @click.prevent="onKanjiClicked"
        @mousedown.prevent="onKanjiMouseDown"
        @mouseenter.prevent="onKanjiMouseEnter"
        @contextmenu.prevent.stop="onKanjiContext($event, item)"
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
  watch,
} from "vue";
import { storeToRefs } from "pinia";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import AppKanjiGridHeader from "@/components/kanjiGridComponents/AppKanjiGridHeader.vue";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

/*
===============
Context Menus:
===============
*/
const levelTitleContextOptions = [
  { name: "option1", class: "myClass" },
  { name: "option2", class: "myClass" },
  { name: "", class: "myClass", type: "divider" },
  { name: "option3", class: "myClass" },
];
const levelTitleContextRef = ref(null);
const onLevelTitleContext = (event, item) => {
  if (kanjiContextRef.value) kanjiContextRef.value.hideContextMenu();
  levelTitleContextRef.value.showMenu(event, item);
};
const levelTitleContextOptionClicked = (event) => {
  window.alert(JSON.stringify(event));
};

const kanjiContextOptions = [
  { name: "kanji option1", class: "myClass" },
  { name: "kanji option2", class: "myClass" },
  { name: "", class: "myClass", type: "divider" },
  { name: "kanji option3", class: "myClass" },
];
const kanjiContextRef = ref(null);
const onKanjiContext = (event, item) => {
  if (levelTitleContextRef.value) levelTitleContextRef.value.hideContextMenu();
  kanjiContextRef.value.showMenu(event, item);
};
const kanjiContextOptionClicked = (event) => {
  window.alert(JSON.stringify(event));
};

/*
===============
Display List:
===============
*/
const displayList = ref([]);
let displayMap = [];

const updateDisplayList = () => {
  const selections = getAllSelectedKanji();

  // Create deep copy of kanji sorted by levels:
  const data = JSON.parse(JSON.stringify(storeList.kanjiByLevel));

  data.forEach((level) => {
    level.kanji.forEach((kanji) => {
      kanji.selectedWhileDragging = false;
      kanji.unSelectedWhileDragging = false;
    });
  });

  // Reverse display list if ascending order:
  if (storeOptions.reverseOrder) {
    data.reverse();
    for (const level of data) level.kanji.reverse();
  }

  // Handle processing that differs if levels are not displayed
  if (storeOptions.doDisplayLevels) {
    setDisplayListByLevels(data);
  } else {
    setDisplayListNoLevels(data);
  }
  applyKanjiSelections(selections);
  updateSelectionStats();
};

const getAllSelectedKanji = () => {
  // Store all selections before updating displaylist
  const selectedKanji = [];
  displayList.value.forEach((level) => {
    level.kanji.forEach((kanji) => {
      if (kanji.selected) selectedKanji.push(kanji.kanji);
    });
  });
  return selectedKanji;
};

const applyKanjiSelections = (selectedKanji) => {
  // Reapply selections after updating displaylist, ignoring ignored levels.
  selectedKanji.forEach((char) => {
    const kanji = getDisplayedKanji(char);
    if (kanji) kanji.selected = true;
  });
};

const setDisplayListByLevels = (data) => {
  // Toggle display of each level:
  data.forEach((level) => {
    level.doDisplay = storeOptions.isLevelDisplayed(level.name);
  });

  // Map kanji to level and index in level of displayed list:
  const map = new Map();
  data.forEach((level, levelIdx) => {
    level.kanji.forEach((kanji, idxInLevel) => {
      map.set(kanji.kanji, { levelIdx, idxInLevel });
    });
  });
  displayMap = map;

  // Assign to display list to update display:
  displayList.value = data;
};

const setDisplayListNoLevels = (data) => {
  // Collapse kanji list while excluding hidden levels:
  const collapsedList = [];
  storeList.levelNames.forEach((name, index) => {
    if (storeOptions.isLevelDisplayed(name))
      collapsedList.push(...data[index].kanji);
  });

  // Map kanji to level and index in level of displayed list:
  const map = new Map();
  for (let i = 0; i < collapsedList.length; i++) {
    map.set(collapsedList[i].kanji, {
      levelIdx: 0,
      idxInLevel: i,
    });
  }
  displayMap = map;

  // Assign to display list to update display:
  displayList.value = [
    {
      kanji: collapsedList,
      name: "All levels",
      doDisplay: true,
    },
  ];
};

const getDisplayedKanji = (char) => {
  // Get display list kanji object by char. Returns null for kanji in ignored levels.
  const indices = displayMap.get(char);
  if (!indices) return null;
  if (!displayList.value[indices.levelIdx].doDisplay) return null;
  return displayList.value[indices.levelIdx].kanji[indices.idxInLevel];
};

const getDisplayedKanjiByIndex = (idx) => {
  // Get display list kanji object by index. Returns null for kanji in ignored levels.
  return getDisplayedKanji(storeList.kanjiList[idx].kanji);
};

// Watch stores and update displaylist:
const { kanjiByLevel } = storeToRefs(storeList);
watch(kanjiByLevel, updateDisplayList);

const { doDisplayLevels, ignoredLevels, reverseOrder } =
  storeToRefs(storeOptions);
watch(doDisplayLevels, updateDisplayList);
watch(ignoredLevels, updateDisplayList);
watch(reverseOrder, updateDisplayList);

/*
===============
Kanji selection
===============
*/

const emit = defineEmits(["kanjiRangeSelected"]);

let isDragging = false;
let isRemoving = false;
let startDragIdx = -1;
let minDragIdx = -1;
let maxDragIdx = -1;

const getMouseIndex = (event) => {
  const kanji = event.target.__vnode.key;
  return storeList.indexMap.get(kanji);
};

const onKanjiClicked = (event) => {
  const kanji = getDisplayedKanji(event.target.__vnode.key);
  kanji.selected = !kanji.selected;
  kanji.selected
    ? addKanjiToStats(kanji.kanji)
    : removeKanjiFromStats(kanji.kanji);
};

const onKanjiMouseDown = (event) => {
  isDragging = true;
  if (event.target.classList.contains("drag-selected")) isRemoving = true;
  startDragIdx = getMouseIndex(event);
  minDragIdx = startDragIdx;
  maxDragIdx = startDragIdx;
};

const onKanjiMouseEnter = (event) => {
  if (!isDragging) return;
  const stopDragIdx = getMouseIndex(event);
  minDragIdx = Math.min(startDragIdx, stopDragIdx);
  maxDragIdx = Math.max(startDragIdx, stopDragIdx);
  updateDraggingSelection(minDragIdx, maxDragIdx, isRemoving);
};

const onMouseUp = (event) => {
  if (!isDragging) return;
  isDragging = false;
  isRemoving = false;
  startDragIdx = -1;
  minDragIdx = -1;
  maxDragIdx = -1;

  applyDraggingSelection();
};

// TODO: make dragging selection more efficient by only adding and removing changed indices instead of iterating over all indices.
const updateDraggingSelection = (min, max, isRemoving) => {
  for (let i = 0; i < storeList.kanjiList.length; i++) {
    const kanji = getDisplayedKanjiByIndex(i);
    if (!kanji) continue; // kanji was in ignored level
    if (i < min || i > max) {
      kanji.selectedWhileDragging = false;
      kanji.unselectedWhileDragging = false;
      continue;
    }
    if (isRemoving) {
      kanji.selectedWhileDragging = false;
      kanji.unselectedWhileDragging = true;
    } else {
      kanji.selectedWhileDragging = true;
      kanji.unselectedWhileDragging = false;
    }
  }
};

const applyDraggingSelection = () => {
  displayList.value.forEach((level) => {
    if (level.doDisplay) {
      level.kanji.forEach((kanji) => {
        kanji.selected =
          (kanji.selected && !kanji.unselectedWhileDragging) ||
          (!kanji.selected && kanji.selectedWhileDragging);
        kanji.selectedWhileDragging = false;
        kanji.unselectedWhileDragging = false;
      });
    }
  });
  updateSelectionStats();
};

const toggleLevelSelection = (kanjiList) => {
  let nSelected = 0;
  kanjiList.forEach((kanji) => {
    if (!kanji.selected) {
      kanji.selected = true;
      nSelected += 1;
    }
  });
  if (nSelected === 0) {
    kanjiList.forEach((kanji) => {
      kanji.selected = false;
    });
  }
  updateSelectionStats();
};

const selectAllUpToLevel = (levelName) => {
  let levelFound = false;
  displayList.value.forEach((level) => {
    if (level.doDisplay) {
      level.kanji.forEach((kanji) => {
        kanji.selected = !levelFound;
        kanji.selectedWhileDragging = false;
        kanji.unSelectedWhileDragging = false;
      });
      if (!levelFound) levelFound = level.name === levelName;
    }
  });
  updateSelectionStats();
};

/*
===============
Selection Stats
===============
*/
const selectionStats = ref({});

const updateSelectionStats = () => {
  let nKanjiTotal = 0;
  let nSelectedTotal = 0;
  let nDisplayedLevels = 0;
  let nameOfFirstDisplayedLevel = "";
  let displayedLevelFound = false;
  const stats = { levels: [] };
  displayList.value.forEach((level) => {
    // Per level stats:
    let nSelected = 0;
    level.kanji.forEach((kanji) => {
      nSelected += kanji.selected;
    });
    stats.levels.push({
      doDisplay: level.doDisplay,
      name: level.name,
      nKanji: level.kanji.length,
      nSelected: nSelected,
    });

    // Total stats:
    nKanjiTotal += level.kanjiInLevel;
    nSelectedTotal += level.nrOfSelected;
    nDisplayedLevels += level.doDisplay;
    if (!displayedLevelFound) {
      if (level.doDisplay) {
        nameOfFirstDisplayedLevel = level.name;
        displayedLevelFound = true;
      }
    }
  });

  stats.nKanji = nKanjiTotal;
  stats.nSelected = nSelectedTotal;
  stats.nDisplayedLevels = nDisplayedLevels;
  stats.firstDisplayedLevel = nameOfFirstDisplayedLevel;
  selectionStats.value = stats;
};

const getKanjiStatLevel = (char) => {
  const indices = displayMap.get(char);
  return selectionStats.value.levels[indices.levelIdx];
};

const changeLevelStatsByAmount = (level, amount) => {
  if (level.doDisplay) {
    level.nSelected += amount;
    selectionStats.value.nSelected += amount;
  }
};

const addKanjiToStats = (char) => {
  changeLevelStatsByAmount(getKanjiStatLevel(char), 1);
};

const removeKanjiFromStats = (char) => {
  changeLevelStatsByAmount(getKanjiStatLevel(char), -1);
};

/*
===============
Lifecycle:
===============
*/

onMounted(() => {
  storeList.sortKanjiByLevel(); // list is updated by watching kanji sorted by level
  document.addEventListener("mouseup", onMouseUp);
});
onBeforeUnmount(() => {
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<style scoped></style>
