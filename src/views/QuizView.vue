<template>
  <div class="select-none">
    <component
      :is="activeComponent"
      @startQuiz="startQuiz"
      @stopQuiz="stopQuiz"
    />
  </div>
</template>

<script setup>
import { ref, provide, markRaw, onBeforeMount } from "vue";
import AppQuizSetup from "@/components/Quiz/AppQuizSetup.vue";
import AppQuiz from "@/components/Quiz/AppQuiz.vue";
import { useSelection } from "@/use/useSelection";

provide("selectionType", { selectionType: "range" });

const activeComponent = ref(null);

const changeComponent = (newComponent) => {
  // markRaw marks an object so that it will never be converted to a proxy. Returns the object itself.
  // Some values simply should not be made reactive, for example a complex 3rd party class instance, or a Vue component object.
  activeComponent.value = markRaw(newComponent);
};
changeComponent(AppQuizSetup);

const startQuiz = () => {
  changeComponent(AppQuiz);
};

const stopQuiz = () => {
  initSelected();
  changeComponent(AppQuizSetup);
};

const { initSelected } = useSelection();
onBeforeMount(() => {
  initSelected();
});
</script>

<style scoped></style>
