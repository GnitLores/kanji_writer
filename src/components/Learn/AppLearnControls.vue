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
          <div class="tooltip">
            <AppButton
              :disabled="nKnown === 0"
              :text="'Known Kanji'"
              class="w-32 text-base h-10 mb-2"
              @clicked="selectKnownClicked"
            />
            <span class="tooltiptext tooltip-top arrow-bottom"
              >Select all kanji marked as known</span
            >
          </div>
        </li>

        <li>
          <div class="tooltip">
            <AppButton
              :disabled="nKnown === storeUser.known.length"
              :text="'Unknown Kanji '"
              class="w-32 text-base h-10 mb-2"
              @clicked="selectUnknownClicked"
            />
            <span class="tooltiptext tooltip-bottom arrow-top"
              >Select all kanji marked as unknown</span
            >
          </div>
        </li>
      </ul>
    </div>

    <div class="inline-block ml-4">
      <ul class="list-none">
        <p
          class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
        >
          Edit:
        </p>
        <li>
          <div class="tooltip">
            <AppButton
              :disabled="nSelected === 0"
              :text="'Set Known'"
              class="w-32 text-base h-10 mb-2"
              @clicked="setKnownClicked"
            />
            <span class="tooltiptext tooltip-top arrow-bottom"
              >Indicate that you already know how to write selected kanji
            </span>
          </div>
        </li>

        <li>
          <div class="tooltip">
            <AppButton
              :disabled="nSelected === 0"
              :text="'Set Unknown '"
              class="w-32 text-base h-10 mb-2"
              @clicked="setUnknownClicked"
            />
            <span class="tooltiptext tooltip-bottom arrow-top"
              >Indicate that you have not learned to write selected kanji</span
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="flex text-white text-opacity-80 font-semibold mx-2">
      <p class="">
        Click, click-and-drag, or right click elements to select kanji.
      </p>
      <span class="grow"></span>
      <p>{{ nSelected }} kanji selected | {{ nKnown }} kanji known</p>
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

const { selected, initSelected, setSelectionAsSelected } = useSelection();

const selectKnownClicked = () => {
  setSelectionAsSelected(storeUser.known, true, true);
};

const selectUnknownClicked = () => {
  const unknown = storeUser.known.map((val) => !val);
  // console.log(storeUser.known);
  // console.log(unknown);
  setSelectionAsSelected(unknown, true, true);
};

const setKnownClicked = () => {
  storeUser.setSelectionAsKnown(selected.value, true);
  initSelected();
};

const setUnknownClicked = () => {
  storeUser.setSelectionAsKnown(selected.value, false);
  initSelected();
};

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);
</script>

<style scoped></style>
