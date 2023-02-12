<template>
  <div class="container mx-auto flex h-[400px]">
    <div class="inline-block w-48">
      <ul>
        <li>
          <AppButton
            :disabled="!selected || !selected.some((val) => val)"
            :text="'Set as known'"
            class="w-32 text-lg h-10"
            @clicked=""
          />
        </li>

        <li>
          <AppButton
            :text="'Test'"
            class="w-32 text-lg h-10"
            @clicked="onTest"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";
import { useSelection } from "@/use/useSelection";
import AppButton from "@/components/AppButton.vue";

const storeOptions = useStoreOptions();
//
const { selected } = useSelection();
console.log(selected);

const onTest = () => {
  console.log(!selected.value);
  console.log(!selected.value.some((val) => val === true));
};
</script>

<style scoped></style>
