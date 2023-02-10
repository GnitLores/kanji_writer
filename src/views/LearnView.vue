<template>
  <div>
    <AppKanjiGrid />
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
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";

const storeOptions = useStoreOptions();
const storeList = useStoreList();
</script>

<style scoped></style>
