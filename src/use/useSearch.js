import { ref } from "vue";
import { useDisplayData } from "@/use/useDisplayData";

const input = ref("");
let isSearching = ref(false);

export function useSearch() {
  const { displayData, backgroundData, backgroundMap, mapDisplayedKanji } =
    useDisplayData();

  const clearSearch = () => {
    input.value = "";
    stopSearch();
  };

  const startSearch = () => {
    if (input === "") stopSearch();
    isSearching.value = true;

    const level = {};
    level.kanji = [];
    level.name = "Search results";
    level.levelidx = 0;
    level.kanji = parseInput();

    displayData.value = [level];
    displayData.value.nKanji = level.kanji.length;
    mapDisplayedKanji(displayData.value);
  };

  const stopSearch = () => {
    isSearching.value = false;
    mapDisplayedKanji(backgroundData.value); // Restore indices of background data
    displayData.value = backgroundData.value;
  };

  const parseInput = () => {
    const kanjiList = [];
    const uniqueChars = findUnique(input.value);
    for (var i = 0; i < uniqueChars.length; i++) {
      const char = uniqueChars.charAt(i);
      if (!backgroundMap.value.has(char)) continue; // If the character was not displayed, don't add it to search

      const kanji = {
        char,
        cnt: i,
        levelIdx: 0,
        idxInLevel: i,
        mainIdx: backgroundMap.value.get(char).mainIdx,
      };
      kanjiList.push(kanji);
    }
    return kanjiList;
  };

  function findUnique(str) {
    str = str.split(""); // Split the string to make array
    str = new Set(str); // Create a set using array
    str = [...str].join(""); // Convert the set into array using spread operator and join it to make string
    return str;
  }

  return { input, isSearching, startSearch, clearSearch };
}
