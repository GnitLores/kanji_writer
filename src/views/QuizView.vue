<template>
  <div class="flex justify-center place-items-center h-[400px]">
    <p class="text-white text-4xl font-semibold text-opacity-80">Quiz</p>
  </div>
  <div><AppKanjiGrid /></div>
</template>

<script setup>
import { provide, onBeforeMount } from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useSelection } from "@/use/useSelection";

const storeOptions = useStoreOptions();

provide("selectionType", { selectionType: "range" });

const { initSelected } = useSelection();
onBeforeMount(() => {
  initSelected();
});
</script>

<style scoped></style>
