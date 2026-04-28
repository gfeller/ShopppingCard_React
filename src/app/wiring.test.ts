import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './state/auth-store';
import { useListStore } from './state/list-store';
import { useItemStore } from './state/item-store';
import { useUiStore } from './state/ui-store';
import type { IAuthUser } from './model/auth';
import type { IList } from './model/list';
import type { IItem } from './model/item';

// Capture callbacks passed to service methods
let authChangeCb: (user: IAuthUser | null) => void;
let onlineCb: (online: boolean) => void;
let listsCb: (lists: IList[]) => void;
let itemCallbacks: { onAdd: (items: IItem[]) => void; onRemove: (items: IItem[]) => void };

const unsubLists = vi.fn();
const unsubItems = vi.fn();

vi.mock('./services', () => ({
  authService: {
    onAuthChange: vi.fn((cb: (user: IAuthUser | null) => void) => {
      authChangeCb = cb;
    }),
    signInAnonymously: vi.fn(),
  },
  listService: {
    subscribeToLists: vi.fn((_uid: string, cb: (lists: IList[]) => void) => {
      listsCb = cb;
      return unsubLists;
    }),
  },
  itemService: {
    subscribeToList: vi.fn(
      (_id: string, cbs: { onAdd: (items: IItem[]) => void; onRemove: (items: IItem[]) => void }) => {
        itemCallbacks = cbs;
        return unsubItems;
      },
    ),
  },
  onlineService: {
    subscribe: vi.fn((cb: (online: boolean) => void) => {
      onlineCb = cb;
    }),
  },
}));

// Import after mocks are set up
const { authService, listService, itemService } = await import('./services');
const { initWiring } = await import('./wiring');

/** Flush microtasks so subscribeWithSelector listeners fire */
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('wiring', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({ currentUser: undefined });
    useListStore.setState({ currentListId: undefined, items: [] });
    useItemStore.setState({ items: {} });
    useUiStore.setState({ online: true });
    vi.clearAllMocks();
  });

  describe('online service → ui-store', () => {
    it('should set online to false', () => {
      initWiring();
      onlineCb(false);
      expect(useUiStore.getState().online).toBe(false);
    });

    it('should set online to true', () => {
      initWiring();
      onlineCb(true);
      expect(useUiStore.getState().online).toBe(true);
    });
  });

  describe('auth change → list subscription', () => {
    it('should call signInAnonymously when user is null', () => {
      initWiring();
      authChangeCb(null);
      expect(authService.signInAnonymously).toHaveBeenCalled();
    });

    it('should set currentUser when user is provided', () => {
      initWiring();
      const user: IAuthUser = { uid: 'u1', isAnonymous: false, email: 'a@b.c', displayName: 'A' };
      authChangeCb(user);
      expect(useAuthStore.getState().currentUser).toEqual(user);
    });

    it('should subscribe to lists when currentUser changes', async () => {
      initWiring();
      const user: IAuthUser = { uid: 'u1', isAnonymous: false, email: 'a@b.c', displayName: 'A' };
      authChangeCb(user);
      await flush();

      expect(listService.subscribeToLists).toHaveBeenCalledWith('u1', expect.any(Function));
    });

    it('should update list-store when lists callback fires', async () => {
      initWiring();
      const user: IAuthUser = { uid: 'u1', isAnonymous: false, email: null, displayName: null };
      authChangeCb(user);
      await flush();

      const lists: IList[] = [{ id: 'l1', description: 'Groceries' }];
      listsCb(lists);
      expect(useListStore.getState().items).toEqual(lists);
    });

    it('should unsubscribe previous list subscription when user changes', async () => {
      initWiring();
      authChangeCb({ uid: 'u1', isAnonymous: true, email: null, displayName: null });
      await flush();
      expect(unsubLists).not.toHaveBeenCalled();

      authChangeCb({ uid: 'u2', isAnonymous: true, email: null, displayName: null });
      await flush();
      expect(unsubLists).toHaveBeenCalled();
    });
  });

  describe('currentListId change → item subscription', () => {
    it('should subscribe to items when currentListId is set', async () => {
      initWiring();
      useListStore.getState().actions.setCurrentList('list-1');
      await flush();

      expect(itemService.subscribeToList).toHaveBeenCalledWith('list-1', {
        onAdd: expect.any(Function),
        onRemove: expect.any(Function),
      });
    });

    it('should add items via onAdd callback', async () => {
      initWiring();
      useListStore.getState().actions.setCurrentList('list-1');
      await flush();

      const items: IItem[] = [{ id: 'i1', description: 'Milk', listId: 'list-1' }];
      itemCallbacks.onAdd(items);
      expect(useItemStore.getState().items).toEqual({ i1: items[0] });
    });

    it('should remove items via onRemove callback', async () => {
      initWiring();
      const item: IItem = { id: 'i1', description: 'Milk', listId: 'list-1' };
      useItemStore.setState({ items: { i1: item } });

      useListStore.getState().actions.setCurrentList('list-1');
      await flush();

      itemCallbacks.onRemove([item]);
      expect(useItemStore.getState().items).toEqual({});
    });

    it('should clear items when currentListId changes', async () => {
      initWiring();
      useItemStore.setState({ items: { i1: { id: 'i1', description: 'X', listId: 'l' } as IItem } });

      useListStore.getState().actions.setCurrentList('list-2');
      await flush();

      // items cleared before new subscription
      expect(useItemStore.getState().items).toEqual({});
    });

    it('should clear items and not subscribe when currentListId set to undefined', async () => {
      initWiring();
      useListStore.getState().actions.setCurrentList('list-1');
      await flush();
      vi.clearAllMocks();

      useItemStore.setState({ items: { i1: { id: 'i1', description: 'X', listId: 'l' } as IItem } });
      useListStore.getState().actions.setCurrentList(undefined);
      await flush();

      expect(useItemStore.getState().items).toEqual({});
      expect(itemService.subscribeToList).not.toHaveBeenCalled();
    });

    it('should unsubscribe previous item subscription when list changes', async () => {
      initWiring();
      useListStore.getState().actions.setCurrentList('list-1');
      await flush();
      expect(unsubItems).not.toHaveBeenCalled();

      useListStore.getState().actions.setCurrentList('list-2');
      await flush();
      expect(unsubItems).toHaveBeenCalled();
    });
  });
});
