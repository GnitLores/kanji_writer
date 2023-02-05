<template>
  <div class="flex justify-center">
    <input
      type="text"
      v-model="input"
      placeholder="Enter text with kanji..."
      class="w-96 bg-darkmode-100 border border-black rounded"
    />
    <button
      class="bg-darkmode-500 hover:bg-blue-500 text-sky-100 text-xs font-semibold hover:text-white border border-sky-700 hover:border-transparent rounded w-10 ml-2 disabled:opacity-50"
      :disabled="input === ''"
      @click.prevent="clearSearch()"
    >
      Clear
    </button>
  </div>
  <div v-if="false" class="search-error"><p>No results found!</p></div>
</template>

<script setup>
import { ref } from "vue";
import { useSearch } from "@/use/useSearch";

const { input, clearSearch } = useSearch();
</script>

<style scoped></style>
