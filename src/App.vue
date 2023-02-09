<template>
  <AppKanjiDetailsModal />
  <AppNavbar />
  <router-view v-slot="{ Component }">
    <component :is="Component"></component>
  </router-view>
</template>

<script setup>
import { onMounted } from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import AppNavbar from "@/components/AppNavbar.vue";
import AppKanjiDetailsModal from "@/components/Modals/AppKanjiDetailsModal.vue";

const storeList = useStoreList();
const storeOptions = useStoreOptions();

document
  .querySelector("meta[name=viewport]")
  .setAttribute(
    "content",
    "width=device-width, initial-scale=" + 1 / window.devicePixelRatio
  );

onMounted(() => {
  storeList.loadKanjiList();
});
</script>

<style scoped></style>
