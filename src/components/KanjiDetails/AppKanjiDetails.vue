<template>
  <div
    class="container"
    :class="[writerSettings.showStrokes ? 'h-[550px]' : 'h-[400px]']"
  >
    <div class="flex">
      <div class="flex-1 flex justify-center">
        <span class="mr-auto w-full">
          <AppDetailedInfoA class="ml-2 mr-4 my-2" />
        </span>
      </div>
      <div class="flex justify-center w-[300px]">
        <span> <AppWriting ref="detailsWriterRef" /></span>
      </div>
      <div class="flex-1 flex justify-center">
        <span class="mr-auto w-full">
          <AppKanjiDetailsSelectBar />
          <AppDetailedInfoB class="ml-4 mr-2 my-2"
        /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, provide, watch } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import AppWriting from "@/components/AppWriting.vue";
import AppKanjiDetailsSelectBar from "@/components/KanjiDetails/AppKanjiDetailsSelectBar.vue";
import AppDetailedInfoA from "@/components/KanjiDetails/AppDetailedInfoA.vue";
import AppDetailedInfoB from "@/components/KanjiDetails/AppDetailedInfoB.vue";
import { useSelection } from "@/use/useSelection";
import { useWriterSettings } from "@/use/useWriterSettings";

const { detailsKanji, modalKanji } = useSelection();

const storeOptions = useStoreOptions();

const detailsWriterRef = ref(null);

const props = defineProps({
  kanji: {
    type: Object,
    required: true,
  },
  detailsType: {
    type: String,
    default: "view", // view or modal
  },
});

const selectChar = async (char) => {
  await props.kanji.loadKanji(char);
};

provide("kanji", { kanji: props.kanji, selectChar });

const writerSettings = reactive(useWriterSettings());
provide("writerSettings", writerSettings);

const setViewing = (value) => {
  if (props.detailsType === "view") detailsKanji.value = value;
  if (props.detailsType === "modal") modalKanji.value = value;
};
const updateViewing = () => {
  setViewing(props.kanji.char);
};
const resetViewing = () => {
  setViewing("");
};

watch(props.kanji, updateViewing);

onMounted(() => {
  updateViewing();
});
onBeforeUnmount(() => {
  resetViewing();
});
</script>

<style scoped></style>
