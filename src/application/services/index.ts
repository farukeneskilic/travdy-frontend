// Service layer following SOLID principles
import {
  User,
  TravelPlan,
  Activity,
  Event,
  Sightseeing,
  Destination,
  SearchCriteria,
  Budget,
  TravelDates,
} from '@/domain/entities';
import {
  UserRepository,
  TravelPlanRepository,
  ActivityRepository,
  EventRepository,
  SightseeingRepository,
  DestinationRepository,
} from '@/domain/repositories';

// Single Responsibility Principle - Each service has one responsibility
export interface AuthService {
  login(email: string, password: string, remember?: boolean): Promise<{ user: User; token: string }>;
  register(userData: RegisterUserData): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  getCurrentUser(): Promise<User | null>;
}

export interface UserService {
  getUserProfile(id: string): Promise<User | null>;
  updateUserProfile(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface TravelPlanningService {
  createTravelPlan(planData: CreateTravelPlanData): Promise<TravelPlan>;
  getTravelPlan(id: string): Promise<TravelPlan | null>;
  updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan>;
  deleteTravelPlan(id: string): Promise<void>;
  getUserTravelPlans(userId: string): Promise<TravelPlan[]>;
  calculateBudgetRecommendations(destination: Destination, dates: TravelDates): Promise<Budget>;
}

export interface DestinationService {
  getDestination(id: string): Promise<Destination | null>;
  searchDestinations(query: string): Promise<Destination[]>;
  getPopularDestinations(limit?: number): Promise<Destination[]>;
  getDestinationsByCountry(countryCode: string): Promise<Destination[]>;
}

export interface ActivityService {
  getActivitiesByDestination(destinationId: string): Promise<Activity[]>;
  getPopularActivities(destinationId: string, limit?: number): Promise<Activity[]>;
  searchActivities(criteria: SearchCriteria): Promise<Activity[]>;
  getActivityRecommendations(travelPlan: TravelPlan): Promise<Activity[]>;
}

export interface EventService {
  getEventsByDestination(destinationId: string): Promise<Event[]>;
  getUpcomingEvents(destinationId: string, limit?: number): Promise<Event[]>;
  getEventsByDateRange(startDate: Date, endDate: Date, destinationId?: string): Promise<Event[]>;
  getEventRecommendations(travelPlan: TravelPlan): Promise<Event[]>;
}

export interface SightseeingService {
  getSightseeingByDestination(destinationId: string): Promise<Sightseeing[]>;
  getTopRatedSightseeing(destinationId: string, limit?: number): Promise<Sightseeing[]>;
  getSightseeingByCategory(category: string): Promise<Sightseeing[]>;
  getSightseeingRecommendations(travelPlan: TravelPlan): Promise<Sightseeing[]>;
}

// Data Transfer Objects
export interface RegisterUserData {
  email: string;
  password: string;
  fullName: string;
  contactNumber?: string;
  birthDate?: Date;
  countryOfResidence?: string;
  preferredLanguage: 'english' | 'spanish' | 'french';
  wantsTravelTips: boolean;
}

export interface CreateTravelPlanData {
  userId: string;
  destinationId: string;
  budget: Budget;
  dates: TravelDates;
  preferences: {
    accommodationType: 'hotel' | 'hostel' | 'airbnb' | 'resort';
    activityTypes: string[];
    dietaryRestrictions: string[];
    accessibility: boolean;
  };
}

// Service implementations
export class AuthServiceImpl implements AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(email: string, password: string, remember = false): Promise<{ user: User; token: string }> {
    // This would typically validate credentials with the backend
    // For now, we'll simulate the API call structure
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { user, token } = await response.json();
    return { user, token };
  }

  async register(userData: RegisterUserData): Promise<{ user: User; token: string }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const { user, token } = await response.json();
    return { user, token };
  }

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  }

  async refreshToken(): Promise<string> {
    const response = await fetch('/api/auth/refresh', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    const { token } = await response.json();
    return token;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }
}

export class UserServiceImpl implements UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}

export class TravelPlanningServiceImpl implements TravelPlanningService {
  constructor(
    private travelPlanRepository: TravelPlanRepository,
    private destinationRepository: DestinationRepository
  ) {}

  async createTravelPlan(planData: CreateTravelPlanData): Promise<TravelPlan> {
    const destination = await this.destinationRepository.findById(planData.destinationId);
    if (!destination) {
      throw new Error('Destination not found');
    }

    const travelPlan: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: planData.userId,
      destination,
      budget: planData.budget,
      dates: planData.dates,
      preferences: planData.preferences,
      status: 'draft',
    };

