import { create } from 'zustand';
import { Message, Severity } from '../model/message';

interface UiActions {
  setOnline: (online: boolean) => void;
  toggleListEdit: () => void;
  setMessage: (message: Omit<Message, 'show'>) => void;
  resetMessage: () => void;
}

interface UiState {
  online: boolean;
  showListEdit: boolean;
  message: Message;
  actions: UiActions;
}

export const useUiStore = create<UiState>()((set) => ({
  online: true,
  showListEdit: false,
  message: { show: false, text: '', severity: Severity.info },
  actions: {
    setOnline: (online) => set({ online }),
    toggleListEdit: () => set((state) => ({ showListEdit: !state.showListEdit })),
    setMessage: (message) => set({ message: { show: true, ...message } }),
    resetMessage: () =>
      set((state) => ({ message: { ...state.message, show: false } })),
  },
}));

export const useUiActions = () => useUiStore((s) => s.actions);
