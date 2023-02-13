<template>
  <div>
    <AppLearn />
    <AppKanjiGrid />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
  provide,
} from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import AppLearn from "@/components/Learn/AppLearn.vue";

provide("selectionType", { selectionType: "range" });
</script>

<style scoped></style>
