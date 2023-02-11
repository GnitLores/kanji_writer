import { ref } from "vue";
import { useStoreKanji } from "@/stores/storeKanji";
import { useStoreOptions } from "@/stores/storeOptions";
import { useSelection } from "@/use/useSelection";

const levelTitleContextRef = ref(null);
const kanjiContextRef = ref(null);
const headerBarContextRef = ref(null);

export function useContextMenu() {
  const storeKanji = useStoreKanji();
  const storeOptions = useStoreOptions();

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
    const levelName = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "select-up-to":
        !storeOptions.reverseOrder
          ? selectAllUpToLevel(levelName, true, false)
          : selectAllFromLevel(levelName, true, false);
        break;
      case "deselect-up-to":
        !storeOptions.reverseOrder
          ? selectAllUpToLevel(levelName, false, false)
          : selectAllFromLevel(levelName, false, false);
        break;
      case "select-from":
        !storeOptions.reverseOrder
          ? selectAllFromLevel(levelName, true, false)
          : selectAllUpToLevel(levelName, true, false);
        break;
      case "deselect-from":
        !storeOptions.reverseOrder
          ? selectAllFromLevel(levelName, false, false)
          : selectAllUpToLevel(levelName, false, false);
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
    const kanji = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "display-details":
        storeOptions.displayKanjiDetailsModal(kanji.char);
        break;
      case "select-up-to":
        !storeOptions.reverseOrder
          ? selectAllUpToKanji(kanji, true, false)
          : selectAllFromKanji(kanji, true, false);
        break;
      case "deselect-up-to":
        !storeOptions.reverseOrder
          ? selectAllUpToKanji(kanji, false, false)
          : selectAllFromKanji(kanji, false, false);
        break;
      case "select-from":
        !storeOptions.reverseOrder
          ? selectAllFromKanji(kanji, true, false)
          : selectAllUpToKanji(kanji, true, false);
        break;
      case "deselect-from":
        !storeOptions.reverseOrder
          ? selectAllFromKanji(kanji, false, false)
          : selectAllUpToKanji(kanji, false, false);
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
    const levelName = event.item;
    const selection = event.option.class;
    switch (selection) {
      case "select-level":
        selectLevel(levelName, true);
        break;
      case "deselect-level":
        selectLevel(levelName, false);
        break;
      case "select-up-to":
        selectAllUpToLevel(levelName, true, false);
        break;
      case "deselect-up-to":
        selectAllUpToLevel(levelName, false, false);
        break;
      case "select-from":
        selectAllFromLevel(levelName, true, false);
        break;
      case "deselect-from":
        selectAllFromLevel(levelName, false, false);
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
