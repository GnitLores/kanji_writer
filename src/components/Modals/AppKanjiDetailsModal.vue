<template>
  <AppBaseModal :show="storeKanji.showModal">
    <AppKanjiDetails v-on-click-outside="closeModal" />
  </AppBaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";
import AppBaseModal from "@/components/Modals/AppBaseModal.vue";
import AppKanjiDetails from "@/components/KanjiDetails/AppKanjiDetails.vue";
import { vOnClickOutside } from "@vueuse/components";

const storeKanji = useStoreKanji();

const closeModal = () => {
  storeKanji.hideDetailsModal();
};
// const showModal = ref(false);
</script>
