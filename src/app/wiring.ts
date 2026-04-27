import { authService, itemService, listService, onlineService } from './services';
import { useAuthStore } from './state/auth-store';
import { useItemStore } from './state/item-store';
import { useListStore } from './state/list-store';
import { useUiStore } from './state/ui-store';

export function initWiring() {
  // Auth: bridge Firebase auth state into the store
  authService.onAuthChange((user) => {
    if (user === null) {
      authService.signInAnonymously();
    } else {
      useAuthStore.getState().setUser(user);
    }
  });

  // Lists: when the authenticated user changes, (re)subscribe to their lists
  let unsubLists: (() => void) | undefined;
  useAuthStore.subscribe(
    (state) => state.currentUser,
    (user) => {
      unsubLists?.();
      unsubLists = undefined;
      if (user) {
        unsubLists = listService.subscribeToLists(user.uid, (lists) =>
          useListStore.getState().setList(lists)
        );
      }
    }
  );

  // Items: when the selected list changes, (re)subscribe to its items
  let unsubItems: (() => void) | undefined;
  useListStore.subscribe(
    (state) => state.currentListId,
    (id) => {
      unsubItems?.();
      unsubItems = undefined;
      useItemStore.getState().clear();
      if (id) {
        unsubItems = itemService.subscribeToList(id, {
          onAdd: (items) => useItemStore.getState().add(items),
          onRemove: (items) => useItemStore.getState().remove(items),
        });
      }
    }
  );

  // Online status
  onlineService.subscribe((online) => useUiStore.getState().setOnline(online));
}
