<template>
  <div class="flex justify-center my-2 select-none">
    <div class="inline-block">
      <div class="flex justify-evenly w-72">
        <AppButton
          :disabled="nextKanji == storeKanji.char"
          :text="`Previous - ${prevKanji}`"
          class="w-32 text-lg h-10"
          @clicked="previousButtonClicked"
        />
        <AppButton
          :disabled="nextKanji == storeKanji.char"
          :text="`Next - ${nextKanji}`"
          class="w-32 text-lg h-10"
          @clicked="nextButtonClicked"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";
import AppButton from "@/components/AppButton.vue";
import { useDisplayData } from "@/use/useDisplayData";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

let prevKanji = ref("");
let nextKanji = ref("");

const { getDisplayedKanjiRelative } = useDisplayData();

const { kanjiData } = storeToRefs(storeKanji);

const previousButtonClicked = () => {
  storeKanji.loadKanji(prevKanji.value);
};

const nextButtonClicked = () => {
  storeKanji.loadKanji(nextKanji.value);
};

const findAdjacentKanji = () => {
  if (storeKanji.char === "") return;
  prevKanji.value = getDisplayedKanjiRelative(storeKanji.char, -1).char;
  nextKanji.value = getDisplayedKanjiRelative(storeKanji.char, 1).char;
};

watch(kanjiData, findAdjacentKanji);

onMounted(() => {
  findAdjacentKanji();
});
</script>

<style scoped></style>
