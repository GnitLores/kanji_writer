<template>
  <div class="select-none">
    <!--
    ===============
    Header
    ===============
    -->
    <div class="flex my-1">
      <div class="selection-bar grow mx-2">
        <div
          v-for="level in selectionStats.levels"
          v-show="level.doDisplay"
          :key="level.name"
          class="inline-block relative bg-gray-900 border-solid border-r-2 border-y-2 border-sky-700 h-full"
          :class="[
            level.name === selectionStats.firstDisplayedLevel
              ? 'border-l-2'
              : '',
          ]"
          :style="{
            width: `${100 * (1 / selectionStats.nDisplayedLevels)}%`,
          }"
          @click.prevent="emit('levelClicked', level.name)"
        >
          <span
            class="absolute text-center w-full pt-0.5 text-sky-200 text-xs font-bold z-10 cursor-pointer hover:text-green-400"
            >{{ level.name }}</span
          >
          <div
            class="bg-sky-700 w-1/2 h-full opacity-70 z-0"
            :style="{
              width: `${100 * (level.nSelected / level.nKanji)}%`,
            }"
          ></div>
        </div>
      </div>

      <div class="mr-2">
        <div
          v-if="!storeOptions.showDisplayOptions"
          @click.prevent="
            storeOptions.showDisplayOptions = !storeOptions.showDisplayOptions
          "
        >
          <span
            ><p class="text-sky-200 inline-block mr-2 font-bold">Options</p>
            <i class="fas fa-angles-down text-sky-200"></i
          ></span>
        </div>
        <div
          v-else
          @click.prevent="
            storeOptions.showDisplayOptions = !storeOptions.showDisplayOptions
          "
        >
          <span
            ><p class="text-sky-200 inline-block mr-2 font-bold underline">
              Options
            </p>
            <i class="fas fa-angles-up text-sky-200"></i
          ></span>
        </div>
      </div>
    </div>
    <!--
    ===============
    Display Options:
    ===============
    -->
    <transition name="slide">
      <div v-show="storeOptions.showDisplayOptions" class="flex ml-4">
        <p class="text-sky-200 mr-4 font-bold">Ignore:</p>
        <div v-for="level in storeList.levelNames" :key="level">
          <input
            type="checkbox"
            :value="level"
            v-model="storeOptions.ignoredLevels"
          />
          <label class="text-sky-200 tracking-wide mr-4 ml-0.5 font-bold">{{
            level
          }}</label>
        </div>

        <div class="grow"></div>

        <div class="mx-2">
          <label class="text-sky-200 font-bold">Reverse: </label>
          <input
            class="mr-4"
            type="checkbox"
            v-model="storeOptions.reverseOrder"
          />
          <label class="text-sky-200 font-bold">By level: </label>
          <input type="checkbox" v-model="storeOptions.doDisplayLevels" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  computed,
  defineProps,
} from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";

const storeList = useStoreList();
const storeOptions = useStoreOptions();

const props = defineProps({
  selectionStats: {
    type: Object,
    default: true,
  },
});

const emit = defineEmits(["levelClicked"]);
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.3s;
}
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from, .slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-1rem);
  opacity: 0;
}
</style>
