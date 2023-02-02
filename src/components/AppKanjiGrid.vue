<template>
  <AppKanjiGridHeader
    @levelClicked="selectAllUpToLevel"
    :selectionStats="selectionStats"
  />
  <div class="select-none">
    <div
      v-for="levelList in displayList"
      v-show="levelList.doDisplay"
      :key="levelList.name"
    >
      <div class="flex justify-evenly">
        <h3
          @click.prevent="toggleLevelSelection(levelList.kanji)"
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

const storeOptions = useStoreOptions();
const storeList = useStoreList();

/*
===============
Display List:
===============
*/
const displayList = ref([]);
let displayMap = [];

const updateDisplayList = () => {
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
    setDisplayListByLevels(data, storeOptions.displayLevelNames);
  } else {
    setDisplayListNoLevels(data, storeOptions.displayLevelNames);
  }
  updateSelectionStats();
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
  levelNames.forEach((name, index) => {
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
      name: "All displayed levels",
      doDisplay: true,
    },
  ];
};

const { kanjiByLevel } = storeToRefs(storeList);
watch(kanjiByLevel, updateDisplayList);

const { doDisplayLevels, displayLevelNames, reverseOrder } =
  storeToRefs(storeOptions);
watch(doDisplayLevels, updateDisplayList);
watch(displayLevelNames, updateDisplayList);
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

const onKanjiClicked = (event) => {};

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

const getDisplayedKanji = (char) => {
  // Get desiplay list kanji object by char
  const indices = displayMap.get(char);
  return displayList.value[indices.levelIdx].kanji[indices.idxInLevel];
};

const getDisplayedKanjiByIndex = (idx) => {
  // Get desiplay list kanji object by index
  return getDisplayedKanji(storeList.kanjiList[idx].kanji);
};

// TODO: make dragging selection more efficient by only adding and removing changed indices instead of iterating over all indices.
const updateDraggingSelection = (min, max, isRemoving) => {
  for (let i = 0; i < storeList.kanjiList.length; i++) {
    const kanji = getDisplayedKanjiByIndex(i);
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
    level.kanji.forEach((kanji) => {
      kanji.selected =
        (kanji.selected && !kanji.unselectedWhileDragging) ||
        (!kanji.selected && kanji.selectedWhileDragging);
      kanji.selectedWhileDragging = false;
      kanji.unselectedWhileDragging = false;
    });
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
    level.kanji.forEach((kanji) => {
      kanji.selected = !levelFound;
      kanji.selectedWhileDragging = false;
      kanji.unSelectedWhileDragging = false;
    });
    if (!levelFound) levelFound = level.name === levelName;
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
