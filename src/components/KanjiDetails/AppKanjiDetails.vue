<template>
  <div class="container min-h-[550px]">
    <div class="flex">
      <div class="flex-1 flex justify-center">
        <span class="mr-auto"
          ><AppDetailedInfoA class="ml-2 mr-4 my-2" />
        </span>
      </div>
      <div class="w-[300px] flex justify-center">
        <span> <AppDetailsWriting ref="detailsWriterRef" /></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span class="mr-auto">
          <AppKanjiDetailsSelectBar />
          <AppDetailedInfoB class="ml-4 mr-2 my-2"
        /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";
import AppDetailsWriting from "@/components/KanjiDetails/AppDetailsWriting.vue";
import AppKanjiDetailsSelectBar from "@/components/KanjiDetails/AppKanjiDetailsSelectBar.vue";
import AppDetailedInfoA from "@/components/KanjiDetails/AppDetailedInfoA.vue";
import AppDetailedInfoB from "@/components/KanjiDetails/AppDetailedInfoB.vue";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

const detailsWriterRef = ref(null);
</script>

<style scoped></style>
