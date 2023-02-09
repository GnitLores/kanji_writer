<template>
  <div class="container">
    <div class="flex">
      <div class="flex-1 flex justify-center">
        <span class="mr-auto"
          ><div class="ml-2 mt-2">
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
                  {{
                    parseFloat(storeKanji.kanjiData.kanken_level) > 2
                      ? "Yes"
                      : "No"
                  }}
                </div>
              </li>
            </ul>
          </div></span
        >
      </div>
      <div class="flex-1 flex justify-center">
        <span
          ><AppKanjiDetailsSelectBar />
          <AppDetailsWriting ref="detailsWriterRef"
        /></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span class="ml-auto"><div class="mr-2 mt-2">HEJ</div></span>
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

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

const detailsWriterRef = ref(null);
</script>

<style scoped></style>
