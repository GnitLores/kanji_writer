import { ref, watch } from "vue";
import { useDisplayData } from "@/use/useDisplayData";

const input = ref("");
const searchedChars = ref(new Set());

export function useSearch() {
  const displayData = useDisplayData();

  const clearSearch = () => {
    input.value = "";
  };

  const onInputChange = (newInput, oldInput) => {
    console.log(oldInput, newInput);
  };

  return { input, clearSearch, onInputChange };
}
