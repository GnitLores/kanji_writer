<template>
  <div class="p-4">
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

const startWriting = () => {
  storeQuiz.initQuiz(storeKanji.char);

  const writerProps = {
    showHintAfterMisses: 1,
    showOutline: true,
  };
  const quizOptions = {
    onCorrectStroke: (status) => {
      writerRef.value.markStrokeCorrect(status);
      setTimeout(writerRef.value.giveHint, storeOptions.hintDelay);
    },
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
  animationIsPlaying.value = false;
  setTimeout(writerRef.value.giveHint, storeOptions.hintDelay);
};

onMounted(() => {
  startWriting();
});
</script>

<style scoped></style>
