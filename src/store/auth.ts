import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth';
import { setSessionId, setBearerToken, clearAuth } from '../api/client';
import type { UserInfo, LoginResponse } from '../types/api';

interface AuthState {
  user: UserInfo | null;
  sessionId: string | null;
  patToken: string | null;
  isLoading: boolean;
  isRestoring: boolean;

  restore: () => Promise<void>;
  login: (account: string, password: string, loginType: 'password' | 'sms_code' | 'email_code', code?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserInfo) => void;
}

const SESSION_KEY = 'coze_session_id';
const PAT_KEY = 'coze_pat_token';
const USER_KEY = 'coze_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  sessionId: null,
  patToken: null,
  isLoading: false,
  isRestoring: true,

  restore: async () => {
    try {
      const [sessionId, patToken, userStr] = await Promise.all([
        SecureStore.getItemAsync(SESSION_KEY),
        SecureStore.getItemAsync(PAT_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (sessionId) {
        setSessionId(sessionId);
        set({ sessionId });
      }
      if (patToken) {
        setBearerToken(patToken);
        set({ patToken });
      }
      if (userStr) {
        set({ user: JSON.parse(userStr) });
      }
    } catch (e) {
      console.warn('Auth restore failed:', e);
    } finally {
      set({ isRestoring: false });
    }
  },

  login: async (account, password, loginType, code) => {
    set({ isLoading: true });
    try {
      const result = await authApi.login({ account, password, login_type: loginType, code });
      const { session_id, pat_token, user } = result;

      if (session_id) {
        await SecureStore.setItemAsync(SESSION_KEY, session_id);
        setSessionId(session_id);
      }
      if (pat_token) {
        await SecureStore.setItemAsync(PAT_KEY, pat_token);
        setBearerToken(pat_token);
      }
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      set({ user, sessionId: session_id || null, patToken: pat_token || null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {}
    await Promise.all([
      SecureStore.deleteItemAsync(SESSION_KEY),
      SecureStore.deleteItemAsync(PAT_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    clearAuth();
    set({ user: null, sessionId: null, patToken: null });
  },

  setUser: (user) => set({ user }),
}));
