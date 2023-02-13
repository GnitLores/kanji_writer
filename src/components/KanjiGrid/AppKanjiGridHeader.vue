<template>
  <div class="container mx-auto select-none my-2">
    <AppLevelsBar />

    <transition name="slideDown">
      <div v-show="storeOptions.showDisplayOptions">
        <div class="flex">
          <p class="text-sky-100 font-bold w-16">Display:</p>
          <div class="inline-block ml-2">
            <input
              class=""
              type="checkbox"
              v-model="storeOptions.reverseOrder"
            />
            <label class="text-sky-100 font-bold ml-1">Reverse</label>
          </div>
          <div class="inline-block ml-4">
            <input type="checkbox" v-model="storeOptions.doDisplayLevels" />
            <label class="text-sky-100 font-bold ml-1">By level</label>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex flex-wrap justify-center mt-2">
      <div
        class="flex justify-start w-[270px]"
        :class="selectionType === 'range' ? 'visible' : 'invisible'"
      >
        <div class="tooltip">
          <AppButton
            :disabled="nSelected === selected.length"
            :text="'All'"
            class="w-14"
            @clicked="selectAllClicked"
          />
          <span class="tooltiptext tooltip-top arrow-bottom"
            >Select all kanji</span
          >
        </div>

        <!-- <p class="text-white text-opacity-80 font-semibold mx-2 inline-block">
          Select:
        </p> -->
        <div class="tooltip">
          <AppButton
            :disabled="nKnown === 0 || nSelected === selected.length"
            :text="'Known'"
            class="w-20 ml-2"
            @clicked="selectKnownClicked"
          />
          <span class="tooltiptext tooltip-top arrow-bottom"
            >Select all kanji marked as known</span
          >
        </div>

        <div class="tooltip">
          <AppButton
            :disabled="
              nKnown === storeUser.known.length || nSelected === selected.length
            "
            :text="'Unknown'"
            class="w-20 ml-2"
            @clicked="selectUnknownClicked"
          />
          <span class="tooltiptext tooltip-top arrow-bottom"
            >Select all kanji marked as unknown</span
          >
        </div>
      </div>

      <div class="grow flex justify-center">
        <AppKanjiGridSearch />
      </div>

      <div
        class="w-[270px] flex justify-end"
        :class="selectionType === 'range' ? 'visible' : 'invisible'"
      >
        <p class="text-white text-opacity-80 font-semibold mr-4 inline-block">
          {{ nSelected }} kanji selected | {{ nKnown }} known
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";

import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";
import AppLevelsBar from "@/components/KanjiGrid/AppLevelsBar.vue";
import AppKanjiGridSearch from "@/components/KanjiGrid/AppKanjiGridSearch.vue";
import AppButton from "@/components/AppButton.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected, setSelectionAsSelected, selectAll } = useSelection();

const { selectionType } = inject("selectionType");

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);

const selectAllClicked = () => {
  selectAll();
};

const selectKnownClicked = () => {
  setSelectionAsSelected(storeUser.known, true, true);
};

const selectUnknownClicked = () => {
  const unknown = storeUser.known.map((val) => !val);
  setSelectionAsSelected(unknown, true, true);
};
</script>

<style scoped></style>
