<template>
  <div>
    <p class="text-white text-4xl">
      {{ kanji.char }}
    </p>

    <div
      class="overflow-y-auto"
      :class="[
        storeOptions.showDetailsStrokeOrder ? `max-h-[470px]` : `max-h-[320px]`,
      ]"
    >
      <ul class="capitalize font-semibold">
        <li class="pt-2 border-b border-gray-600">
          <div class="text-white text-opacity-100">Keywords:</div>
          <div class="text-white text-opacity-80">
            {{ kanji.data.keywords }}
          </div>
        </li>
        <li class="pt-2 border-b border-gray-600">
          <div class="text-white text-opacity-100">Kunyomi:</div>
          <div class="text-white text-opacity-80">
            {{ kanji.data.kunyomi }}
          </div>
        </li>
        <li class="pt-2 border-b border-gray-600">
          <div class="text-white text-opacity-100">Onyomi:</div>
          <div class="text-white text-opacity-80">
            {{ kanji.data.onyomi }}
          </div>
        </li>
        <li class="pt-2 border-b border-gray-600">
          <ul class="text-white text-opacity-100">
            <li>Class - {{ kanji.data.class }}</li>
            <li>
              Radical - {{ kanji.data.radical }} | Strokes -
              {{ kanji.data.stroke_count }}
            </li>
            <li></li>
            <li></li>
            <li>{{ kankenString }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();

const { kanji } = inject("kanji");

let kankenString = `${
  parseFloat(kanji.data.kanken_level) > 2 ? "Jōyō | " : "Jinmeiyō"
}Kanken ${kanji.data.kanken_level_text}`;
</script>

<style scoped></style>
