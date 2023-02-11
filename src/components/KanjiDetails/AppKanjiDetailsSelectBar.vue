<template>
  <div class="flex justify-center my-2 select-none">
    <div class="inline-block">
      <div class="flex justify-evenly w-72">
        <AppButton
          :disabled="!prevKanji || prevKanji == kanji.char"
          :text="`Previous - ${prevKanji}`"
          class="w-32 text-lg h-10"
          @clicked="previousButtonClicked"
        />
        <AppButton
          :disabled="!nextKanji || nextKanji == kanji.char"
          :text="`Next - ${nextKanji}`"
          class="w-32 text-lg h-10"
          @clicked="nextButtonClicked"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import AppButton from "@/components/AppButton.vue";
import { useDisplayData } from "@/use/useDisplayData";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

const { kanji } = inject("kanji");

let prevKanji = ref("");
let nextKanji = ref("");

const { displayData, getDisplayedKanjiRelative, isKanjiDisplayed } =
  useDisplayData();

const previousButtonClicked = () => {
  kanji.loadKanji(prevKanji.value);
};

const nextButtonClicked = () => {
  kanji.loadKanji(nextKanji.value);
};

const findAdjacentKanji = () => {
  if (kanji.char === "") return;
  prevKanji.value = getDisplayedKanjiRelative(kanji.char, -1).char;
  nextKanji.value = getDisplayedKanjiRelative(kanji.char, 1).char;
};

const onDisplayDataUpdated = () => {
  if (!isKanjiDisplayed(kanji.char)) {
    prevKanji.value = "";
    nextKanji.value = "";
  } else {
    findAdjacentKanji();
  }
};

watch(displayData, onDisplayDataUpdated);

onMounted(() => {
  findAdjacentKanji();
});
</script>

<style scoped></style>
