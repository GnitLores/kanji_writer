<template>
  <AppKanjiDetailsModal />
  <AppNavbar />
  <router-view v-if="storeList.isLoaded" v-slot="{ Component }">
    <component :is="Component"></component>
  </router-view>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useDisplayData } from "@/use/useDisplayData";
import AppNavbar from "@/components/AppNavbar.vue";
import AppKanjiDetailsModal from "@/components/Modals/AppKanjiDetailsModal.vue";

const storeList = useStoreList();
const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

// Watch stores and update display data:
const { updateDisplayData } = useDisplayData();
const { kanjiByLevel } = storeToRefs(storeList);
watch(kanjiByLevel, updateDisplayData);

const { doDisplayLevels, ignoredLevels, reverseOrder } =
  storeToRefs(storeOptions);
watch(doDisplayLevels, updateDisplayData);
watch(ignoredLevels, updateDisplayData);
watch(reverseOrder, updateDisplayData);

onMounted(async () => {
  await storeList.loadKanjiList();
  storeUser.initUser();
});
</script>

<style scoped></style>
