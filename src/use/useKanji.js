import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { kanjiCollection } from "@/includes/firebase";

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
    const docRef = doc(kanjiCollection, charToLoad);
    const snapshot = await getDoc(docRef);
    const loadedData = snapshot.data();

    writingData.value = JSON.parse(loadedData.data);
    nStrokes.value = writingData.value.strokes.length;
    char.value = loadedData.kanji;
    data.value = loadedData;

    console.log(loadedData);
  };

  return { char, writingData, nStrokes, data, init, loadKanji };
}
