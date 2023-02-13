<template>
  <div class="container mx-auto select-none my-2">
    <AppLevelsBar />

    <transition name="slideDown">
      <div v-show="storeOptions.showDisplayOptions">
        <div class="flex">
          <p class="text-sky-100 font-bold w-16">Display:</p>
          <div class="inline-block ml-2">
            <input
              class=""
              type="checkbox"
              v-model="storeOptions.reverseOrder"
            />
            <label class="text-sky-100 font-bold ml-1">Reverse</label>
          </div>
          <div class="inline-block ml-4">
            <input type="checkbox" v-model="storeOptions.doDisplayLevels" />
            <label class="text-sky-100 font-bold ml-1">By level</label>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {} from "vue";

import { useStoreOptions } from "@/stores/storeOptions";
import AppLevelsBar from "@/components/KanjiGrid/AppLevelsBar.vue";

const storeOptions = useStoreOptions();
</script>

<style scoped></style>
