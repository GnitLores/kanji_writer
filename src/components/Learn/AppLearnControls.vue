<template>
  <div class="">
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
          Edit selected:
        </p>
        <li>
          <div class="tooltip">
            <AppButton
              :disabled="nSelected === 0"
              :text="'Mark as Known'"
              class="w-36 text-base h-10 mb-2"
              @clicked="setKnownClicked"
            />
            <span class="tooltiptext tooltip-top arrow-bottom"
              >Indicate that you already know how to write selected kanji
            </span>
          </div>
          <AppConfirmationDialog
            ref="knownDialogRef"
            :text="'Set selected kanji as known?'"
            @onConfirm="setKnownConfirmed"
            @onCancel=""
          />
        </li>

        <li>
          <div class="tooltip">
            <AppButton
              :disabled="nSelected === 0"
              :text="'Mark as Unknown '"
              class="w-36 text-base h-10 mb-2"
              @clicked="setUnknownClicked"
            />
            <span class="tooltiptext tooltip-bottom arrow-top"
              >Indicate that you have not learned to write selected kanji</span
            >
          </div>
          <AppConfirmationDialog
            ref="unknownDialogRef"
            :text="'Set selected kanji as unknown?'"
            @onConfirm="setUnknownConfirmed"
            @onCancel=""
          />
        </li>
      </ul>
    </div>
    <div class="flex text-white text-opacity-80 font-semibold mx-2 mt-8">
      <p class="">
        Click, click-and-drag, or right click elements below to select kanji to
        learn.
      </p>
      <span class="grow"></span>
      <p>{{ nSelected }} kanji selected | {{ nKnown }} kanji known</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected, initSelected, setSelectionAsSelected } = useSelection();

const knownDialogRef = ref(null);
const unknownDialogRef = ref(null);

const selectKnownClicked = () => {
  setSelectionAsSelected(storeUser.known, true, true);
};

const selectUnknownClicked = () => {
  const unknown = storeUser.known.map((val) => !val);
  setSelectionAsSelected(unknown, true, true);
};

const setKnownClicked = () => {
  knownDialogRef.value.showDialog();
};

const setKnownConfirmed = () => {
  storeUser.setSelectionAsKnown(selected.value, true);
  initSelected();
};

const setUnknownClicked = () => {
  unknownDialogRef.value.showDialog();
};

const setUnknownConfirmed = () => {
  storeUser.setSelectionAsKnown(selected.value, false);
  initSelected();
};

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);
</script>

<style scoped></style>
