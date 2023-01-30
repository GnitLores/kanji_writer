<template>
  <div class="p-1 select-none">
    <div class="flex ml-4">
      <p class="text-sky-200 mr-4">Display:</p>
      <div v-for="level in storeKanji.levelNames" :key="level">
        <input
          type="checkbox"
          :value="level"
          v-model="storeKanji.displayLevelNames"
          @change="storeKanji.setDisplayList"
        />
        <label class="text-sky-200 tracking-wide mr-4 ml-0.5">{{
          level
        }}</label>
      </div>

      <div class="grow"></div>

      <div class="mx-8">
        <label class="text-sky-200">By level: </label>
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
