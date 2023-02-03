import { ref } from "vue";

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

  const onLevelTitleContext = (event, item) => {
    closeOtherMenus(levelTitleContextRef);
    levelTitleContextRef.value.showMenu(event, item);
  };

  const onKanjiContext = (event, item) => {
    closeOtherMenus(kanjiContextRef);
    kanjiContextRef.value.showMenu(event, item);
  };

  const onHeaderBarContext = (event, item) => {
    closeOtherMenus(headerBarContextRef);
    headerBarContextRef.value.showMenu(event, item);
  };

  return {
    onLevelTitleContext,
    levelTitleContextRef,

    onKanjiContext,
    kanjiContextRef,

    onHeaderBarContext,
    headerBarContextRef,
  };
}
