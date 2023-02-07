<template>
  <Teleport to="#modals">
    <!-- Show / hide the modal -->
    <div v-if="show" class="">
      <!-- The backdrop -->
      <div class="fixed inset-0 bg-gray-900 opacity-40"></div>

      <!-- Where the actual content goes -->
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-darkmode-700 rounded">
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
