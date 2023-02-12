<template>
  <div
    class="flex justify-center place-items-center"
    :class="[
      storeOptions.showDetailsStrokeOrder
        ? 'details-ui-height'
        : 'details-ui-height-no-strokes',
    ]"
  >
    HEJ
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();
</script>

<style scoped></style>
