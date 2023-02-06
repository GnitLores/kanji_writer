import { ref } from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import { useDisplayData } from "@/use/useDisplayData";
import { useSelectionStats } from "@/use/useSelectionStats";

const selected = ref([]);
const selectedWhileDragging = ref([]);
const unselectedWhileDragging = ref([]);

export function useSelection() {
  const { displayList, getDisplayedKanjiByChar } = useDisplayData();

  const { updateSelectionStats } = useSelectionStats();

  const initSelected = () => {
    const storeList = useStoreList();
    selected.value = new Array(storeList.kanjiList.length).fill(false);
    selectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );
    unselectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );

    updateSelectionStats(selected);
  };
  /*
  ===============
  Dragging selection:
  ===============
  */

  const isSelected = (kanji) => selected.value[kanji.mainIdx];

  const selectKanji = (kanji, value = true) => {
    selected.value[kanji.mainIdx] = value;
  };

  const applyForAll = (fun) => {
    const storeOptions = useStoreOptions();
    const storeList = useStoreList();

    storeList.kanjiByLevel.forEach((level) => {
      level.kanji.forEach((kanji) => {
        storeOptions.isLevelIgnored(level.name)
          ? selectKanji(kanji, false)
          : fun(kanji);
      });
    });
  };

  const refreshStats = () => {
    updateSelectionStats(selected);
  };

  const addRangeToDrag = (min, max, isUnselecting) => {
    // Used when expanding dragging selection
    for (let cnt = min; cnt <= max; cnt++) {
      const kanji = displayList.value[cnt];

      if (isUnselecting) {
        selectedWhileDragging.value[kanji.mainIdx] = false;
        unselectedWhileDragging.value[kanji.mainIdx] = true;
      } else {
        selectedWhileDragging.value[kanji.mainIdx] = true;
        unselectedWhileDragging.value[kanji.mainIdx] = false;
      }
    }
  };
  const removeRangeFromDrag = (min, max) => {
    // Used when contracting dragging selection
    for (let cnt = min; cnt <= max; cnt++) {
      const kanji = displayList.value[cnt];
      selectedWhileDragging.value[kanji.mainIdx] = false;
      unselectedWhileDragging.value[kanji.mainIdx] = false;
    }
  };

  const applyDraggingSelection = () => {
    applyForAll((kanji) => {
      const doSelect =
        (isSelected(kanji) && !unselectedWhileDragging.value[kanji.mainIdx]) ||
        (!isSelected(kanji) && selectedWhileDragging.value[kanji.mainIdx]);
      selectKanji(kanji, doSelect);
      selectedWhileDragging.value[kanji.mainIdx] = false;
      unselectedWhileDragging.value[kanji.mainIdx] = false;
    });
    refreshStats();
  };

  const selectLevel = (levelName, toggle = true) => {
    const levelIdx = getOriginalLevelIdx(levelName);
    applyForAll((kanji) => {
      if (kanji.levelIdx === levelIdx) selectKanji(kanji, toggle);
    });
    refreshStats();
  };

  const toggleLevelSelection = (kanjiList) => {
    let nSelected = 0;
    kanjiList.forEach((kanji) => {
      if (!isSelected(kanji)) {
        selectKanji(kanji, true);
        nSelected += 1;
      }
    });
    if (nSelected === 0) {
      kanjiList.forEach((kanji) => {
        selectKanji(kanji, false);
      });
    }
    refreshStats();
  };

  const getOriginalLevelIdx = (levelName) => {
    const storeList = useStoreList();
    return storeList.levelNames.indexOf(levelName);
  };

  const selectAllUpToLevel = (
    levelName, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    const levelIdx = getOriginalLevelIdx(levelName);
    applyForAll((kanji) => {
      if (kanji.levelIdx <= levelIdx) {
        selectKanji(kanji, toggle);
      } else {
        if (enforceOutsideRange) selectKanji(kanji, !toggle);
      }
    });
    refreshStats();
  };

  const selectAllFromLevel = (
    levelName, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    const levelIdx = getOriginalLevelIdx(levelName);
    applyForAll((kanji) => {
      if (kanji.levelIdx >= levelIdx) {
        selectKanji(kanji, toggle);
      } else {
        if (enforceOutsideRange) selectKanji(kanji, !toggle);
      }
    });
    refreshStats();
  };

  const selectAllUpToKanji = (
    selectedKanji, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    applyForAll((kanji) => {
      if (kanji.mainIdx <= selectedKanji.mainIdx) {
        selectKanji(kanji, toggle);
      } else {
        if (enforceOutsideRange) selectKanji(kanji, !toggle);
      }
    });
    refreshStats();
  };

  const selectAllFromKanji = (
    selectedKanji, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    applyForAll((kanji) => {
      if (kanji.mainIdx >= selectedKanji.mainIdx) {
        selectKanji(kanji, toggle);
      } else {
        if (enforceOutsideRange) selectKanji(kanji, !toggle);
      }
    });
    refreshStats();
  };

  const toggleKanjiSelection = (kanji) => {
    selected.value[kanji.mainIdx] = !selected.value[kanji.mainIdx];
    refreshStats();
  };

  const selectAll = (toggle = true) => {
    applyForAll((kanji) => {
      selectKanji(kanji, toggle);
    });
    refreshStats();
  };

  return {
    selected,
    selectedWhileDragging,
    unselectedWhileDragging,
    initSelected,
    addRangeToDrag,
    removeRangeFromDrag,
    applyDraggingSelection,
    selectLevel,
    toggleLevelSelection,
    selectAllUpToLevel,
    selectAllFromLevel,
    selectAllUpToKanji,
    selectAllFromKanji,
    toggleKanjiSelection,
    selectAll,
  };
}
