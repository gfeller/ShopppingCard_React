import { authService, itemService, listService, onlineService } from './services';
import { useAuthStore } from './state/auth-store';
import { useItemStore } from './state/item-store';
import { useListStore } from './state/list-store';
import { useUiStore } from './state/ui-store';
import { storeEffect } from './state/store-effect';

export function initWiring() {
  // Auth: bridge Firebase auth state into the store
  authService.onAuthChange((user) => {
    if (user === null) {
      authService.signInAnonymously();
    } else {
      useAuthStore.getState().actions.setUser(user);
      useAuthStore.getState().actions.initNotificationState();
    }
  });

  // Lists: when the authenticated user changes, (re)subscribe to their lists
  storeEffect(useAuthStore, (s) => s.currentUser, (user) => {
    if (!user) return;
    return listService.subscribeToLists(user.uid, (lists) =>
      useListStore.getState().actions.setList(lists),
    );
  });

  // Items: when the selected list changes, (re)subscribe to its items
  storeEffect(useListStore, (s) => s.currentListId, (id) => {
    useItemStore.getState().actions.clear();
    if (!id) return;
    return itemService.subscribeToList(id, {
      onAdd: (items) => useItemStore.getState().actions.add(items),
      onRemove: (items) => useItemStore.getState().actions.remove(items),
    });
  });

  // Online status
  onlineService.subscribe((online) => useUiStore.getState().actions.setOnline(online));
}
