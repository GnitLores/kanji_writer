<template>
  <div class="bg-gray-900">
    <div id="character-target-div"></div>
    <div class="text-sky-400 p-1">
      <div
        v-for="kanji in kanjiList.list"
        :key="kanji"
        class="inline-block p-0.5"
        @click.prevent="startQuiz(kanji)"
      >
        {{ kanji }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
const KanjiWriter = useKanjiWriter();
let currentWriter = null;

const kanjiList = reactive({
  list: [],
});

const loadKanji = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const startQuiz = (char) => {
  // const char = "斤";
  emptyQuiz();

  const userData = storeKanji.loadKanji(char);

  currentWriter = KanjiWriter.create("character-target-div", char, {
    charDataLoader: function (char, onComplete) {
      onComplete(userData);
    },
    showCharacter: false,
    // showOutline: false,
    showHintAfterMisses: 1,
  });
  currentWriter.quiz();
};

const emptyQuiz = () => {
  const div = document.querySelector("#character-target-div");
  if (div) {
    [].slice.call(div.children).forEach((child) => div.removeChild(child));
  }
};

onMounted(() => {
  loadKanji();
});
</script>

<style scoped></style>
