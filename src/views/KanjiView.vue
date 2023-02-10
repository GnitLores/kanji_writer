<template>
  <div>
    <div v-if="storeKanji.char !== ''" class="flex justify-center">
      <AppKanjiDetails />
    </div>

    <AppKanjiGrid />
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
