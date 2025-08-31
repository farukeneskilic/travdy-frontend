// API Client with proper error handling and authentication

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export class ApiError extends Error {
  public code: string;
  public details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('travdy_token');
    }
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('travdy_token', token);
    }
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('travdy_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      }));
      
      throw new ApiError(
        errorData.message || 'Request failed',
        errorData.code || response.status.toString(),
        errorData.details
      );
    }

    const data = await response.json();
    return data.data || data; // Handle both wrapped and unwrapped responses
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T, U = unknown>(endpoint: string, data?: U): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T, U = unknown>(endpoint: string, data: U): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T, U = unknown>(endpoint: string, data: U): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Singleton instance
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
export const apiClient = new ApiClient(API_BASE);

// Type-safe API endpoints
export const ApiEndpoints = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // User management
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Travel plans
  TRAVEL_PLANS: '/travel-plans',
  TRAVEL_PLAN_BY_ID: (id: string) => `/travel-plans/${id}`,
  
  // Destinations
  DESTINATIONS: '/destinations',
  DESTINATION_BY_ID: (id: string) => `/destinations/${id}`,
  SEARCH_DESTINATIONS: '/destinations/search',
  
  // Activities
  ACTIVITIES: '/activities',
  ACTIVITIES_BY_DESTINATION: (destinationId: string) => `/destinations/${destinationId}/activities`,
  POPULAR_ACTIVITIES: (destinationId: string) => `/destinations/${destinationId}/activities/popular`,
  
  // Events
  EVENTS: '/events',
  EVENTS_BY_DESTINATION: (destinationId: string) => `/destinations/${destinationId}/events`,
  UPCOMING_EVENTS: (destinationId: string) => `/destinations/${destinationId}/events/upcoming`,
  
  // Sightseeing
  SIGHTSEEING: '/sightseeing',
  SIGHTSEEING_BY_DESTINATION: (destinationId: string) => `/destinations/${destinationId}/sightseeing`,
  TOP_SIGHTSEEING: (destinationId: string) => `/destinations/${destinationId}/sightseeing/top-rated`,
} as const;
