import { ref } from "vue";
import { useStoreList } from "@/stores/storeList";
import { useDisplayData } from "@/use/useDisplayData";
import { useSelection } from "@/use/useSelection";

export function useDragSelection() {
  const { displayList } = useDisplayData();
  const { applyForAll, isSelected, selectKanji } = useSelection();

  const selectedWhileDragging = ref([]);
  const unselectedWhileDragging = ref([]);

  let isDragging = ref(false);
  let isUnselecting = false;
  let startDragCnt = -1;
  let minCnt = -1;
  let maxCnt = -1;

  const initDragSelection = () => {
    const storeList = useStoreList();
    selectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );
    unselectedWhileDragging.value = new Array(storeList.kanjiList.length).fill(
      false
    );
  };

  const startDrag = (kanji, doUnselect) => {
    isDragging.value = true;
    isUnselecting = doUnselect;
    startDragCnt = kanji.cnt;
    minCnt = startDragCnt;
    maxCnt = startDragCnt;
    initDragSelection();
    addRangeToDrag(minCnt, maxCnt);
  };

  const updateDrag = (kanji) => {
    if (!isDragging.value) return;
    const cnt = kanji.cnt;

    // If there is a current selection and the mouse is moved outside any char to a char on the opposite side of the first clicked char, the direction of the selection has been flipped.
    // Undo the existing selection before continuing.
    if (maxCnt == startDragCnt && cnt >= startDragCnt) {
      // Direction was flipped from decreasing to increasing
      removeRangeFromDrag(minCnt, startDragCnt - 1);
      minCnt = startDragCnt;
    } else if (minCnt == startDragCnt && cnt <= startDragCnt) {
      // Direction was flipped from increasing to decreasing
      removeRangeFromDrag(startDragCnt + 1, maxCnt);
      maxCnt = startDragCnt;
    }

    if (cnt < minCnt) {
      // The selection is expanded in decreasing direction
      addRangeToDrag(cnt, minCnt);
      minCnt = cnt;
    } else if (cnt > maxCnt) {
      // The selection is expanded in increasing direction
      addRangeToDrag(maxCnt, cnt);
      maxCnt = cnt;
    } else if (cnt < startDragCnt) {
      // An existing selection in decreasing direction is contracted
      removeRangeFromDrag(minCnt, cnt);
      minCnt = cnt;
    } else if (cnt > startDragCnt) {
      // An existing selection in increasing direction is contracted
      removeRangeFromDrag(cnt, maxCnt);
      maxCnt = cnt;
    }
  };

  const stopDrag = (kanji = null) => {
    if (!isDragging.value) return;
    if (kanji && kanji.cnt == startDragCnt) {
      selectKanji(kanji, !isUnselecting);
    } else {
      applyDraggingSelection();
    }

    isDragging.value = false;
    isUnselecting = false;
    startDragCnt = -1;
    minCnt = -1;
    maxCnt = -1;
  };

  const addRangeToDrag = (min, max) => {
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
    isDragging,
    selectedWhileDragging,
    unselectedWhileDragging,
    startDrag,
    updateDrag,
    stopDrag,
  };
}
