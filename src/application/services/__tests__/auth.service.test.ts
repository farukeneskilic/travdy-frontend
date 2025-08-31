// Unit tests for AuthService
import { AuthServiceImpl } from '../index';
import { UserRepository } from '@/domain/repositories';
import { User } from '@/domain/entities';

// Mock the UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByEmail: jest.fn(),
  findByContactNumber: jest.fn(),
};

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('AuthService', () => {
  let authService: AuthServiceImpl;

  beforeEach(() => {
    authService = new AuthServiceImpl(mockUserRepository);
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

    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: mockUser, token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await authService.login('test@example.com', 'password');

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
          remember: false,
        }),
      });

      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    it('should throw error with invalid credentials', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should include remember flag when provided', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: mockUser, token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await authService.login('test@example.com', 'password', true);

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
          remember: true,
        }),
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

    it('should register successfully with valid data', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: mockUser, token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await authService.register(mockUserData);

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUserData),
      });

      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    it('should throw error when registration fails', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: 'Email already exists' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(authService.register(mockUserData)).rejects.toThrow(
        'Registration failed'
      );
    });
  });

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      const mockResponse = { ok: true, json: async () => ({}) };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockToken = 'new-mock-jwt-token';
      const mockResponse = {
        ok: true,
        json: async () => ({ token: mockToken }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await authService.refreshToken();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST',
      });

      expect(result).toBe(mockToken);
    });

    it('should throw error when refresh fails', async () => {
      const mockResponse = { ok: false, json: async () => ({}) };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(authService.refreshToken()).rejects.toThrow(
        'Token refresh failed'
      );
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      fullName: 'Test User',
      preferredLanguage: 'english',
      wantsTravelTips: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return current user when authenticated', async () => {
      const mockResponse = {
        ok: true,
        json: async () => mockUser,
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      const mockResponse = { ok: false, json: async () => ({}) };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
