<template>
  <button
    class="select-none bg-darkmode-500 hover:bg-blue-500 text-sky-100 text-s font-semibold hover:text-white border border-sky-700 hover:border-transparent rounded w-14 disabled:opacity-50"
    @click.prevent="$emit('clicked')"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "button",
  },
});
defineEmits(["clicked"]);
</script>

<style scoped></style>
