<template>
  <div>
    <div v-if="kanji.char !== ''" class="flex justify-center">
      <AppKanjiDetails :detailsType="'view'" :kanji="kanji" />
    </div>
    <div
      v-else
      class="flex justify-center place-items-center"
      :class="[storeOptions.showDetailsStrokeOrder ? 'h-[550px]' : 'h-[400px]']"
    >
      <p class="text-white text-4xl font-semibold text-opacity-80">
        Left click any kanji to select
      </p>
    </div>

    <AppKanjiGrid @singleKanjiSelected="selectChar" />
  </div>
</template>

<script setup>
import { reactive, provide, onBeforeMount } from "vue";
import AppKanjiDetails from "@/components/KanjiDetails/AppKanjiDetails.vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useKanji } from "@/use/useKanji";
import { useSelection } from "@/use/useSelection";

const storeOptions = useStoreOptions();

const selectChar = async (char) => {
  await kanji.loadKanji(char);
};

const kanji = reactive(useKanji());

provide("selectionType", { selectionType: "single" });

const { initSelected } = useSelection();
onBeforeMount(() => {
  initSelected();
});
</script>

<style scoped></style>
