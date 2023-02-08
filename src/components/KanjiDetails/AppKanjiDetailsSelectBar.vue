<template>
  <div class="flex justify-center my-2">
    <div class="grow basis-0">
      <div
        class="mx-2 cursor-pointer w-32"
        @click.prevent="showStrokeOrderClicked"
      >
        <span
          ><p
            class="text-sky-100 inline-block mr-2 font-bold"
            :class="[storeOptions.showDetailsStrokeOrder ? 'underline' : '']"
          >
            Stroke order
          </p>
          <i
            v-if="storeOptions.showDetailsStrokeOrder"
            class="fas fa-angles-down text-sky-100"
          ></i
          ><i v-else class="fas fa-angles-up text-sky-100"></i
        ></span>
      </div>
    </div>
    <div class="inline-block">
      <div class="flex justify-evenly w-72">
        <AppButton
          :disabled="false"
          :text="'Previous'"
          class="w-24 text-lg h-10"
          @clicked="previousButtonClicked"
        />
        <AppButton
          :disabled="false"
          :text="'Next'"
          class="w-24 text-lg h-10"
          @clicked="nextButtonClicked"
        />
      </div>
    </div>
    <div class="grow basis-0"><div class="w-32"></div></div>
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";
import AppButton from "@/components/AppButton.vue";
import { useDisplayData } from "@/use/useDisplayData";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

const showStrokeOrderClicked = () => {
  storeOptions.showDetailsStrokeOrder = !storeOptions.showDetailsStrokeOrder;
};

const { getDisplayedKanjiRelative } = useDisplayData();

const previousButtonClicked = () => {
  const kanji = getDisplayedKanjiRelative(storeKanji.char, -1);
  storeKanji.loadKanji(kanji.char);
};

const nextButtonClicked = () => {
  const kanji = getDisplayedKanjiRelative(storeKanji.char, 1);
  storeKanji.loadKanji(kanji.char);
};
</script>

<style scoped></style>
