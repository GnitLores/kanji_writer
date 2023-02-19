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

  const disableWriting = () => {
    canToggleHints.value = false;
    showHints.value = false;
    canToggleOutline.value = false;
    showOutline.value = false;
    canToggleStrokes.value = false;
    showStrokes.value = false;
    canToggleLines.value = false;
    canReset.value = false;
    canAnimate.value = false;
    canManualHint.value = false;
  };

  const initLearningStepLearn = () => {
    initSettings();
    canToggleHints.value = false;
    canToggleOutline.value = false;
    showHints.value = true;
    showOutline.value = true;
  };
  const initLearningStepReinforce = () => {
    initSettings();
    canToggleHints.value = false;
    canToggleOutline.value = false;
    canToggleStrokes.value = false;
    showHints.value = true;
    showOutline.value = false;
    showStrokes.value = false;
    canAnimate.value = false;
    canReset.value = false;
  };
  const initLearningStepQuiz = () => {
    initSettings();
    canToggleHints.value = false;
    canToggleOutline.value = false;
    canToggleStrokes.value = false;
    showHints.value = false;
    showOutline.value = false;
    showStrokes.value = false;
    canAnimate.value = false;
    canReset.value = false;
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
    disableWriting,
    initLearningStepLearn,
    initLearningStepReinforce,
    initLearningStepQuiz,
  };
}
