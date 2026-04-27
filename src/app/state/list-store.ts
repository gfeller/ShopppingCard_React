import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { IList } from '../model/list';
import { listService } from '../services';

interface ListState {
  currentListId: string | undefined;
  items: IList[];
  setCurrentList: (id: string | undefined) => void;
  setList: (items: IList[]) => void;
  addList: (description: string) => Promise<void>;
  updateList: (list: IList) => Promise<void>;
  removeList: (id: string) => Promise<void>;
  addShareList: (listId: string) => Promise<void>;
  removeShareList: (listId: string) => Promise<void>;
}

export const useListStore = create<ListState>()(
  subscribeWithSelector((set) => ({
    currentListId: undefined,
    items: [],
    setCurrentList: (id) => set({ currentListId: id }),
    setList: (items) => set({ items }),
    addList: (description) => listService.addList(description),
    updateList: (list) => listService.update(list),
    removeList: (id) => listService.remove(id),
    addShareList: (listId) => listService.addShareList(listId),
    removeShareList: (listId) => listService.removeShareList(listId),
  }))
);
