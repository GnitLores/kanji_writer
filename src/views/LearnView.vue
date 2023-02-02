<template>
  <div>
    <AppKanjiGrid @kanjiRangeSelected="onKanjiRangeSelected" />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
} from "vue";
import AppKanjiGrid from "@/components/AppKanjiGrid.vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

const onKanjiRangeSelected = () => {
  storeList.applyDraggingSelection();
};
</script>

<style scoped></style>
