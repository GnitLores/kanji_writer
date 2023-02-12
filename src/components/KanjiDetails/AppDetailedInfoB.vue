<template>
  <div
    class="overflow-y-auto"
    :class="[
      storeOptions.showDetailsStrokeOrder ? `max-h-[450px]` : `max-h-[300px]`,
    ]"
  >
    <ul class="capitalize font-semibold">
      <li class="pt-2 border-b border-gray-600">
        <div>
          <ul class="">
            <li
              v-for="meaning in meaningStrings"
              :key="meaning"
              class="text-white text-opacity-80"
            >
              {{ meaning }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";

const storeOptions = useStoreOptions();

const { kanji } = inject("kanji");

const meaningStrings = computed(() => {
  const strs = kanji.data.meaning.split(" ");
  const parsed = [];
  const divider = " - ";
  parsed.push(strs.shift());
  if (isLineStart(parsed[0])) parsed[0] += divider;

  strs.forEach((str) => {
    if (isLineStart(str)) {
      parsed.push(str + divider);
    } else {
      parsed[parsed.length - 1] += str;
    }
  });
  return parsed;
});

const isLineStart = (str) => {
  return str.length === 2 && isCharNumber(str[0]);
};

const isCharNumber = (c) => {
  return c >= "0" && c <= "9";
};
</script>

<style scoped></style>
