<template>
  <div class="container mx-auto">
    <AppLearnControls />
  </div>
</template>

<script setup>
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";

import AppLearnControls from "@/components/Learn/AppLearnControls.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected } = useSelection();
</script>

<style scoped></style>
