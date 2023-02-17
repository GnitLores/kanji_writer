import { ref } from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import { useSelectionStats } from "@/use/useSelectionStats";

const selected = ref([]); // list of booleans for each kanji, indicates all the kanji selected to be included in quiz
const detailsKanji = ref(""); // char currently being viewed in details
const modalKanji = ref(""); // char currently being viewed in modal

export function useSelection() {
  const { updateSelectionStats } = useSelectionStats();

  const initSelected = () => {
    const storeList = useStoreList();
    selected.value = new Array(storeList.kanjiList.length).fill(false);
    detailsKanji.value = "";
    modalKanji.value = "";

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
    refreshStats();
  };

  const refreshStats = () => {
    updateSelectionStats(selected);
  };

  const selectLevel = (levelName, toggle = true) => {
    const levelIdx = getOriginalLevelIdx(levelName);
    applyForAll((kanji) => {
      if (kanji.levelIdx === levelIdx) selectKanji(kanji, toggle);
    });
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
  };

  const toggleKanjiSelection = (kanji) => {
    selected.value[kanji.mainIdx] = !selected.value[kanji.mainIdx];
    refreshStats();
  };

  const selectAll = (toggle = true) => {
    applyForAll((kanji) => {
      selectKanji(kanji, toggle);
    });
  };

  const setSelectionAsSelected = (selection, toggle = true, strict = true) => {
    // Pass in a boolean array and select or deselect all indices set to true in selection.
    // If strict mode, all others are deselected.
    // For example, can be used to select all known or all unknown kanji
    selected.value = selection.map((isSelected, idx) => {
      if (strict && !isSelected) return false;
      return isSelected ? toggle : selected.value[idx];
    });
    refreshStats();
  };

  return {
    selected,
    detailsKanji,
    modalKanji,
    initSelected,
    applyForAll,
    isSelected,
    selectKanji,
    selectLevel,
    toggleLevelSelection,
    selectAllUpToLevel,
    selectAllFromLevel,
    selectAllUpToKanji,
    selectAllFromKanji,
    toggleKanjiSelection,
    selectAll,
    setSelectionAsSelected,
  };
}
