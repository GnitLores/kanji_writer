<template>
  <div class="w-fit select-none my-2">
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
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          v-model="storeOptions.showLines"
          @change="onShowLinesChange()"
        />
        <label class="text-sky-100 font-bold ml-1">Lines</label>
      </div>
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          v-model="storeOptions.showDetailsStrokeOrder"
          @change="onShowStrokesChange()"
        />
        <label class="text-sky-100 font-bold ml-1">Strokes</label>
      </div>
    </div>

    <div class="flex justify-center bg-darkmode-700">
      <AppWritingField
        ref="writerRef"
        @mistakeMade="addCorrect()"
        @correctStrokeMade="addMistake()"
        :writeIsActive="writeIsActive"
        :currentStroke="currentStroke"
      />
    </div>

    <div class="flex justify-evenly mt-2">
      <AppButton
        :disabled="!writeIsActive || animationIsPlaying"
        :text="'Hint'"
        class="w-20 py-1"
        @clicked="onHintClicked()"
      />
      <AppButton
        :disabled="!kanji.char === ''"
        :text="'Animate'"
        class="w-20 py-1"
        @clicked="onShowClicked()"
      />
      <AppButton
        :disabled="!kanji.char === ''"
        :text="'Reset'"
        class="w-20 py-1"
        @clicked="onResetClicked()"
      />
    </div>

    <AppStrokeOrderVisualization
      class="mt-4"
      @strokeOrderClicked="onStrokeOrderClicked"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useWrite } from "@/use/useWrite";
import AppWritingField from "@/components/AppWritingField.vue";
import AppButton from "@/components/AppButton.vue";
import AppStrokeOrderVisualization from "@/components/KanjiDetails/AppStrokeOrderVisualization.vue";

const storeOptions = useStoreOptions();

const {
  currentStroke,
  writeIsActive,
  initWrite,
  completeWrite,
  addMistake,
  addCorrect,
} = useWrite();

const writerRef = ref(null);
const animationIsPlaying = ref(false);
let hintTimer = null;

const { kanji } = inject("kanji");

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
  if (!storeOptions.showDetailsHints || !writeIsActive.value) return;
  cancelHints();
  hintTimer = setTimeout(writerRef.value.giveHint, storeOptions.hintDelay);
};

const cancelHints = () => {
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = null;
};

const startWriting = (strokeNr = 0) => {
  cancelHints();
  initWrite(kanji.nStrokes, strokeNr);

  const writerProps = {
    showHintAfterMisses: 3,
    quizStartStrokeNum: strokeNr,
    showOutline: storeOptions.showDetailsOutline,
  };
  const quizOptions = {
    onCorrectStroke: (status) => {
      addCorrect();
      scheduleHint();
    },
  };

  writerRef.value.startQuiz(writerProps, quizOptions);
  animationIsPlaying.value = false;
  scheduleHint();
};

const displayStroke = (strokeNr, nStrokes) => {
  if (strokeNr < nStrokes) {
    startWriting(strokeNr);
  } else {
    completeWrite();
    writerRef.value.completeQuiz();
  }
};

const onShowOutlineChange = () => {
  writerRef.value.toggleOutline(storeOptions.showDetailsOutline);
};

const onShowHintsChange = () => {
  storeOptions.showDetailsHints ? writerRef.value.giveHint() : cancelHints();
};

const onShowLinesChange = () => {
  writerRef.value.toggleCenterLines();
};

const onShowStrokesChange = () => {
  console.log(storeOptions.showDetailsStrokeOrder);
};

const onStrokeOrderClicked = (strokeNr, nStrokes) => {
  displayStroke(strokeNr, nStrokes);
};

watch(kanji, () => {
  if (kanji.char === "") return;
  startWriting();
});

onMounted(() => {
  if (kanji.char === "") return;
  startWriting();
});
onBeforeUnmount(() => {
  cancelHints();
  writerRef.value.cancelQuiz();
});

defineExpose({
  displayStroke,
});
</script>

<style scoped></style>
