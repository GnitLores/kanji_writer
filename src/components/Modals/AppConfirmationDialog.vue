<template>
  <Teleport to="#modals">
    <div
      v-if="isRevealed"
      class="fixed bg-white text-red-500 text-2xl h-48 w-48"
      :style="{ left: modalX + 'px', top: modalY + 'px' }"
    >
      <div class="modal">
        <h2>{{ text }}</h2>
        <button @click="confirm">Yes</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useMouse } from "@vueuse/core";
import { useConfirmDialog } from "@vueuse/core";

const { x, y, sourceType } = useMouse();
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } =
  useConfirmDialog();

const props = defineProps({
  text: {
    type: String,
    default: "Are you sure?",
  },
});

let modalX = 0;
let modalY = 0;

const emit = defineEmits(["onConfirm", "onCancel"]);

onConfirm(() => {
  emit("onConfirm");
});

onCancel(() => {
  emit("onCancel");
});

const showDialog = () => {
  modalX = x.value;
  modalY = y.value;
  reveal();
};

defineExpose({
  showDialog,
});
</script>

<style scoped></style>
