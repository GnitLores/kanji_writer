<template>
  <div>
    <div class="flex justify-center">
      <div class="text-white">{{ currentReview.stepType }}</div>
    </div>
    <div class="flex mt-2">
      <div class="flex-1"></div>
      <div class="w-[300px] flex justify-center flex-wrap">
        <div class="flex justify-center w-full">
          <div class="tooltip">
            <AppButton
              :disabled="currentReview.stepType === 'none'"
              :text="canFail ? 'Fail' : 'Repeat'"
              class="w-28 h-10 text-lg"
              @clicked="fail"
            >
              <i class="fas fa-times text-red-400 text-opacity-70 ml-2"></i>
            </AppButton>
            <span class="tooltiptext tooltip-bottom arrow-top"
              >{{
                canFail
                  ? "Fail review and try again later."
                  : "Return to review queue and repeat later."
              }}
            </span>
          </div>
          <div class="tooltip">
            <AppButton
              :disabled="currentReview.stepType === 'none'"
              :text="canFail ? 'Pass' : 'Ready'"
              class="w-28 h-10 text-lg ml-8"
              @clicked="pass"
            >
              <i class="fas fa-check text-green-400 text-opacity-70 ml-2"></i
            ></AppButton>
            <span class="tooltiptext tooltip-bottom arrow-top"
              >{{
                canFail
                  ? "Pass review and continue."
                  : "Continue learning quiz."
              }}
            </span>
          </div>
        </div>
        <AppWriting />
      </div>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide, markRaw, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
// import AppLearningStepLearn from "@/components/Learn/AppLearningStepLearn.vue";
import AppWriting from "@/components/AppWriting.vue";
import { useLearningQuiz } from "@/use/useLearningQuiz";
import { useKanji } from "@/use/useKanji";
import { useWriterSettings } from "@/use/useWriterSettings";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeOptions = useStoreOptions();

const {
  currentReview,
  startQuiz,
  failCurrentReview,
  passCurrentReview,
  popNextReview,
} = useLearningQuiz();
const canFail = computed(() => currentReview.value.stepType === "quiz");

const currentKanji = reactive(useKanji());
provide("kanji", { kanji: currentKanji });

const loadCurrentKanji = async () => {
  await currentKanji.loadKanji(currentReview.value.char);
};

const writerSettings = reactive(useWriterSettings());
provide("writerSettings", writerSettings);

const displayReview = async () => {
  if (currentReview.value.stepType === "none") {
    console.log("quiz over");
    return;
  }
  if (currentReview.value.stepType === "learn")
    writerSettings.initLearningStepLearn();
  if (currentReview.value.stepType === "reinforce")
    writerSettings.initLearningStepReinforce();
  if (currentReview.value.stepType === "quiz")
    writerSettings.initLearningStepQuiz();
  await loadCurrentKanji();
};

const fail = () => {
  failCurrentReview();
  popNextReview();
  displayReview();
};

const pass = () => {
  passCurrentReview();
  popNextReview();
  displayReview();
};

startQuiz();
displayReview();
</script>

<style scoped></style>
