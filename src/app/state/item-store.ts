import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { IItem } from '../model/item';
import { itemService } from '../services';

interface ItemState {
  items: Record<string, IItem>;
  add: (items: IItem[]) => void;
  remove: (items: IItem[]) => void;
  clear: () => void;
  addItem: (item: IItem) => Promise<void>;
  updateItem: (item: IItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleBought: (item: IItem) => Promise<void>;
}

export const useItemStore = create<ItemState>()((set) => ({
  items: {},
  add: (incoming) =>
    set((state) => {
      const next = { ...state.items };
      incoming.forEach((x) => { next[x.id!] = x; });
      return { items: next };
    }),
  remove: (incoming) =>
    set((state) => {
      const next = { ...state.items };
      incoming.forEach((x) => { delete next[x.id!]; });
      return { items: next };
    }),
  clear: () => set({ items: {} }),
  addItem: async (item) => {
    await itemService.add(item as IItem);
  },
  updateItem: async (item) => {
    await itemService.update(item);
  },
  removeItem: async (id) => {
    await itemService.remove(id);
  },
  toggleBought: async (item: IItem) => {
    if (item.boughtAt) {
      await itemService.add({ description: item.description, listId: item.listId });
    } else {
      await itemService.update({ ...item, boughtAt: Timestamp.now() });
    }
  },
}));
