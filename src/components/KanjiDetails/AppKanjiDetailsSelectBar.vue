<template>
  <div class="flex">
    <div class="mx-2 cursor-pointer w-fit">
      <div @click.prevent="showStrokeOrderClicked">
        <span
          ><p
            class="text-sky-100 inline-block mr-2 font-bold"
            :class="[storeOptions.showDetailsStrokeOrder ? 'underline' : '']"
          >
            Stroke order
          </p>
          <i
            v-if="!storeOptions.showDetailsStrokeOrder"
            class="fas fa-angles-down text-sky-100"
          ></i
          ><i v-else class="fas fa-angles-up text-sky-100"></i
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();

const showStrokeOrderClicked = () => {
  storeOptions.showDetailsStrokeOrder = !storeOptions.showDetailsStrokeOrder;
};
</script>

<style scoped></style>
