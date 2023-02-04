<template>
  <!-- <button
    type="button"
    class="bg-indigo-200 px-3 py-1 font-medium"
    @click="showModal = true"
  >
    Show modal
  </button> -->

  <BaseModal :show="storeKanji.showModal">
    <div class="p-4">
      <div class="text-lg">Hello Modal World!</div>

      <div class="py-2 text-sm">Click to close:</div>

      <button
        type="button"
        class="bg-indigo-200 px-3 py-1 font-medium"
        @click="storeKanji.showModal = false"
      >
        Hide modal
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";
import BaseModal from "@/components/modals/BaseModal.vue";

const storeKanji = useStoreKanji();

// const showModal = ref(false);
</script>
