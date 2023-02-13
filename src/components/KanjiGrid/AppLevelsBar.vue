<template>
  <div>
    <VueSimpleContextMenu
      element-id="header-bar-context"
      :options="headerBarContextOptions"
      ref="headerBarContextRef"
      @option-clicked="headerBarContextOptionClicked"
    />

    <div class="flex my-1">
      <AppButton
        :disabled="selectionStats.nSelected == 0"
        :text="'None'"
        class=""
        @clicked="selectAll(false)"
      />
      <div class="selection-bar grow mx-2">
        <div
          v-for="level in selectionStats"
          :key="level.name"
          class="inline-block relative border-solid first:border-l-2 border-r-2 border-y-2 first:rounded-l last:rounded-r border-gray-600 h-full"
          :class="[
            storeOptions.isLevelIgnored(level.name)
              ? 'bg-gray-600 bg-opacity-50'
              : 'bg-darkmode-500',
          ]"
          :style="{
            width: `${100 * (1 / selectionStats.length)}%`,
          }"
          @click.prevent="onLeftClick(level.name)"
          @contextmenu.prevent.stop="onRightClick($event, level.name)"
        >
          <span
            class="absolute text-center w-full pt-0.5 text-sky-200 text-xs font-bold z-10 hover:text-white truncate hover:text-clip"
            :class="[
              storeOptions.isLevelIgnored(level.name)
                ? 'opacity-50'
                : 'cursor-pointer',
            ]"
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

      <div class="mr-2 cursor-pointer w-24">
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

    <transition name="slideDown">
      <div v-show="storeOptions.showDisplayOptions" class="flex">
        <p class="text-sky-100 font-bold w-14">Ignore:</p>
        <div class="flex grow mx-2">
          <div
            class="truncate hover:text-clip flex justify-center first:border-l-2 border-r-2 border-y-2 border-gray-600 border-hidden"
            v-for="level in storeList.levelNames"
            :key="level"
            :style="{
              width: `${100 * (1 / selectionStats.length)}%`,
            }"
          >
            <input
              type="checkbox"
              :value="level"
              v-model="storeOptions.ignoredLevels"
              @change="onIgnoreLevelChange($event)"
            />
            <!-- <label class="text-sky-200 tracking-wide ml-0.5 font-bold">{{
                level
              }}</label> -->
          </div>
        </div>
        <div class="w-24 mr-2"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreList } from "@/stores/storeList";
import VueSimpleContextMenu from "@/components/AppContextMenu.vue";
import AppButton from "@/components/AppButton.vue";
import { useSelection } from "@/use/useSelection";
import { useSelectionStats } from "@/use/useSelectionStats";
import { useContextMenu } from "@/use/useContextMenu";

const storeOptions = useStoreOptions();
const storeList = useStoreList();

const { selectionType } = inject("selectionType");

const rangeSelectionEnabled = computed(() => selectionType === "range");
const singleSelectionEnabled = computed(() => selectionType === "single");

const { selectAllUpToLevel, selectAll, selectLevel, selected } = useSelection();
const { selectionStats } = useSelectionStats();

const {
  headerBarContextOptions,
  headerBarContextOptionClicked,
  onHeaderBarContext,
  headerBarContextRef,
} = useContextMenu();

const toggleDisplayOptions = () => {
  storeOptions.showDisplayOptions = !storeOptions.showDisplayOptions;
};

const onIgnoreLevelChange = (event) => {
  const levelName = event.target.value;
  selectLevel(levelName, false);
};

const onLeftClick = (levelName) => {
  if (!rangeSelectionEnabled.value) return;
  if (storeOptions.isLevelIgnored(levelName)) {
  } else {
    selectAllUpToLevel(levelName);
  }
};

const onRightClick = (event, levelName) => {
  if (!rangeSelectionEnabled.value) return;
  if (storeOptions.isLevelIgnored(levelName)) {
  } else {
    onHeaderBarContext(event, levelName);
  }
};
</script>

<style scoped></style>
