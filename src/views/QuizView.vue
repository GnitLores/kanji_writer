<template>
  <div
    class="flex justify-center place-items-center"
    :class="[
      storeOptions.showDetailsStrokeOrder
        ? storeOptions.detailsUiMinHeight
        : storeOptions.detailsUiMinHeightCompact,
    ]"
  >
    <p class="text-white text-4xl font-semibold text-opacity-80">Quiz</p>
  </div>
  <div><AppKanjiGrid /></div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();
</script>

<style scoped></style>
