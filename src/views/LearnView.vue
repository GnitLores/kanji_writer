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
} from "vue";
import AppKanjiGrid from "@/components/KanjiGrid/AppKanjiGrid.vue";
import AppLearn from "@/components/Learn/AppLearn.vue";
</script>

<style scoped></style>
