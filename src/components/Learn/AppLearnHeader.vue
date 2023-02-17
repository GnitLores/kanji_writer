<template>
  <div class="flex">
    <div class="flex-1 flex justify-center">
      <span class="mr-auto align">
        <p class="text-2xl text-white text-opacity-80 font-semibold m-2"></p>
      </span>
    </div>

    <div class="flex-1 flex justify-center">
      <span class=""></span>
      <div class="tooltip">
        <AppButton
          :disabled="storeUser.known.every((val) => val)"
          :text="'Quick Start'"
          class="w-32 h-12 text-lg m-2"
          @clicked="quickStartClicked"
        />
        <span class="tooltiptext tooltip-bottom arrow-top"
          >Start learning from first unknown kanji with no need to select kanji.
        </span>
      </div>
      <AppConfirmationDialog
        ref="quickstartDialogRef"
        :text="'Start learning quiz using current settings?'"
        @onConfirm="quickStartConfirmed"
        @onCancel=""
      />
    </div>

    <div class="flex-1 flex justify-center">
      <span class="ml-auto"> </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStoreUser } from "@/stores/storeUser";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeUser = useStoreUser();

const quickstartDialogRef = ref(null);

const quickStartClicked = () => {
  quickstartDialogRef.value.showDialog();
};

const quickStartConfirmed = () => {};
</script>

<style scoped></style>
