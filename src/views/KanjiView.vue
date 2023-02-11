<template>
  <div>
    <div v-if="kanji.char !== ''" class="flex justify-center">
      <AppKanjiDetails :kanji="kanji" />
    </div>
    <div
      v-else
      class="flex justify-center place-items-center"
      :class="[
        storeOptions.showDetailsStrokeOrder
          ? storeOptions.gridUiMinHeight
          : storeOptions.gridUiMinHeightCompact,
      ]"
    >
      <p class="text-white text-4xl font-semibold text-opacity-80">
        Left click any kanji to select
      </p>
    </div>

    <AppKanjiGrid selectionType="single" @singleKanjiSelected="selectChar" />
  </div>
</template>

<script setup>
import { ref, reactive, provide } from "vue";
import AppKanjiDetails from "@/components/KanjiDetails/AppKanjiDetails.vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreOptions } from "@/stores/storeOptions";
import { useKanji } from "@/use/useKanji";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

const selectedChar = ref("");

const selectChar = async (char) => {
  await kanji.loadKanji(char);
};

const kanji = reactive(useKanji());
provide("kanji", { kanji, selectChar });
</script>

<style scoped></style>
