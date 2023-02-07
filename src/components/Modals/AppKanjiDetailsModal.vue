<template>
  <!-- <button
    type="button"
    class="bg-indigo-200 px-3 py-1 font-medium"
    @click="showModal = true"
  >
    Show modal
  </button> -->

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
  storeKanji.showModal = false;
};
// const showModal = ref(false);
</script>
