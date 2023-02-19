<template>
  <div class="w-fit select-none my-2">
    <div class="flex justify-evenly my-1">
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          :disabled="!writerSettings.canToggleLines"
          v-model="writerSettings.showLines"
          @change="toggleLines()"
        />
        <label
          class="text-sky-100 font-bold ml-1"
          :class="{ 'text-opacity-50': !writerSettings.canToggleLines }"
          >Lines</label
        >
      </div>
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          :disabled="!writerSettings.canToggleOutline"
          v-model="writerSettings.showOutline"
          @change="toggleOutline()"
        />
        <label
          class="text-sky-100 font-bold ml-1"
          :class="{ 'text-opacity-50': !writerSettings.canToggleOutline }"
          >Outline</label
        >
      </div>
      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          :disabled="!writerSettings.canToggleHints"
          v-model="writerSettings.showHints"
          @change="toggleHints()"
        />
        <label
          class="text-sky-100 font-bold ml-1"
          :class="{ 'text-opacity-50': !writerSettings.canToggleHints }"
          >Hints</label
        >
      </div>

      <div class="inline-block ml-2">
        <input
          class=""
          type="checkbox"
          :disabled="!writerSettings.canToggleStrokes"
          v-model="writerSettings.showStrokes"
          @change=""
        />
        <label
          class="text-sky-100 font-bold ml-1"
          :class="{ 'text-opacity-50': !writerSettings.canToggleStrokes }"
          >Strokes</label
        >
      </div>
    </div>

    <div class="flex justify-center bg-darkmode-700">
      <AppWritingField ref="writerRef" />
    </div>

    <div class="flex justify-evenly mt-2">
      <AppButton
        :disabled="
          !writerSettings.canManualHint || !writeIsActive || animationIsPlaying
        "
        :text="'Hint'"
        class="w-20 py-1"
        @clicked="giveHint()"
      />
      <AppButton
        :disabled="!writerSettings.canAnimate || !kanji.char === ''"
        :text="'Animate'"
        class="w-20 py-1"
        @clicked="showWritingAnimation()"
      />
      <AppButton
        :disabled="!writerSettings.canReset || !kanji.char === ''"
        :text="'Reset'"
        class="w-20 py-1"
        @clicked="startWriting()"
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

const writerRef = ref(null);

const { kanji } = inject("kanji");
const writerSettings = inject("writerSettings");

const {
  writeIsActive,
  writeIsComplete,
  animationIsPlaying,
  startWriting,
  showWritingAnimation,
  giveHint,
  displayStroke,
  toggleHints,
  toggleLines,
  toggleOutline,
  stopWriting,
} = useWrite(writerRef, writerSettings, kanji);

const onStrokeOrderClicked = (strokeNr, nStrokes) => {
  displayStroke(strokeNr, nStrokes);
};

watch(kanji, () => {
  if (kanji.char === "") return;
  startWriting();
});

const emit = defineEmits(["writeComplete"]);
watch(writeIsComplete, () => {
  if (writeIsComplete.value) emit("writeComplete");
});

onMounted(() => {
  if (kanji.char === "") return;
  startWriting();
});
onBeforeUnmount(() => {
  stopWriting();
});

defineExpose({
  displayStroke,
  stopWriting,
});
</script>

<style scoped></style>
