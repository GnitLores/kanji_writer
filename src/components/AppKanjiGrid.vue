<template>
  <div class="bg-gray-900">
    <div class="p-1">
      <div
        v-for="kanji in kanjiList.list"
        :key="kanji"
        class="inline-block p-0.5"
        :class="[kanji !== selectedChar ? 'text-sky-400' : 'text-orange-400']"
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

let selectedChar = ref("");
const orange = ref("sky");

const kanjiList = reactive({
  list: [],
});

const loadKanjiList = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const emit = defineEmits(["kanji-clicked"]);

const kanjiClickHandler = (kanji) => {
  selectedChar.value = kanji;
  emit("kanji-clicked", kanji);
};

onMounted(() => {
  loadKanjiList();
});
</script>

<style scoped></style>
