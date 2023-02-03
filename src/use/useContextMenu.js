import { ref } from "vue";
import { useSelection } from "@/use/useSelection";

const levelTitleContextRef = ref(null);
const kanjiContextRef = ref(null);
const headerBarContextRef = ref(null);

export function useContextMenu() {
  // This composable gives a central reference to all context menus, so all other menus can be close when opening a context menu without having to use a complicated control flow. Options and selection callbacks are handled in the components.
  const refs = [levelTitleContextRef, kanjiContextRef, headerBarContextRef];

  const closeOtherMenus = (openRef) => {
    refs.forEach((menuRef) => {
      if (menuRef.value && menuRef.value !== openRef.value)
        menuRef.value.hideContextMenu();
    });
  };

  const {
    selectLevel,
    selectAllUpToLevel,
    selectAllFromLevel,
    selectAllUpToKanji,
    selectAllFromKanji,
  } = useSelection();

  /*
  ===============
  Level title:
  ===============
  */
  const levelTitleContextOptions = [
    { name: "Select up to", class: "select-up-to" },
    { name: "Deselect up to", class: "deselect-up-to" },
    { type: "divider" },
    { name: "Select from", class: "select-from" },
    { name: "Deselect from", class: "deselect-from" },
  ];
  const levelTitleContextOptionClicked = (event) => {
    const levelIdx = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "select-up-to":
        selectAllUpToLevel(levelIdx, true, false);
        break;
      case "deselect-up-to":
        selectAllUpToLevel(levelIdx, false, false);
        break;
      case "select-from":
        selectAllFromLevel(levelIdx, true, false);
        break;
      case "deselect-from":
        selectAllFromLevel(levelIdx, false, false);
        break;
      default:
        console.log("Invalid selection");
    }
  };
  const onLevelTitleContext = (event, item) => {
    closeOtherMenus(levelTitleContextRef);
    levelTitleContextRef.value.showMenu(event, item);
  };

  /*
  ===============
  Kanji character:
  ===============
  */
  const kanjiContextOptions = [
    { name: "Display details", class: "display-details" },
    { type: "divider" },
    { name: "Select up to", class: "select-up-to" },
    { name: "Deselect up to", class: "deselect-up-to" },
    { type: "divider" },
    { name: "Select from", class: "select-from" },
    { name: "Deselect from", class: "deselect-from" },
  ];
  const kanjiContextOptionClicked = (event) => {
    const levelIdx = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "display-details":
        console.log("todo");
        break;
      case "select-up-to":
        selectAllUpToKanji(levelIdx, true, false);
        break;
      case "deselect-up-to":
        selectAllUpToKanji(levelIdx, false, false);
        break;
      case "select-from":
        selectAllFromKanji(levelIdx, true, false);
        break;
      case "deselect-from":
        selectAllFromKanji(levelIdx, false, false);
        break;
      default:
        console.log("Invalid selection");
    }
  };
  const onKanjiContext = (event, item) => {
    closeOtherMenus(kanjiContextRef);
    kanjiContextRef.value.showMenu(event, item);
  };

  /*
  ===============
  Header bar:
  ===============
  */
  const headerBarContextOptions = [
    { name: "Select level", class: "select-level" },
    { name: "Deselect level", class: "deselect-level" },
    { type: "divider" },
    { name: "Select up to", class: "select-up-to" },
    { name: "Deselect up to", class: "deselect-up-to" },
    { type: "divider" },
    { name: "Select from", class: "select-from" },
    { name: "Deselect from", class: "deselect-from" },
  ];
  const headerBarContextOptionClicked = (event) => {
    const levelIdx = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "select-level":
        selectLevel(levelIdx, true);
        break;
      case "deselect-level":
        selectLevel(levelIdx, false);
        break;
      case "select-up-to":
        selectAllUpToLevel(levelIdx, true, false);
        break;
      case "deselect-up-to":
        selectAllUpToLevel(levelIdx, false, false);
        break;
      case "select-from":
        selectAllFromLevel(levelIdx, true, false);
        break;
      case "deselect-from":
        selectAllFromLevel(levelIdx, false, false);
        break;
      default:
        console.log("Invalid selection");
    }
  };
  const onHeaderBarContext = (event, item) => {
    closeOtherMenus(headerBarContextRef);
    headerBarContextRef.value.showMenu(event, item);
  };

  return {
    levelTitleContextOptions,
    levelTitleContextOptionClicked,
    onLevelTitleContext,
    levelTitleContextRef,

    kanjiContextOptions,
    kanjiContextOptionClicked,
    onKanjiContext,
    kanjiContextRef,

    headerBarContextOptions,
    headerBarContextOptionClicked,
    onHeaderBarContext,
    headerBarContextRef,
  };
}
