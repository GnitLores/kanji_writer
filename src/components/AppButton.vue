<template>
  <button
    class="select-none border font-semibold rounded text-s w-14 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50"
    @click.prevent="$emit('clicked')"
  >
    {{ text }}
  </button>
</template>
<!-- class="select-none bg-darkmode-500 hover:bg-blue-500 text-sky-100 text-s font-semibold hover:text-white border border-sky-700 hover:border-transparent rounded w-14 disabled:opacity-50" -->

<!-- class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700
dark:border-gray-700" -->

<!-- class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" -->
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
