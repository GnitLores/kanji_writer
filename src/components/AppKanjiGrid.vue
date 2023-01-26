<template>
  <div>
    <div id="character-target-div"></div>
    <div>
      <ul>
        <li
          class="text-sky-400"
          v-for="kanji in kanjiList.list"
          :key="kanji"
          @click.prevent="startQuiz(kanji)"
        >
          <p>{{ kanji }}</p>
        </li>
      </ul>
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
