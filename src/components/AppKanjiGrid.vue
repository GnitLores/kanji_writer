<template>
  <div class="p-1">
    <div
      v-for="kanji in storeKanji.displayList"
      :key="kanji"
      class="inline-block cursor-pointer hover:text-orange-400 border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center rounded"
      :class="[
        kanji !== storeKanji.kanji
          ? 'text-sky-400 border-transparent'
          : 'text-orange-400 border-orange-400',
      ]"
      @click.prevent="kanjiClickHandler(kanji)"
    >
      {{ kanji }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();

const loadKanjiList = async () => {
  await storeKanji.loadKanjiList();
};

const kanjiClickHandler = (kanji) => {
  storeKanji.loadKanji(kanji);
};

onMounted(() => {
  loadKanjiList();
});
</script>

<style scoped></style>
