import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { IList } from '../model/list';
import { listService } from '../services';

interface ListActions {
  setCurrentList: (id: string | undefined) => void;
  setList: (items: IList[]) => void;
  addList: (description: string) => Promise<void>;
  updateList: (list: IList) => Promise<void>;
  removeList: (id: string) => Promise<void>;
  addShareList: (listId: string) => Promise<void>;
  removeShareList: (listId: string) => Promise<void>;
}

interface ListState {
  currentListId: string | undefined;
  items: IList[];
  actions: ListActions;
}

export const useListStore = create<ListState>()(
  subscribeWithSelector((set, get) => ({
    currentListId: undefined,
    items: [],
    actions: {
      setCurrentList: (id) => set({ currentListId: id }),
      setList: (items) => set({ items }),
      addList: (description) => listService.addList(description),
      updateList: (list) => listService.update(list),
      removeList: (id) => {
        if (get().currentListId === id) {
          set({ currentListId: undefined });
        }
        return listService.remove(id);
      },
      addShareList: (listId) => listService.addShareList(listId),
      removeShareList: (listId) => listService.removeShareList(listId),
    },
  }))
);

export const useListActions = () => useListStore((s) => s.actions);
