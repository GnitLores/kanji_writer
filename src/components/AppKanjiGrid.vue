<template>
  <div class="bg-gray-900">
    <div id="character-target-div"></div>
    <div class="text-sky-400">
      <div
        v-for="kanji in kanjiList.list"
        :key="kanji"
        class="inline-block p-0.5"
        @click.prevent="startQuiz(kanji)"
      >
        {{ kanji }}
      </div>
      <!-- <ul class="list-none">
        <li
          class="text-sky-400"
          v-for="kanji in kanjiList.list"
          :key="kanji"
          @click.prevent="startQuiz(kanji)"
        >
          <p>{{ kanji }}</p>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useKanjiWriter } from "@/use/useKanjiWriter";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
const kanjiWriter = useKanjiWriter();

const kanjiList = reactive({
  list: [],
});

const loadKanji = async () => {
  kanjiList.list = await storeKanji.loadKanjiList();
};

const startQuiz = (char) => {
  // const char = "斤";

  const userData = storeKanji.loadKanji(char);

  const writer = kanjiWriter.create("character-target-div", char, {
    charDataLoader: function (char, onComplete) {
      onComplete(userData);
    },
    showCharacter: false,
    // showOutline: false,
    showHintAfterMisses: 1,
  });
  writer.quiz();
};

onMounted(() => {
  loadKanji();
});
</script>

<style scoped></style>
