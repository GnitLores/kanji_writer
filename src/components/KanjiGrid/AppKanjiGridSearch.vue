<template>
  <div class="flex justify-center">
    <div class="relative">
      <input
        type="text"
        v-model="input"
        placeholder="Enter text with kanji..."
        class="w-96 bg-darkmode-100 border border-black rounded px-7"
        v-autofocus
        maxlength="300"
        @keyup.enter="startSearch"
      />
      <i
        class="fa-solid fa-magnifying-glass absolute top-1.5 left-1.5 text-black"
      ></i>
      <i
        class="fa-solid fa-times absolute top-1.5 right-1.5 text-black"
        :class="[input === '' ? 'opacity-50' : 'hover:cursor-pointer']"
        @click.prevent="clearSearch()"
      ></i>
    </div>
    <AppButton
      :disabled="input === ''"
      :text="'Search'"
      class="ml-2 w-14"
      @clicked="startSearch()"
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
  var w = window.innerWidth;
  var h = window.innerHeight;
  console.log(w, h);
  if (input.value === "") clearSearch();
});
</script>

<style scoped></style>
