<template>
  <div class="p-1">
    <div
      v-for="kanji in kanjiList.list"
      :key="kanji"
      class="inline-block cursor-pointer hover:text-orange-400 border-solid border-2 p-0.5 -m-1 w-8 h-8 text-center"
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
import { useStoreQuiz } from "@/stores/storeQuiz";

const storeKanji = useStoreKanji();
const storeQuiz = useStoreQuiz();

const kanjiList = reactive({
  list: [],
});

const loadKanjiList = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const kanjiClickHandler = (kanji) => {
  storeKanji.loadKanji(kanji);
};

onMounted(() => {
  loadKanjiList();
});
</script>

<style scoped></style>
