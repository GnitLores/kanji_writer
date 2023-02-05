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
    if (newInput === oldInput) return;
    if (oldInput === "" && newInput !== "") startSearch();
    if (newInput === "" && oldInput !== "") stopSearch();

    if (newInput.length > oldInput.length)
      addChars(newInput.slice(oldInput.length));

    if (newInput.length < oldInput.length)
      removeChars(oldInput.slice(newInput.length));
  };

  const startSearch = () => {};
  const stopSearch = () => {};
  const addChars = (chars) => {
    console.log("add", chars);
  };
  const removeChars = (chars) => {
    console.log("remove", chars);
  };

  return { input, clearSearch, onInputChange };
}
