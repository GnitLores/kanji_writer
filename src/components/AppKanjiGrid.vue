<template>
  <div class="p-1">
    <div class="flex">
      <div class="grow"></div>
      <div class="inline-block mx-8">
        <label class="text-sky-200">Show levels: </label>
        <input
          type="checkbox"
          @change="storeKanji.setDisplayList"
          v-model="storeKanji.doDisplayLevels"
        />
      </div>
    </div>
    <div v-for="levelList in storeKanji.displayList" :key="levelList.name">
      <h3 class="text-sky-200 text-center mb-1 mt-2 font-bold tracking-wide">
        {{ levelList.name }}:
      </h3>
      <div
        v-for="kanji in levelList.kanji"
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
      <br />
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
