<template>
  <div class="bg-gray-900">
    <div class="text-sky-400 p-1">
      <div
        v-for="kanji in kanjiList.list"
        :key="kanji"
        class="inline-block p-0.5"
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

const kanjiList = reactive({
  list: [],
});

const loadKanjiList = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const emit = defineEmits(["kanji-clicked"]);

const kanjiClickHandler = (kanji) => {
  emit("kanji-clicked", kanji);
};

onMounted(() => {
  loadKanjiList();
});
</script>

<style scoped></style>
