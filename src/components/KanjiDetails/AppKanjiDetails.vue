<template>
  <div class="container">
    <AppStrokeOrderVisualization />
    <div class="flex justify-center"><AppDetailsWriting /></div>
  </div>
</template>

<script setup>
import AppDetailsWriting from "@/components/KanjiDetails/AppDetailsWriting.vue";
import AppStrokeOrderVisualization from "@/components/KanjiDetails/AppStrokeOrderVisualization.vue";
</script>

<style scoped></style>
