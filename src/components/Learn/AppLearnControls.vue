<template>
  <div class="flex">
    <div class="w-40 border-2 border-gray-600 p-2 rounded">
      <div
        class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
      >
        {{
          nSelected === 0 ? "Select kanji to mark" : "Mark selected kanji as:"
        }}
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
    <div class="grow border-2 border-gray-600 p-2 rounded ml-4">
      <div class="mb-1 flex justify-end place-items-end h-full">
        <p class="text-white text-opacity-80 font-semibold text-center text-xl">
          {{
            nSelected === 0
              ? "Select kanji to start learning"
              : "Start learning selected kanji:"
          }}
        </p>
        <div class="tooltip">
          <AppButton
            :disabled="nSelected === 0"
            :text="'Start'"
            class="w-24 h-8 text-lg ml-4"
            @clicked="startLearnClicked"
          />
          <span class="tooltiptext tooltip-bottom arrow-top"
            >Start learning quiz using all selected kanji and current settings.
            Learning a kanji will mark it as known.</span
          >
        </div>

        <AppConfirmationDialog
          ref="startDialogRef"
          :text="'Start learning using current settings?'"
          @onConfirm="startLearnConfirmed"
          @onCancel=""
        />
      </div>
    </div>
  </div>
  <div
    class="flex justify-center text-white text-opacity-80 font-semibold mx-2 mt-8"
  >
    <p class="">
      Click, click-and-drag, or right click controls below to select kanji to
      learn.
    </p>
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
const startDialogRef = ref(null);

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

const startLearnClicked = () => {
  startDialogRef.value.showDialog();
};

const startLearnConfirmed = () => {};

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);
</script>

<style scoped></style>
