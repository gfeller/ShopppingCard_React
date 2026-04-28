import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AuthConnect, IAuthUser, ProfileChange } from '../model/auth';
import { authService } from '../services';

interface AuthActions {
  setUser: (user: IAuthUser) => void;
  connectUser: (data: AuthConnect) => Promise<void>;
  login: (data: AuthConnect) => Promise<void>;
  resetPwdMail: (email: string) => Promise<void>;
  updateProfile: (data: ProfileChange) => Promise<void>;
  updatePassword: (email: string, pwdOld: string, pwd: string) => Promise<void>;
}

interface AuthState {
  currentUser: IAuthUser | undefined | null;
  actions: AuthActions;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    currentUser: undefined,
    actions: {
      setUser: (user) => set({ currentUser: user }),
      connectUser: (data) => authService.connectUser(data),
      login: (data) => authService.login(data),
      resetPwdMail: (email) => authService.resetPwdMail(email),
      updateProfile: async (data) => {
        await authService.updateProfile(data);
        set({ currentUser: authService.auth.currentUser });
      },
      updatePassword: (email, pwdOld, pwd) => authService.updatePassword(email, pwdOld, pwd),
    },
  }))
);

export type { IAuthUser };
export const isConnected = (state: AuthState) => !!state.currentUser?.email;
export const displayName = (state: AuthState) =>
  state.currentUser?.displayName ||
  state.currentUser?.email ||
  state.currentUser?.uid.substring(0, 10);

export const useAuthActions = () => useAuthStore((s) => s.actions);
