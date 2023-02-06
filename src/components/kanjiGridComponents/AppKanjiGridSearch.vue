<template>
  <div class="flex justify-center">
    <div class="relative">
      <input
        type="text"
        v-model="input"
        placeholder="Enter text with kanji..."
        class="w-96 bg-darkmode-100 border border-black rounded pl-7"
        v-autofocus
      />
      <i
        class="fa-solid fa-magnifying-glass absolute top-1.5 left-1.5 text-black"
      ></i>
    </div>
    <AppButton
      :disabled="input === ''"
      :text="'Search'"
      class="ml-2 w-12"
      @clicked="startSearch()"
    />
    <AppButton
      :disabled="input === ''"
      :text="'Clear'"
      class="ml-2 w-12"
      @clicked="clearSearch()"
    />
  </div>
  <div v-if="false" class="search-error"><p>No results found!</p></div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSearch } from "@/use/useSearch";
import AppButton from "@/components/AppButton.vue";
import { vAutofocus } from "@/directives/vAutofocus";

const { input, startSearch, clearSearch } = useSearch();

watch(input, () => {
  if (input.value === "") clearSearch();
});
</script>

<style scoped></style>
