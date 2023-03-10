<template>
  <Teleport to="#modals">
    <div v-if="isRevealed">
      <div class="fixed inset-0 bg-black opacity-40"></div>
      <div
        class="fixed bg-gray-800 border-gray-600 border-2 rounded p-4 opacity-100"
        :style="{ left: modalX + 'px', top: modalY + 'px' }"
        ref="modalRef"
      >
        <h2 class="text-white text-opacity-80 text-xl">
          {{ text }}
        </h2>
        <div class="flex justify-center mt-4">
          <AppButton
            :text="'Yes'"
            class="w-20 text-base h-10 mb-2"
            @clicked="confirm"
          />
          <AppButton
            :text="'Cancel'"
            class="w-20 text-base h-10 mb-2 ml-4"
            @clicked="cancel"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMouse } from "@vueuse/core";
import { useConfirmDialog } from "@vueuse/core";
import AppButton from "@/components/AppButton.vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["onConfirm", "onCancel"]);

const { x, y, sourceType } = useMouse();
const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } =
  useConfirmDialog();

const modalRef = ref(null);
onClickOutside(modalRef, () => {
  cancel();
});

const props = defineProps({
  text: {
    type: String,
    default: "Are you sure?",
  },
});

let modalX = 0;
let modalY = 0;

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

const keepInBounds = () => {
  if (!modalRef.value) return;
  const w = modalRef.value.offsetWidth;
  const h = modalRef.value.offsetHeight;
  const currentPos = modalRef.value.getBoundingClientRect();
  if (currentPos.x + w > window.innerWidth)
    modalRef.value.style.left = currentPos.x - w * 1.1 + "px";
  if (currentPos.y + h > window.innerHeight)
    modalRef.value.style.top = currentPos.y - h * 1.1 + "px";
};

watch(modalRef, keepInBounds);

defineExpose({
  showDialog,
});
</script>

<style scoped></style>
