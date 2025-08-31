// Unit tests for Auth Store
import { renderHook, act } from '@testing-library/react';
import { useAuthStore, useAuth, useAuthActions } from '../auth.store';
import { User } from '@/domain/entities';

// Mock the API client
jest.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.getState().logout();
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      fullName: 'Test User',
      preferredLanguage: 'english',
      wantsTravelTips: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockToken = 'mock-jwt-token';

    it('should login successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: mockUser, token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      const authState = useAuthStore.getState();
      expect(authState.user).toEqual(mockUser);
      expect(authState.token).toBe(mockToken);
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.isLoading).toBe(false);
      expect(authState.error).toBeNull();
    });

    it('should handle login failure', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected to throw
        }
      });

      const authState = useAuthStore.getState();
      expect(authState.user).toBeNull();
      expect(authState.token).toBeNull();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.isLoading).toBe(false);
      expect(authState.error).toBe('Invalid credentials');
    });

    it('should set loading state during login', async () => {
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(mockPromise as Promise<Response>);

      const { result } = renderHook(() => useAuth());

      act(() => {
        useAuthStore.getState().login('test@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!({
          ok: true,
          json: async () => ({ user: mockUser, token: mockToken }),
        });
      });
    });
  });

  describe('register', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      fullName: 'Test User',
      preferredLanguage: 'english',
      wantsTravelTips: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockToken = 'mock-jwt-token';

    const mockUserData = {
      email: 'test@example.com',
      password: 'password',
      fullName: 'Test User',
      preferredLanguage: 'english' as const,
      wantsTravelTips: true,
    };

    it('should register successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: mockUser, token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.register(mockUserData);
      });

      const authState = useAuthStore.getState();
      expect(authState.user).toEqual(mockUser);
      expect(authState.token).toBe(mockToken);
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.isLoading).toBe(false);
      expect(authState.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // First set some authenticated state
      const store = useAuthStore.getState();
      store.setUser({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        preferredLanguage: 'english',
        wantsTravelTips: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      store.setToken('some-token');

      const mockResponse = { ok: true, json: async () => ({}) };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.logout();
      });

      const authState = useAuthStore.getState();
      expect(authState.user).toBeNull();
      expect(authState.token).toBeNull();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.isLoading).toBe(false);
      expect(authState.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set error state
      useAuthStore.getState().setError?.('Some error');

      const { result } = renderHook(() => useAuthActions());

      act(() => {
        result.current.clearError();
      });

      const authState = useAuthStore.getState();
      expect(authState.error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('should return correct auth state', () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        preferredLanguage: 'english',
        wantsTravelTips: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const store = useAuthStore.getState();
      store.setUser(mockUser);
      store.setToken('mock-token');

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
