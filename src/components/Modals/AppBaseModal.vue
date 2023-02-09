<template>
  <Teleport to="#modals">
    <!-- Show / hide the modal -->
    <div v-if="show" class="">
      <!-- The backdrop -->
      <div class="fixed inset-0 bg-gray-900 opacity-40"></div>

      <!-- Where the actual content goes -->
      <div class="fixed inset-0 flex items-center justify-center">
        <div
          class="bg-darkmode-700 rounded border-2 border-gray-600 w-full sm:w-[640px] md:w-[768px] lg:w-[1024px]"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<!-- class="bg-darkmode-700 rounded border-2 border-gray-600 w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1536px]" -->
<script setup>
defineProps({
  show: Boolean,
});
</script>
