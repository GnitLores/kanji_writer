<template>
  <div class="container text-white text-opacity-80">
    <div class="flex">
      <div class="flex-1 flex justify-center">
        <span class="mr-auto"
          ><div class="ml-2 mt-2">
            <p class="text-4xl">
              {{ storeKanji.char }}
            </p>
            <ul class="capitalize font-semibold">
              <li class="">- {{ storeKanji.kanjiData.keywords }}</li>
              <li>Kunyomi: {{ storeKanji.kanjiData.kunyomi }}</li>
              <li></li>
            </ul></div
        ></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span><AppDetailsWriting /></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span class="ml-auto"><div class="mr-2 mt-2">HEJ</div></span>
      </div>
    </div>
    <AppStrokeOrderVisualization />
    <AppKanjiDetailsSelectBar />
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";
import AppDetailsWriting from "@/components/KanjiDetails/AppDetailsWriting.vue";
import AppStrokeOrderVisualization from "@/components/KanjiDetails/AppStrokeOrderVisualization.vue";
import AppKanjiDetailsSelectBar from "@/components/KanjiDetails/AppKanjiDetailsSelectBar.vue";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();
</script>

<style scoped></style>
