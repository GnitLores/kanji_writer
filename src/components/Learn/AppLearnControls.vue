<template>
  <div class="border-2 border-red-700">
    <div class="inline-block">
      <ul class="list-none ml-4">
        <p
          class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
        >
          Select:
        </p>
        <li>
          <AppButton
            :text="'Known Kanji'"
            class="w-32 text-base h-10 mb-2"
            @clicked="selectKnownClicked"
          />
        </li>

        <li>
          <AppButton
            :text="'Unknown Kanji '"
            class="w-32 text-base h-10 mb-2"
            @clicked="selectUnknownClicked"
          />
        </li>
      </ul>
    </div>

    <div class="inline-block ml-4">
      <ul class="list-none">
        <p
          class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
        >
          Edit selected:
        </p>
        <li>
          <AppButton
            :disabled="nSelected === 0"
            :text="'Set Known'"
            class="w-32 text-base h-10 mb-2"
            @clicked="setKnownClicked"
          />
        </li>

        <li>
          <AppButton
            :disabled="nSelected === 0"
            :text="'Set Unknown '"
            class="w-32 text-base h-10 mb-2"
            @clicked="setUnknownClicked"
          />
        </li>
      </ul>
    </div>
    <div class="flex text-white text-opacity-80 font-semibold mx-2">
      <p class="">
        Click, click-and-drag, or right click elements to select kanji.
      </p>
      <span class="grow"></span>
      <p>{{ nSelected }} kanji selected</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";
import AppButton from "@/components/AppButton.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected, initSelected } = useSelection();

const selectKnownClicked = () => {};

const selectUnknownClicked = () => {};

const setKnownClicked = () => {
  storeUser.setIndicesAsKnown(selected.value, true);
  initSelected();
};

const setUnknownClicked = () => {
  storeUser.setIndicesAsKnown(selected.value, false);
  initSelected();
};

const nSelected = computed(() => selected.value.filter(Boolean).length);
</script>

<style scoped></style>
