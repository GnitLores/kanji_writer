<template>
  <div class="select-none">
    <component :is="activeComponent" @startLearning="startLearningQuiz" />
  </div>
</template>

<script setup>
import { ref, provide, markRaw } from "vue";
import AppLearn from "@/components/Learn/AppLearn.vue";

provide("selectionType", { selectionType: "range" });

const activeComponent = ref(null);

const changeComponent = (newComponent) => {
  // markRaw marks an object so that it will never be converted to a proxy. Returns the object itself.
  // Some values simply should not be made reactive, for example a complex 3rd party class instance, or a Vue component object.
  activeComponent.value = markRaw(newComponent);
};
changeComponent(AppLearn);

const startLearningQuiz = () => {
  console.log("hej");
};
</script>

<style scoped></style>
