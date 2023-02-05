<template>
  <div class="flex justify-center">
    <input
      type="text"
      v-model="input"
      placeholder="Enter text with kanji..."
      class="w-96 bg-darkmode-100 border border-black rounded"
    />
    <AppButton
      :disabled="input === ''"
      :text="'Clear'"
      class="ml-2 w-10"
      @clicked="clearSearch()"
    />
  </div>
  <div v-if="false" class="search-error"><p>No results found!</p></div>
</template>

<script setup>
import { ref } from "vue";
import { useSearch } from "@/use/useSearch";
import AppButton from "@/components/AppButton.vue";

const { input, clearSearch } = useSearch();
</script>

<style scoped></style>
