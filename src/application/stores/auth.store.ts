// Authentication store using Zustand with reactive patterns
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/domain/entities';
import { apiClient } from '@/infrastructure/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

interface RegisterUserData {
  email: string;
  password: string;
  fullName: string;
  contactNumber?: string;
  birthDate?: Date;
  countryOfResidence?: string;
  preferredLanguage: 'english' | 'spanish' | 'french';
  wantsTravelTips: boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (email: string, password: string, remember = false) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, remember }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Login failed');
            }

            const { user, token } = await response.json();
            
            // Update API client token
            apiClient.setToken(token);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
            throw error;
          }
        },

        register: async (userData: RegisterUserData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Registration failed');
            }

            const { user, token } = await response.json();
            
            // Update API client token
            apiClient.setToken(token);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Registration failed',
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            // Clear API client token
            apiClient.clearToken();
            
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        refreshToken: async () => {
          const { token } = get();
          if (!token) return;

          try {
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
              throw new Error('Token refresh failed');
            }

            const { token: newToken, user } = await response.json();
            
            // Update API client token
            apiClient.setToken(newToken);
            
            set({
              token: newToken,
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            // If refresh fails, logout the user
            get().logout();
          }
        },

        clearError: () => set({ error: null }),

        setUser: (user: User) => set({ user }),

        setToken: (token: string) => {
          apiClient.setToken(token);
          set({ token, isAuthenticated: true });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Re-initialize API client with persisted token
          if (state?.token) {
            apiClient.setToken(state.token);
          }
        },
      }
    ),
    { name: 'auth-store' }
  )
);

// Selectors for optimized re-renders
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  return { user, isAuthenticated, isLoading, error };
};

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  
  return { login, register, logout, clearError };
};
