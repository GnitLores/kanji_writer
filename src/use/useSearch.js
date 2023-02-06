import { ref, watch } from "vue";
import { useDisplayData } from "@/use/useDisplayData";

const input = ref("");
const searchedChars = ref(new Set());
let isSearching = ref(false);
let searchBackgroundData = ref([]); // Displaydata stored while searching
let backgroundDataMap = ref(new Map()); // Map of stored displayData

export function useSearch() {
  const { displayData, displayMap, displayList, mapDisplayedKanji } =
    useDisplayData();

  const clearSearch = () => {
    input.value = "";
  };

  const onInputChange = (newInput, oldInput) => {
    if (newInput === oldInput) return;
    if (oldInput === "" && newInput !== "") startSearch();
    if (newInput === "" && oldInput !== "") stopSearch();

    if (newInput.length > oldInput.length)
      addChars(newInput.slice(oldInput.length));

    if (newInput.length < oldInput.length)
      removeChars(oldInput.slice(newInput.length));
  };

  const startSearch = () => {
    isSearching = true;
    searchBackgroundData.value = displayData.value;
    backgroundDataMap.value = displayMap.value;

    const level = {};
    level.kanji = [];
    level.name = "Search result";
    level.levelidx = 0;

    displayData.value = [level];
    displayData.value.nKanji = 0;
  };
  const stopSearch = () => {
    isSearching = false;
    mapDisplayedKanji(searchBackgroundData.value); // Restore indices of background data
    displayData.value = searchBackgroundData.value;
    searchBackgroundData.value = [];
    backgroundDataMap.value = [];
    searchedChars.value = new Set();
  };
  const addChars = (chars) => {
    for (var i = 0; i < chars.length; i++) {
      addChar(chars.charAt(i));
    }
  };
  const addChar = (char) => {
    if (searchedChars.value.has(char) || !backgroundDataMap.value.has(char))
      return;

    // Use references to the background data to track the selections, but temporarily change indices to match displayed search results
    const kanji = backgroundDataMap.value.get(char);
    kanji.cnt = searchedChars.value.size;
    kanji.idxInLevel = searchedChars.value.size;
    kanji.levelIdx = 0;

    searchedChars.value.add(char);
    displayData.value[0].kanji.push(kanji);
    displayData.value[0].nKanji += 1;
    displayData.nKanji += 1;
    displayMap.value.set(kanji.char, kanji);
    displayList.value.push(kanji);
    console.log(kanji);
  };
  const removeChars = (chars) => {
    for (var i = 0; i < chars.length; i++) {
      removeChar(chars.charAt(i));
    }
  };
  const removeChar = (char) => {
    console.log("remove", char);
  };

  return { input, clearSearch, onInputChange };
}
