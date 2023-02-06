import { ref } from "vue";
import { useStoreList } from "@/stores/storeList";

const selectionStats = ref({});

export function useSelectionStats() {
  const updateSelectionStats = (selected) => {
    const storeList = useStoreList();

    const stats = [];
    stats.nSelected = 0;
    storeList.kanjiByLevel.forEach((level) => {
      // Per level stats:
      let nSelectedInLevel = 0;
      level.kanji.forEach((kanji) => {
        nSelectedInLevel += selected.value[kanji.mainIdx];
      });
      stats.push({
        name: level.name,
        nKanji: level.kanji.length,
        nSelected: nSelectedInLevel,
        levelIdx: level.levelIdx,
      });

      // Total stats:
      stats.nSelected += nSelectedInLevel;
    });

    stats.nKanji = storeList.kanjiList.length;
    selectionStats.value = stats;
  };

  return {
    selectionStats,
    updateSelectionStats,
  };
}
