import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AuthConnect, AuthUserSettingsChange, IAuthUser } from '../model/auth';
import { authService } from '../services';

interface AuthState {
  currentUser: IAuthUser | undefined | null;
  setUser: (user: IAuthUser) => void;
  connectUser: (data: AuthConnect) => Promise<void>;
  login: (data: AuthConnect) => Promise<void>;
  resetPwdMail: (email: string) => Promise<void>;
  changeUser: (data: Partial<AuthUserSettingsChange>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    currentUser: undefined,
    setUser: (user) => set({ currentUser: user }),
    connectUser: (data) => authService.connectUser(data),
    login: (data) => authService.login(data),
    resetPwdMail: (email) => authService.resetPwdMail(email),
    changeUser: async (data) => {
      await authService.changeUser(data);
      set({ currentUser: authService.auth.currentUser })
    },
  }))
);

export type { IAuthUser };
export const isConnected = (state: AuthState) => !!state.currentUser?.email;
export const displayName = (state: AuthState) =>
  state.currentUser?.displayName ||
  state.currentUser?.email ||
  state.currentUser?.uid.substring(0, 10);
