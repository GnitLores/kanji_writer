import { ref, computed } from "vue";

export function useWrite() {
  const nStrokes = ref(0);
  const nMistakesTotal = ref(0);
  const nMistakesCurrent = ref(0);
  const currentStroke = ref(0);

  const initWrite = (nrOfStrokes, startingStroke = 0) => {
    nStrokes.value = nrOfStrokes;
    nMistakesTotal.value = 0;
    nMistakesCurrent.value = 0;
    currentStroke.value = startingStroke;
  };

  const resetWrite = () => {
    initWrite(nStrokes.value);
  };

  const completeWrite = () => {
    nMistakesCurrent.value = 0;
    currentStroke.value = nStrokes.value;
  };

  const addMistake = () => {
    nMistakesTotal.value += 1;
    nMistakesCurrent.value += 1;
  };

  const addCorrect = () => {
    currentStroke.value += 1;
    nMistakesCurrent.value = 0;
  };

  const writeIsInitialized = computed(() => {
    return nStrokes.value > 0;
  });

  const writeIsActive = computed(() => {
    return writeIsInitialized && currentStroke.value < nStrokes.value;
  });

  return {
    nMistakesTotal,
    nMistakesCurrent,
    currentStroke,
    writeIsActive,
    initWrite,
    resetWrite,
    completeWrite,
    addMistake,
    addCorrect,
  };
}
