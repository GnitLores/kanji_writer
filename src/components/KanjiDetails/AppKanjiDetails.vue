<template>
  <div class="container">
    <div class="flex justify-center"><AppDetailsWriting /></div>
    <AppKanjiDetailsSelectBar />
    <AppStrokeOrderVisualization />
  </div>
</template>

<script setup>
import AppDetailsWriting from "@/components/KanjiDetails/AppDetailsWriting.vue";
import AppStrokeOrderVisualization from "@/components/KanjiDetails/AppStrokeOrderVisualization.vue";
import AppKanjiDetailsSelectBar from "@/components/KanjiDetails/AppKanjiDetailsSelectBar.vue";
</script>

<style scoped></style>
