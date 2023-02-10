<template>
  <div class="min-h-[550px] flex justify-center place-items-center">
    <p class="text-white text-4xl font-semibold text-opacity-80">Quiz</p>
  </div>
  <div><AppKanjiGrid /></div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
</script>

<style scoped></style>
