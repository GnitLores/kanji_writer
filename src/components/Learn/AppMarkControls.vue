<template>
  <div class="w-40 border-2 border-gray-600 p-2 rounded">
    <div
      class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
    >
      {{ nSelected === 0 ? "Select kanji to mark" : "Mark selected kanji as:" }}
    </div>
    <div class="flex justify-center">
      <div class="tooltip">
        <AppButton
          :disabled="nSelected === 0"
          :text="'Known'"
          class="w-20 text-base h-8 mt-2"
          @clicked="setKnownClicked"
        />

        <span class="tooltiptext tooltip-top arrow-bottom"
          >Indicate that you already know how to write selected kanji
        </span>
      </div>
    </div>

    <AppConfirmationDialog
      ref="knownDialogRef"
      :text="'Set selected kanji as known?'"
      @onConfirm="setKnownConfirmed"
      @onCancel=""
    />

    <div class="flex justify-center">
      <div class="tooltip">
        <AppButton
          :disabled="nSelected === 0"
          :text="'Unknown'"
          class="w-20 text-base h-8 mt-2"
          @clicked="setUnknownClicked"
        />
        <span class="tooltiptext tooltip-bottom arrow-top"
          >Indicate that you have not learned to write selected kanji</span
        >
      </div>
    </div>
    <AppConfirmationDialog
      ref="unknownDialogRef"
      :text="'Set selected kanji as unknown?'"
      @onConfirm="setUnknownConfirmed"
      @onCancel=""
    />
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

const { selected, initSelected } = useSelection();

const knownDialogRef = ref(null);
const unknownDialogRef = ref(null);

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
