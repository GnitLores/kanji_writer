import { ref } from "vue";

export function useWriterSettings() {
  let canToggleHints = ref(true);
  let showHints = ref(true);
  let canToggleOutline = ref(true);
  let showOutline = ref(true);
  let canToggleStrokes = ref(true);
  let showStrokes = ref(true);
  let canToggleLines = ref(true);
  let showLines = ref(true);
  let canReset = ref(true);
  let canAnimate = ref(true);
  let canManualHint = ref(true);

  const initSettings = () => {
    canToggleHints.value = true;
    showHints.value = true;
    canToggleOutline.value = true;
    showOutline.value = true;
    canToggleStrokes.value = true;
    showStrokes.value = true;
    canToggleLines.value = true;
    showLines.value = true;
    canReset.value = true;
    canAnimate.value = true;
    canManualHint.value = true;
  };

  const initLearningQuizLearn = () => {
    initSettings();
    canToggleHints.value = false;
    canToggleOutline.value = false;
    showHints.value = true;
    showOutline.value = true;
  };

  return {
    canToggleHints,
    showHints,
    canToggleOutline,
    showOutline,
    canToggleStrokes,
    showStrokes,
    canToggleLines,
    showLines,
    canReset,
    canAnimate,
    canManualHint,
    initSettings,
    initLearningQuizLearn,
  };
}
