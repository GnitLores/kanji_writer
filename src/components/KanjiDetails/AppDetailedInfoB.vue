<template>
  <div class="">
    <ul class="capitalize font-semibold">
      <li class="pt-2 border-b border-gray-600">
        <div class="">
          <ul>
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
import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreKanji } from "@/stores/storeKanji";

const storeKanji = useStoreKanji();
const storeOptions = useStoreOptions();

const meaningStrings = computed(() => {
  const strs = storeKanji.kanjiData.meaning.split(" ");
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
