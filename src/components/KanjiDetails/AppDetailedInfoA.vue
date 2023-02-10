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
        <ul class="text-white text-opacity-100">
          <li>Class - {{ storeKanji.kanjiData.class }}</li>
          <li>
            Radical - {{ storeKanji.kanjiData.radical }} | Strokes -
            {{ storeKanji.kanjiData.stroke_count }}
          </li>
          <li></li>
          <li></li>
          <li>{{ kankenString }}</li>
        </ul>
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

let kankenString = `${
  parseFloat(storeKanji.kanjiData.kanken_level) > 2 ? "Jōyō | " : "Jinmeiyō"
}Kanken ${storeKanji.kanjiData.kanken_level_text}`;
</script>

<style scoped></style>
