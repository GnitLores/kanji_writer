<template>
  <VueSimpleContextMenu
    element-id="header-bar-context"
    :options="headerBarContextOptions"
    ref="headerBarContextRef"
    @option-clicked="headerBarContextOptionClicked"
  />

  <div class="container mx-auto select-none my-2">
    <!--
    ===============
    Header
    ===============
    -->
    <div class="flex my-1">
      <AppButton
        :disabled="selectionStats.nSelected == 0"
        :text="'None'"
        class=""
        @clicked="selectAll(false)"
      />
      <div class="selection-bar grow mx-2">
        <div
          v-for="level in selectionStats.levels"
          v-show="!storeOptions.allLevelsIgnored()"
          :key="level.name"
          class="inline-block relative bg-darkmode-500 border-solid first:border-l-2 border-r-2 border-y-2 border-gray-600 h-full"
          :style="{
            width: `${100 * (1 / selectionStats.nDisplayedLevels)}%`,
          }"
          @click.prevent="selectAllUpToLevel(level.levelIdx)"
          @contextmenu.prevent.stop="onHeaderBarContext($event, level.levelIdx)"
        >
          <span
            class="absolute text-center w-full pt-0.5 text-sky-200 text-xs font-bold z-10 cursor-pointer hover:text-white truncate hover:text-clip"
            >{{ level.name }}</span
          >
          <div
            class="bg-sky-700 bg-opacity-70 w-1/2 h-full opacity-70 z-0"
            :style="{
              width: `${100 * (level.nSelected / level.nKanji)}%`,
            }"
          ></div>
        </div>
      </div>

      <div class="mr-2 cursor-pointer">
        <div
          v-if="!storeOptions.showDisplayOptions"
          @click.prevent="
            storeOptions.showDisplayOptions = !storeOptions.showDisplayOptions
          "
        >
          <span
            ><p class="text-sky-100 inline-block mr-2 font-bold">Options</p>
            <i class="fas fa-angles-down text-sky-100"></i
          ></span>
        </div>
        <div v-else @click.prevent="toggleDisplayOptions">
          <span
            ><p class="text-sky-100 inline-block mr-2 font-bold underline">
              Options
            </p>
            <i class="fas fa-angles-up text-sky-100"></i
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
      <div v-show="storeOptions.showDisplayOptions" class="flex">
        <p class="text-sky-100 mr-4 font-bold">Ignore:</p>
        <div
          class="truncate hover:text-clip"
          v-for="level in storeList.levelNames"
          :key="level"
        >
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

        <div class="">
          <div class="inline-block ml-2">
            <input
              class=""
              type="checkbox"
              v-model="storeOptions.reverseOrder"
            />
            <label class="text-sky-100 font-bold ml-1">Reverse</label>
          </div>
          <div class="inline-block ml-2">
            <input type="checkbox" v-model="storeOptions.doDisplayLevels" />
            <label class="text-sky-100 font-bold ml-1">By level</label>
          </div>
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
} from "vue";
import { useStoreList } from "@/stores/storeList";
import { useStoreOptions } from "@/stores/storeOptions";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";
import AppButton from "@/components/AppButton.vue";
import { useSelectionStats } from "@/use/useSelectionStats";
import { useSelection } from "@/use/useSelection";
import { useContextMenu } from "@/use/useContextMenu";

const storeList = useStoreList();
const storeOptions = useStoreOptions();

const { selectionStats } = useSelectionStats();
const { selectAllUpToLevel, selectAll } = useSelection();

const toggleDisplayOptions = () => {
  storeOptions.showDisplayOptions = !storeOptions.showDisplayOptions;
};
/*
===============
Context Menus:
===============
*/
const {
  headerBarContextOptions,
  headerBarContextOptionClicked,
  onHeaderBarContext,
  headerBarContextRef,
} = useContextMenu();
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
