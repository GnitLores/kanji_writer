<template>
  <div class="">
    <p class="text-white text-4xl">
      {{ storeKanji.char }}
    </p>
    <ul class="capitalize font-semibold">
      <li class="pt-2 border-b border-gray-600">
        <div class="text-white text-opacity-100">Keywords:</div>
        <div class="text-white text-opacity-80">
          {{ storeKanji.kanjiData.keywords }}
        </div>
      </li>
      <li class="pt-2 border-b border-gray-600">
        <div class="text-white text-opacity-100">Kunyomi:</div>
        <div class="text-white text-opacity-80">
          {{ storeKanji.kanjiData.kunyomi }}
        </div>
      </li>
      <li class="pt-2 border-b border-gray-600">
        <div class="text-white text-opacity-100">Onyomi:</div>
        <div class="text-white text-opacity-80">
          {{ storeKanji.kanjiData.onyomi }}
        </div>
      </li>
      <li class="pt-2 border-b border-gray-600">
        <div class="text-white text-opacity-100">
          Class - {{ storeKanji.kanjiData.class }}
        </div>
        <div class="text-white text-opacity-100">
          Radical - {{ storeKanji.kanjiData.radical }}
        </div>
        <div class="text-white text-opacity-100">
          Kanken level - {{ storeKanji.kanjiData.kanken_level_text }}
        </div>
        <div class="text-white text-opacity-100">
          Jōyō -
          {{ parseFloat(storeKanji.kanjiData.kanken_level) > 2 ? "Yes" : "No" }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();
</script>

<style scoped></style>
