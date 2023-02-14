import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { kanjiCollection } from "@/includes/firebase";

const cachedKanji = new Map(); // Cache loaded data to reduce number of requests
const maxCacheSize = 0; // max number of kanji to cache, 0 = no limit

export function useKanji() {
  const char = ref("");
  const writingData = ref({});
  const nStrokes = ref(0);
  const data = ref({});

  const init = () => {
    char.value = "";
    writingData.value = {};
    nStrokes.value = 0;
    data.value = {};
  };

  const loadKanji = async (charToLoad) => {
    let loadedData = null;
    if (cachedKanji.has(charToLoad)) {
      loadedData = loadFromCache(charToLoad);
    } else {
      const docRef = doc(kanjiCollection, charToLoad);
      const snapshot = await getDoc(docRef);
      loadedData = snapshot.data();
    }

    writingData.value = JSON.parse(loadedData.data);
    nStrokes.value = writingData.value.strokes.length;
    char.value = loadedData.kanji;
    data.value = loadedData;

    saveToCache(loadedData);
  };

  const saveToCache = () => {
    cachedKanji.set(char.value, data.value);
    if (maxCacheSize > 0 && cachedKanji.size > maxCacheSize)
      cachedKanji.delete(cachedKanji.keys().next().value); // Delete earliest entry
  };

  const loadFromCache = (charToLoad) => {
    return cachedKanji.get(charToLoad);
  };

  return { char, writingData, nStrokes, data, init, loadKanji };
}
