<template>
  <div>
    <div v-if="storeKanji.char !== ''" class="flex justify-center">
      <AppKanjiDetails />
    </div>
    <div v-else class="min-h-[600px] flex justify-center place-items-center">
      <p class="text-white text-4xl font-semibold text-opacity-80">
        Left any kanji to select
      </p>
    </div>

    <AppKanjiGrid selectionType="single" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiDetails from "@/components/KanjiDetails/AppKanjiDetails.vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
</script>

<style scoped></style>
