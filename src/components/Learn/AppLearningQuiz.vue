<template>
  <div>
    <div class="relative bg-gray-600 text-center h-1 w-full">
      <span
        class="absolute inset-0 bg-sky-700 bg-opacity-70 h-1"
        :style="{
          width: `${100 * (nCorrectBatchReviews / nBatchReviews)}%`,
        }"
      ></span>
    </div>
    <div class="flex mt-2">
      <div class="flex-1 flex justify-start"></div>
      <div class="w-[300px] flex justify-center flex-wrap">
        <div class="flex w-full">
          <div class="flex-1"></div>
          <div class="w-fit flex justify-center">
            <div class="text-white text-xl font-semibold">
              <span class="capitalize">{{ `${currentReview.stepType}` }}</span>
              <span class="">
                {{
                  ` (${
                    nCorrectReviewsPrKanji.get(currentReview.char) + 1
                  } of ${nReviewsPrKanji})`
                }}
              </span>
            </div>
          </div>
          <div class="flex-1 flex justify-end place-items-center">
            <AppButton
              :disabled="currentReview.stepType === 'none'"
              :text="'Stop'"
              class="w-14 h-6 text-sm"
              @clicked="stopQuizClicked"
            />
          </div>
          <AppConfirmationDialog
            ref="stopQuizDialogRef"
            :text="'Stop quiz without learning kanji with reviews remaining?'"
            @onConfirm="stopQuiz"
            @onCancel=""
          />
        </div>

        <div class="flex justify-center w-full mt-2">
          <div class="tooltip">
            <AppButton
              :disabled="!kanjiLoaded || currentReview.stepType === 'none'"
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
              :disabled="!kanjiLoaded || currentReview.stepType === 'none'"
              :text="isFinalReview ? 'Finish' : canFail ? 'Pass' : 'Ready'"
              class="w-28 h-10 text-lg ml-8"
              @clicked="pass"
            >
              <i
                class="fas fa-check text-opacity-70 ml-2"
                :class="[isFinalReview ? 'text-sky-400' : 'text-green-400']"
              ></i
            ></AppButton>
            <span class="tooltiptext tooltip-bottom arrow-top"
              >{{
                isFinalReview
                  ? "Pass final review and return to learning quiz setup."
                  : canFail
                  ? "Pass review and continue."
                  : "Continue learning quiz."
              }}
            </span>
          </div>
        </div>
        <AppWriting ref="writerRef" @writeComplete="onWriteComplete" />
      </div>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide, onMounted, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
// import AppLearningStepLearn from "@/components/Learn/AppLearningStepLearn.vue";
import AppWriting from "@/components/AppWriting.vue";
import { useLearningQuiz } from "@/use/useLearningQuiz";
import { useKanji } from "@/use/useKanji";
import { useWriterSettings } from "@/use/useWriterSettings";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeOptions = useStoreOptions();

const writerRef = ref(null);
const stopQuizDialogRef = ref(null);
const kanjiLoaded = ref(false);

const {
  currentReview,
  nBatchReviews,
  nCorrectBatchReviews,
  nReviewsPrKanji,
  nCorrectReviewsPrKanji,
  isFinalReview,
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
  kanjiLoaded.value = false;
  writerSettings.disableWriting();
  writerRef.value.stopWriting();

  if (currentReview.value.stepType === "none") return;

  await loadCurrentKanji();

  if (currentReview.value.stepType === "learn")
    writerSettings.initLearningStepLearn();
  if (currentReview.value.stepType === "reinforce")
    writerSettings.initLearningStepReinforce();
  if (currentReview.value.stepType === "quiz")
    writerSettings.initLearningStepQuiz();

  kanjiLoaded.value = true;
};

const fail = () => {
  failCurrentReview();
  popNextReview();
  displayReview();
};

const pass = () => {
  passCurrentReview();
  popNextReview();

  if (currentReview.value.stepType === "none") stopQuiz();

  displayReview();
};

const stopQuizClicked = () => {
  stopQuizDialogRef.value.showDialog();
};

const onWriteComplete = () => {
  writerSettings.enableAllSettings();
};

const emit = defineEmits(["stopQuiz"]);
const stopQuiz = () => {
  emit("stopQuiz");
};

onMounted(() => {
  startQuiz();
  displayReview();
});
</script>

<style scoped></style>
