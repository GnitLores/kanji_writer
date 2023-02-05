import { ref } from "vue";

const input = ref("");

export function useSearch() {
  const clearSearch = () => {
    input.value = "";
  };
  return { input, clearSearch };
}
