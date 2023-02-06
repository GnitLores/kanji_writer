import { ref, watch } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import { useSelectionStats } from "@/use/useSelectionStats";

const displayData = ref([]);
let displayMap = ref(new Map());
let displayList = ref([]);

export function useDisplayData() {
  const storeOptions = useStoreOptions();
  const storeList = useStoreList();

  const updateDisplayData = () => {
    let data = createDataDeepCopy();
    data = filterIgnoredLevels(data);

    if (storeOptions.reverseOrder) data = setReverseOrder(data);
    if (!storeOptions.doDisplayLevels) data = collapseLevels(data);

    // When data is finalized, map all displayed kanji to indices.
    mapDisplayedKanji(data);
    displayData.value = data;
  };

  const createDataDeepCopy = () => {
    // Create deep copy of kanji sorted by levels:
    return JSON.parse(JSON.stringify(storeList.kanjiByLevel));
  };

  const filterIgnoredLevels = (data) => {
    let nKanjiIncluded = 0;
    const filtered = [];
    data.forEach((level) => {
      if (!storeOptions.isLevelIgnored(level.name)) {
        filtered.push(level);
        nKanjiIncluded += level.kanji.length;
      }
    });

    filtered.nKanji = nKanjiIncluded;
    return filtered;
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
        map.set(kanji.char, kanji);
        list.push(kanji);
        cnt += 1;
      });
      level.levelIdx = levelIdx;
    });
    displayMap.value = map;
    displayList.value = list;
  };

  const getDisplayedKanjiByChar = (char) => {
    return displayMap.value.get(char);
  };

  const getDisplayedKanjiByCount = (cnt) => {
    return displayList.value[cnt];
  };

  return {
    displayData,
    displayList,
    displayMap,
    updateDisplayData,
    getDisplayedKanjiByChar,
    getDisplayedKanjiByCount,
    mapDisplayedKanji,
  };
}
