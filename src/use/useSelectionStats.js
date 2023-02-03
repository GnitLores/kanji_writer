import { ref } from "vue";
const selectionStats = ref({});

export function useSelectionStats() {
  const updateSelectionStats = (displayData) => {
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

  const changeLevelStatsByAmount = (levelIdx, amount) => {
    selectionStats.value.levels[levelIdx].nSelected += amount;
    selectionStats.value.nSelected += amount;
  };

  const addKanjiToStats = (kanji) => {
    changeLevelStatsByAmount(kanji.levelIdx, 1);
  };

  const removeKanjiFromStats = (kanji) => {
    changeLevelStatsByAmount(kanji.levelIdx, -1);
  };

  return {
    selectionStats,
    updateSelectionStats,
    addKanjiToStats,
    removeKanjiFromStats,
  };
}
