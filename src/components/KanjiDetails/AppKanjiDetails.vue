<template>
  <div
    class="container"
    :class="[
      storeOptions.showDetailsStrokeOrder
        ? storeOptions.gridUiMinHeight
        : storeOptions.gridUiMinHeightCompact,
    ]"
  >
    <div class="flex">
      <div class="flex-1 flex justify-center">
        <span class="mr-auto w-full">
          <AppDetailedInfoA class="ml-2 mr-4 my-2" />
        </span>
      </div>
      <div
        class="flex justify-center"
        :class="[`w-[${storeOptions.writerSize}px]`]"
      >
        <span> <AppDetailsWriting ref="detailsWriterRef" /></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span class="mr-auto w-full">
          <AppKanjiDetailsSelectBar />
          <AppDetailedInfoB class="ml-4 mr-2 my-2"
        /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import AppDetailsWriting from "@/components/KanjiDetails/AppDetailsWriting.vue";
import AppKanjiDetailsSelectBar from "@/components/KanjiDetails/AppKanjiDetailsSelectBar.vue";
import AppDetailedInfoA from "@/components/KanjiDetails/AppDetailedInfoA.vue";
import AppDetailedInfoB from "@/components/KanjiDetails/AppDetailedInfoB.vue";

const storeOptions = useStoreOptions();

const detailsWriterRef = ref(null);

onMounted(() => {});
</script>

<style scoped></style>
