<template>
  <div class="select-none">
    <AppLearn />
    <AppKanjiGrid />
  </div>
</template>

<script setup>
import { provide } from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import AppLearn from "@/components/Learn/AppLearn.vue";

provide("selectionType", { selectionType: "range" });
</script>

<style scoped></style>
