import { useDisplayData } from "@/use/useDisplayData";
import { useSelectionStats } from "@/use/useSelectionStats";

export function useSelection() {
  const { displayData, displayList, getDisplayedKanjiByChar } =
    useDisplayData();

  const { updateSelectionStats, addKanjiToStats, removeKanjiFromStats } =
    useSelectionStats();

  /*
  ===============
  Dragging selection:
  ===============
  */

  const applyToAll = (fun) => {
    // Apply function to all kanji in such a way that reactivity is ensured.
    for (const kanjiRef of displayList.value) {
      // Accessing the display data indexed like this is necessary to ensure reactivity updates.
      const kanji =
        displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];

      fun(kanji);
    }
  };

  const refreshStats = () => {
    updateSelectionStats(displayData);
  };

  // TODO: this seems to perform fine, but it would be more efficient to only add and remove changed indices instead of iterating over all indices.
  const updateDraggingSelection = (min, max, isRemoving) => {
    applyToAll((kanji) => {
      if (kanji.cnt < min || kanji.cnt > max) {
        kanji.selectedWhileDragging = false;
        kanji.unselectedWhileDragging = false;
        return;
      }
      if (isRemoving) {
        kanji.selectedWhileDragging = false;
        kanji.unselectedWhileDragging = true;
      } else {
        kanji.selectedWhileDragging = true;
        kanji.unselectedWhileDragging = false;
      }
    });
  };

  const applyDraggingSelection = () => {
    applyToAll((kanji) => {
      kanji.selected =
        (kanji.selected && !kanji.unselectedWhileDragging) ||
        (!kanji.selected && kanji.selectedWhileDragging);
      kanji.selectedWhileDragging = false;
      kanji.unselectedWhileDragging = false;
    });
    refreshStats();
  };

  const selectLevel = (levelIdx, toggle = true) => {
    applyToAll((kanji) => {
      if (kanji.levelIdx === levelIdx) kanji.selected = toggle;
    });
    refreshStats();
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
    refreshStats();
  };

  const selectAllUpToLevel = (
    levelIdx, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    applyToAll((kanji) => {
      if (kanji.levelIdx <= levelIdx) {
        kanji.selected = toggle;
      } else {
        if (enforceOutsideRange) kanji.selected = !toggle;
      }
    });
    refreshStats();
  };

  const selectAllFromLevel = (
    levelIdx, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    applyToAll((kanji) => {
      if (kanji.levelIdx >= levelIdx) {
        kanji.selected = toggle;
      } else {
        if (enforceOutsideRange) kanji.selected = !toggle;
      }
    });
    refreshStats();
  };

  const selectAllUpToKanji = (
    char, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    const cnt = getDisplayedKanjiByChar(char).cnt;
    applyToAll((kanji) => {
      if (kanji.cnt <= cnt) {
        kanji.selected = toggle;
      } else {
        if (enforceOutsideRange) kanji.selected = !toggle;
      }
    });
    refreshStats();
  };

  const selectAllFromKanji = (
    char, // cutoff
    toggle = true, // value to set
    enforceOutsideRange = true // enforce opposite value outside range
  ) => {
    const cnt = getDisplayedKanjiByChar(char).cnt;
    applyToAll((kanji) => {
      if (kanji.cnt >= cnt) {
        kanji.selected = toggle;
      } else {
        if (enforceOutsideRange) kanji.selected = !toggle;
      }
    });
    refreshStats();
  };

  const toggleKanjiSelection = (char) => {
    const kanjiRef = getDisplayedKanjiByChar(char);
    const kanji =
      displayData.value[kanjiRef.levelIdx].kanji[kanjiRef.idxInLevel];
    kanji.selected = !kanji.selected;
    if (kanji.selected) {
      addKanjiToStats(kanji);
    } else {
      removeKanjiFromStats(kanji);
    }
  };

  const selectAll = (toggle = true) => {
    applyToAll((kanji) => {
      kanji.selected = toggle;
    });
    refreshStats();
  };

  return {
    updateDraggingSelection,
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