    return this.travelPlanRepository.create(travelPlan);
  }

  async getTravelPlan(id: string): Promise<TravelPlan | null> {
    return this.travelPlanRepository.findById(id);
  }

  async updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    return this.travelPlanRepository.update(id, updates);
  }

  async deleteTravelPlan(id: string): Promise<void> {
    await this.travelPlanRepository.delete(id);
  }

  async getUserTravelPlans(userId: string): Promise<TravelPlan[]> {
    return this.travelPlanRepository.findByUserId(userId);
  }

  async calculateBudgetRecommendations(destination: Destination, dates: TravelDates): Promise<Budget> {
    // This would typically call a backend service that calculates budget recommendations
    // based on destination, duration, and historical data
    const duration = dates.duration;
    const baseDaily = this.getBaseDailyBudget(destination.country);

    return {
      totalAmount: baseDaily * duration,
      currency: 'USD',
      categories: {
        accommodation: Math.round(baseDaily * 0.4 * duration),
        food: Math.round(baseDaily * 0.3 * duration),
        activities: Math.round(baseDaily * 0.2 * duration),
        transport: Math.round(baseDaily * 0.07 * duration),
        other: Math.round(baseDaily * 0.03 * duration),
      },
    };
  }

  private getBaseDailyBudget(country: string): number {
    // Simplified budget calculation - in real app, this would come from backend
    const budgetMap: Record<string, number> = {
      'France': 150,
      'Spain': 120,
      'Italy': 130,
      'Germany': 140,
      'Japan': 160,
      'USA': 180,
      'UK': 170,
    };
    return budgetMap[country] || 100;
  }
}

export class DestinationServiceImpl implements DestinationService {
  constructor(private destinationRepository: DestinationRepository) {}

  async getDestination(id: string): Promise<Destination | null> {
    return this.destinationRepository.findById(id);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    return this.destinationRepository.searchDestinations(query);
  }

  async getPopularDestinations(limit = 10): Promise<Destination[]> {
    const result = await this.destinationRepository.findAll(limit);
    return result.items;
  }

  async getDestinationsByCountry(countryCode: string): Promise<Destination[]> {
    return this.destinationRepository.findByCountry(countryCode);
  }
}

export class ActivityServiceImpl implements ActivityService {
  constructor(private activityRepository: ActivityRepository) {}

  async getActivitiesByDestination(destinationId: string): Promise<Activity[]> {
    return this.activityRepository.findByDestination(destinationId);
  }

  async getPopularActivities(destinationId: string, limit = 10): Promise<Activity[]> {
    return this.activityRepository.findPopularActivities(destinationId, limit);
  }

  async searchActivities(criteria: SearchCriteria): Promise<Activity[]> {
    const result = await this.activityRepository.search(criteria);
    return result.items;
  }

  async getActivityRecommendations(travelPlan: TravelPlan): Promise<Activity[]> {
    // Get activities based on user preferences and destination
    const activities = await this.activityRepository.findByDestination(travelPlan.destination.id);
    
    // Filter based on preferences
    return activities.filter(activity => 
      travelPlan.preferences.activityTypes.includes(activity.category)
    );
  }
}

export class EventServiceImpl implements EventService {
  constructor(private eventRepository: EventRepository) {}

  async getEventsByDestination(destinationId: string): Promise<Event[]> {
    return this.eventRepository.findByDestination(destinationId);
  }

  async getUpcomingEvents(destinationId: string, limit = 10): Promise<Event[]> {
    return this.eventRepository.findUpcomingEvents(destinationId, limit);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date, destinationId?: string): Promise<Event[]> {
    return this.eventRepository.findByDateRange(startDate, endDate, destinationId);
  }

  async getEventRecommendations(travelPlan: TravelPlan): Promise<Event[]> {
    return this.eventRepository.findByDateRange(
      travelPlan.dates.startDate,
      travelPlan.dates.endDate,
      travelPlan.destination.id
    );
  }
}

export class SightseeingServiceImpl implements SightseeingService {
  constructor(private sightseeingRepository: SightseeingRepository) {}

  async getSightseeingByDestination(destinationId: string): Promise<Sightseeing[]> {
    return this.sightseeingRepository.findByDestination(destinationId);
  }

  async getTopRatedSightseeing(destinationId: string, limit = 10): Promise<Sightseeing[]> {
    return this.sightseeingRepository.findTopRated(destinationId, limit);
  }

  async getSightseeingByCategory(category: string): Promise<Sightseeing[]> {
    return this.sightseeingRepository.findByCategory(category);
  }

  async getSightseeingRecommendations(travelPlan: TravelPlan): Promise<Sightseeing[]> {
    return this.sightseeingRepository.findTopRated(travelPlan.destination.id);
  }
}
