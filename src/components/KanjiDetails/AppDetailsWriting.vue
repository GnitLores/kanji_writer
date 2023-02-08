<template>
  <div class="p-4">
    <div class="flex justify-evenly my-1">
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          v-model="storeOptions.showDetailsOutline"
          @change="onShowOutlineChange()"
        />
        <label class="text-sky-100 font-bold ml-1">Outline</label>
      </div>
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          v-model="storeOptions.showDetailsHints"
          @change="onShowHintsChange()"
        />
        <label class="text-sky-100 font-bold ml-1">Hints</label>
      </div>
    </div>
    <AppWritingField ref="writerRef" />
    <div class="flex justify-evenly mt-2">
      <AppButton
        :disabled="
          !storeQuiz.quizIsActive ||
          animationIsPlaying ||
          !storeQuiz.strokesRemain
        "
        :text="'Hint'"
        class=""
        @clicked="onHintClicked()"
      />
      <AppButton
        :disabled="!storeQuiz.quizIsActive || !storeQuiz.strokesRemain"
        :text="'Show'"
        class=""
        @clicked="onShowClicked()"
      />
      <AppButton
        :disabled="!storeQuiz.quizIsActive"
        :text="'Reset'"
        class=""
        @clicked="onResetClicked()"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { useStoreQuiz } from "@/stores/storeQuiz";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreOptions } from "@/stores/storeOptions";
import AppWritingField from "@/components/AppWritingField.vue";
import AppButton from "@/components/AppButton.vue";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();
const storeOptions = useStoreOptions();

const writerRef = ref(null);
const animationIsPlaying = ref(false);
let hintTimer = null;

const onHintClicked = () => {
  writerRef.value.giveHint();
};

const onShowClicked = () => {
  showWritingAnimation();
};

const onResetClicked = () => {
  startWriting();
};

const showWritingAnimation = () => {
  animationIsPlaying.value = true;
  writerRef.value.animate(startWriting);
};

const scheduleHint = () => {
  if (!storeOptions.showDetailsHints) return;
  cancelHints();
  hintTimer = setTimeout(writerRef.value.giveHint, storeOptions.hintDelay);
};

const cancelHints = () => {
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = null;
};

const startWriting = () => {
  storeQuiz.initQuiz(storeKanji.char);

  const writerProps = {
    showHintAfterMisses: 3,
    showOutline: storeOptions.showDetailsOutline,
  };
  const quizOptions = {
    onCorrectStroke: (status) => {
      writerRef.value.markStrokeCorrect(status);
      scheduleHint();
    },
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
  animationIsPlaying.value = false;
  scheduleHint();
};

const onShowOutlineChange = () => {
  writerRef.value.toggleOutline(storeOptions.showDetailsOutline);
};

const onShowHintsChange = () => {
  storeOptions.showDetailsHints ? writerRef.value.giveHint() : cancelHints();
};

onMounted(() => {
  startWriting();
});
</script>

<style scoped></style>
