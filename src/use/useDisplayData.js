import { ref, watch } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";

const displayData = ref([]);
let displayMap = ref(new Map());
let displayList = ref([]);
let backgroundData = ref([]); // Displaydata stored while searching
let backgroundMap = ref(new Map());

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

    backgroundData.value = displayData.value;
    backgroundMap.value = displayMap.value;
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

  const getDisplayedKanjiByCountWrapping = (cnt) => {
    if (cnt < 0) cnt += displayData.value.nKanji;
    if (cnt >= displayData.value.nKanji) cnt -= displayData.value.nKanji;
    return displayList.value[cnt];
  };

  const getDisplayedKanjiRelative = (char, offset = 0) => {
    // Based on an input character, returns the kanji displayed the number of offset fields after that character.
    // e.g. char = 力 and offset = -1 returns the kanji displayed to the left of 力
    // The method wraps around when either end is reached.
    const kanji = getDisplayedKanjiByChar(char);
    return getDisplayedKanjiByCountWrapping(kanji.cnt + offset);
  };

  return {
    displayData,
    displayList,
    displayMap,
    backgroundData,
    backgroundMap,
    updateDisplayData,
    getDisplayedKanjiByChar,
    getDisplayedKanjiRelative,
    mapDisplayedKanji,
  };
}
