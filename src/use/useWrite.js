import { ref, computed } from "vue";
// import { useStoreOptions } from "@/stores/storeOptions";

export function useWrite(writerRef, writerSettings, kanji) {
  // const storeOptions = useStoreOptions();

  const nStrokes = ref(0);
  const nMistakesTotal = ref(0);
  const nMistakesCurrent = ref(0);
  const currentStroke = ref(0);
  const animationIsPlaying = ref(false);

  let hintTimer = null;

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

  const writeIsComplete = computed(() => {
    return writeIsInitialized && currentStroke.value === nStrokes.value;
  });

  const startWriting = (strokeNr = 0) => {
    cancelHints();
    initWrite(kanji.nStrokes, strokeNr);

    const writerProps = {
      showHintAfterMisses: 3,
      quizStartStrokeNum: strokeNr,
      showOutline: writerSettings.showOutline,
    };
    const quizOptions = {
      onCorrectStroke: (status) => {
        addCorrect();
        scheduleHint();
      },
      onMistake: (status) => {
        addMistake();
      },
    };

    writerRef.value.startQuiz(writerProps, quizOptions);
    animationIsPlaying.value = false;
    scheduleHint();
  };

  const showWritingAnimation = () => {
    animationIsPlaying.value = true;
    writerRef.value.animate(startWriting);
  };

  const giveHint = () => {
    if (writeIsActive.value)
      writerRef.value.highlightStroke(currentStroke.value);
  };

  const scheduleHint = () => {
    if (!writerSettings.showHints || !writeIsActive.value) return;
    cancelHints();
    hintTimer = setTimeout(giveHint, 500);
  };

  const cancelHints = () => {
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = null;
  };

  const displayStroke = (strokeNr, nStrokes) => {
    if (strokeNr < nStrokes) {
      startWriting(strokeNr);
    } else {
      completeWrite();
      writerRef.value.completeQuiz();
    }
  };

  const toggleHints = () => {
    writerSettings.showHints ? giveHint() : cancelHints();
  };

  const toggleLines = () => {
    writerRef.value.toggleCenterLines();
  };

  const toggleOutline = () => {
    writerRef.value.toggleOutline(writerSettings.showOutline);
  };

  const stopWriting = () => {
    cancelHints();
    writerRef.value.cancelQuiz();
  };

  return {
    nMistakesTotal,
    nMistakesCurrent,
    currentStroke,
    writeIsActive,
    writeIsComplete,
    animationIsPlaying,
    resetWrite,
    completeWrite,
    addMistake,
    addCorrect,
    startWriting,
    showWritingAnimation,
    giveHint,
    displayStroke,
    toggleHints,
    toggleLines,
    toggleOutline,
    stopWriting,
  };
}
