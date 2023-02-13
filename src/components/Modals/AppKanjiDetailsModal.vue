<template>
  <AppBaseModal :show="storeOptions.showDetailsModal">
    <AppKanjiDetails
      v-on-click-outside="closeModal"
      :detailsType="'modal'"
      :kanji="storeOptions.modalKanji"
    />
  </AppBaseModal>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";
import AppBaseModal from "@/components/Modals/AppBaseModal.vue";
import AppKanjiDetails from "@/components/KanjiDetails/AppKanjiDetails.vue";
import { vOnClickOutside } from "@vueuse/components";

const storeOptions = useStoreOptions();
// const { modalsKanji } = storeToRefs(storeOptions);

const closeModal = () => {
  storeOptions.hideDetailsModal();
};
</script>
