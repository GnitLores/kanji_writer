<template>
  <Teleport to="#modals">
    <!-- Show / hide the modal -->
    <div v-if="show" class="base-modal">
      <!-- The backdrop -->
      <div class="fixed inset-0 bg-gray-900 opacity-40"></div>

      <!-- Where the actual content goes -->
      <div class="fixed inset-0 flex items-center justify-center">
        <div
          class="bg-darkmode-700 rounded border-2 border-gray-600 w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px]"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
defineProps({
  show: Boolean,
});
</script>

<style scoped>
@media (-webkit-device-pixel-ratio: 1.25) {
  .base-modal {
    zoom: 0.8;
  }
}
@media (-webkit-device-pixel-ratio: 1.5) {
  .base-modal {
    zoom: 0.66;
  }
}
@media (-webkit-device-pixel-ratio: 1.75) {
  .base-modal {
    zoom: 0.57;
  }
}
@media (-webkit-device-pixel-ratio: 2) {
  .base-modal {
    zoom: 0.5;
  }
}
</style>
