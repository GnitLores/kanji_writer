import { ref } from "vue";
import { useStoreList } from "@/stores/storeList";
import { useDisplayData } from "@/use/useDisplayData";
import { useSelection } from "@/use/useSelection";

export function useDragSelection() {
  const { displayList } = useDisplayData();
  const { applyForAll, isSelected, selectKanji } = useSelection();

  const selectedWhileDragging = ref([]);
  const unselectedWhileDragging = ref([]);

  const initDragSelection = () => {
    const storeList = useStoreList();
    selectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );
    unselectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );
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
  };

  return {
    selectedWhileDragging,
    unselectedWhileDragging,
    initDragSelection,
    addRangeToDrag,
    removeRangeFromDrag,
    applyDraggingSelection,
  };
}
