import { ref, watch } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";

const displayData = ref([]);
const selectionStats = ref({});
let displayMap = new Map();
let displayList = [];

export function useDisplayData() {
  const storeOptions = useStoreOptions();
  const storeList = useStoreList();

  /*
  ===============
  Display List:
  ===============
  */

  const updateDisplayData = () => {
    const selections = getSelections();

    let data = createDataDeepCopy();
    data = filterIgnoredLevels(data);
    data = initializeDisplayDataProps(data);

    if (storeOptions.reverseOrder) data = setReverseOrder(data);
    if (!storeOptions.doDisplayLevels) data = collapseLevels(data);

    // When data finalized, map all displayed kanji to indices, set new displayData, and reapply stored selections.
    mapDisplayedKanji(data);
    displayData.value = data;
    applySelections(selections);
    console.log(displayData.value);
  };

  const createDataDeepCopy = () => {
    // Create deep copy of kanji sorted by levels:
    return JSON.parse(JSON.stringify(storeList.kanjiByLevel));
  };

  const filterIgnoredLevels = (data) => {
    let nKanjiIncluded = 0;
    const filtered = [];
    data.forEach((level) => {
      if (storeOptions.isLevelDisplayed(level.name)) {
        filtered.push(level);
        nKanjiIncluded += level.kanji.length;
      }
    });

    filtered.nKanji = nKanjiIncluded;
    return filtered;
  };

  const initializeDisplayDataProps = (data) => {
    // Initialize dragging selection
    data.forEach((level) => {
      level.kanji.forEach((kanji) => {
        kanji.selectedWhileDragging = false;
        kanji.unSelectedWhileDragging = false;
      });
    });
    return data;
  };

  const setReverseOrder = (data) => {
    data.reverse();
    for (const level of data) level.kanji.reverse();
    return data;
  };

  const collapseLevels = (data) => {
    // Collapse kanji list:
    const collapsed = [];
    data.forEach((level) => {
      collapsed.push(...level.kanji);
    });
    return [{ kanji: collapsed, name: "All levels" }];
  };

  const mapDisplayedKanji = (data) => {
    const map = new Map();
    const list = [];
    let cnt = 0;
    data.forEach((level, levelIdx) => {
      level.kanji.forEach((kanji, idxInLevel) => {
        kanji.cnt = cnt;
        kanji.levelIdx = levelIdx;
        kanji.idxInLevel = idxInLevel;
        map.set(kanji.kanji, kanji);
        list.push(kanji);
        cnt += 1;
      });
      level.levelIdx = levelIdx;
    });
    displayMap = map;
    displayList = list;
  };

  const getSelections = () => {
    // Store all selections before updating displayData
    const selectedKanji = [];
    displayData.value.forEach((level) => {
      level.kanji.forEach((kanji) => {
        if (kanji.selected) selectedKanji.push(kanji.kanji);
      });
    });
    return selectedKanji;
  };

  const applySelections = (selectedKanji) => {
    // Reapply selections after updating displayData, ignoring ignored levels.
    selectedKanji.forEach((char) => {
      const kanji = getDisplayedKanjiByChar(char);
      if (kanji) kanji.selected = true;
    });
    updateSelectionStats();
  };

  const getDisplayedKanjiByChar = (char) => {
    return displayMap.get(char);
  };

  const getDisplayedKanjiByCount = (cnt) => {
    return displayList[cnt];
  };

  /*
===============
Selection Stats
===============
*/

  const updateSelectionStats = () => {
    let nSelectedTotal = 0;
    const stats = { levels: [] };
    displayData.value.forEach((level) => {
      // Per level stats:
      let nSelected = 0;
      level.kanji.forEach((kanji) => {
        nSelected += kanji.selected;
      });
      stats.levels.push({
        name: level.name,
        nKanji: level.kanji.length,
        nSelected: nSelected,
        levelIdx: level.levelIdx,
      });

      // Total stats:
      nSelectedTotal += nSelected;
    });

    stats.nKanji = displayData.value.nKanji;
    stats.nSelected = nSelectedTotal;
    stats.nDisplayedLevels = displayData.value.length;
    selectionStats.value = stats;
  };

  const getKanjiStatLevel = (char) => {
    const indices = displayMap.get(char);
    return selectionStats.value.levels[indices.levelIdx];
  };

  const changeLevelStatsByAmount = (level, amount) => {
    level.nSelected += amount;
    selectionStats.value.nSelected += amount;
  };

  const addKanjiToStats = (char) => {
    changeLevelStatsByAmount(getKanjiStatLevel(char), 1);
  };

  const removeKanjiFromStats = (char) => {
    changeLevelStatsByAmount(getKanjiStatLevel(char), -1);
  };

  /*
  ===============
  Dragging selection:
  ===============
  */

  // TODO: this seems to perform fine, but it would be more efficient to only add and remove changed indices instead of iterating over all indices.
  const updateDraggingSelection = (min, max, isRemoving) => {
    for (const kanjiRef of displayList) {
      // Accessing the display data like this is necessary to ensure reactivity updates
      const kanji =
        displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];

      if (kanjiRef.cnt < min || kanjiRef.cnt > max) {
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
    // Accessing the display data like this is necessary to ensure reactivity updates
    for (const kanjiRef of displayList) {
      const kanji =
        displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];

      kanji.selected =
        (kanji.selected && !kanji.unselectedWhileDragging) ||
        (!kanji.selected && kanji.selectedWhileDragging);
      kanji.selectedWhileDragging = false;
      kanji.unselectedWhileDragging = false;
    }
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

  const selectAllUpToLevel = (levelIdx) => {
    for (const kanjiRef of displayList) {
      // Accessing the display data like this is necessary to ensure reactivity updates
      const kanji =
        displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];

      kanji.selected = kanji.levelIdx <= levelIdx;
      kanji.selectedWhileDragging = false;
      kanji.unSelectedWhileDragging = false;
    }
    updateSelectionStats();
  };

  const toggleKanjiSelection = (char) => {
    const kanjiRef = getDisplayedKanjiByChar(char);
    const kanji =
      displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];
    kanji.selected = !kanji.selected;
    if (kanji.selected) {
      addKanjiToStats(kanji.kanji);
    } else {
      removeKanjiFromStats(kanji.kanji);
    }
  };

  return {
    displayData,
    selectionStats,
    updateDisplayData,
    getDisplayedKanjiByChar,
    getDisplayedKanjiByCount,
    updateDraggingSelection,
    applyDraggingSelection,
    toggleLevelSelection,
    selectAllUpToLevel,
    toggleKanjiSelection,
  };
}