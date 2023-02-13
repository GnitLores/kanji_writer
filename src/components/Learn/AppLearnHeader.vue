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
          >Start learning from first unknown kanji with no need to select</span
        >
      </div>
    </div>

    <div class="flex-1 flex justify-center">
      <span class="ml-auto"> </span>
    </div>
  </div>
</template>

<script setup>
import { useStoreUser } from "@/stores/storeUser";
import AppButton from "@/components/AppButton.vue";

const storeUser = useStoreUser();

const quickStartClicked = () => {};
</script>

<style scoped></style>
