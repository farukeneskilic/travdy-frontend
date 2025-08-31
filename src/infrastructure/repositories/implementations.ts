// Repository implementations using the API client
import {
  UserRepository,
  TravelPlanRepository,
  ActivityRepository,
  EventRepository,
  SightseeingRepository,
  DestinationRepository,
} from '@/domain/repositories';
import {
  User,
  TravelPlan,
  Activity,
  Event,
  Sightseeing,
  Destination,
  SearchCriteria,
  SearchResult,
} from '@/domain/entities';
import { apiClient, ApiEndpoints } from '../api/client';

// User Repository Implementation
export class ApiUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<User>> {
    return apiClient.get<SearchResult<User>>(ApiEndpoints.USER_PROFILE, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return apiClient.post<User>(ApiEndpoints.REGISTER, userData);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await apiClient.get<User>(`/users/by-email/${email}`);
    } catch {
      return null;
    }
  }

  async findByContactNumber(contactNumber: string): Promise<User | null> {
    try {
      return await apiClient.get<User>(`/users/by-contact/${contactNumber}`);
    } catch {
      return null;
    }
  }
}

// Travel Plan Repository Implementation
export class ApiTravelPlanRepository implements TravelPlanRepository {
  async findById(id: string): Promise<TravelPlan | null> {
    try {
      return await apiClient.get<TravelPlan>(ApiEndpoints.TRAVEL_PLAN_BY_ID(id));
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<TravelPlan>> {
    return apiClient.get<SearchResult<TravelPlan>>(ApiEndpoints.TRAVEL_PLANS, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(travelPlanData: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TravelPlan> {
    return apiClient.post<TravelPlan>(ApiEndpoints.TRAVEL_PLANS, travelPlanData);
  }

  async update(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    return apiClient.patch<TravelPlan>(ApiEndpoints.TRAVEL_PLAN_BY_ID(id), updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.TRAVEL_PLAN_BY_ID(id));
  }

  async findByUserId(userId: string): Promise<TravelPlan[]> {
    const result = await apiClient.get<SearchResult<TravelPlan>>('/travel-plans/by-user', {
      userId,
    });
    return result.items;
  }

  async findByDestination(destinationId: string): Promise<TravelPlan[]> {
    const result = await apiClient.get<SearchResult<TravelPlan>>('/travel-plans/by-destination', {
      destinationId,
    });
    return result.items;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<TravelPlan[]> {
    const result = await apiClient.get<SearchResult<TravelPlan>>('/travel-plans/by-date-range', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return result.items;
  }
}

// Activity Repository Implementation
export class ApiActivityRepository implements ActivityRepository {
  async findById(id: string): Promise<Activity | null> {
    try {
      return await apiClient.get<Activity>(`${ApiEndpoints.ACTIVITIES}/${id}`);
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<Activity>> {
    return apiClient.get<SearchResult<Activity>>(ApiEndpoints.ACTIVITIES, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    return apiClient.post<Activity>(ApiEndpoints.ACTIVITIES, activityData);
  }

  async update(id: string, updates: Partial<Activity>): Promise<Activity> {
    return apiClient.patch<Activity>(`${ApiEndpoints.ACTIVITIES}/${id}`, updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${ApiEndpoints.ACTIVITIES}/${id}`);
  }

  async findByDestination(destinationId: string): Promise<Activity[]> {
    const result = await apiClient.get<SearchResult<Activity>>(
      ApiEndpoints.ACTIVITIES_BY_DESTINATION(destinationId)
    );
    return result.items;
  }

  async findByCategory(category: string): Promise<Activity[]> {
    const result = await apiClient.get<SearchResult<Activity>>(ApiEndpoints.ACTIVITIES, {
      category,
    });
    return result.items;
  }

  async search(criteria: SearchCriteria): Promise<SearchResult<Activity>> {
    return apiClient.post<SearchResult<Activity>>('/activities/search', criteria);
  }

  async findPopularActivities(destinationId: string, limit = 10): Promise<Activity[]> {
    const result = await apiClient.get<SearchResult<Activity>>(
      ApiEndpoints.POPULAR_ACTIVITIES(destinationId),
      { limit: limit.toString() }
    );
    return result.items;
  }
}

// Event Repository Implementation
export class ApiEventRepository implements EventRepository {
  async findById(id: string): Promise<Event | null> {
    try {
      return await apiClient.get<Event>(`${ApiEndpoints.EVENTS}/${id}`);
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<Event>> {
    return apiClient.get<SearchResult<Event>>(ApiEndpoints.EVENTS, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return apiClient.post<Event>(ApiEndpoints.EVENTS, eventData);
  }

  async update(id: string, updates: Partial<Event>): Promise<Event> {
    return apiClient.patch<Event>(`${ApiEndpoints.EVENTS}/${id}`, updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${ApiEndpoints.EVENTS}/${id}`);
  }

  async findByDestination(destinationId: string): Promise<Event[]> {
    const result = await apiClient.get<SearchResult<Event>>(
      ApiEndpoints.EVENTS_BY_DESTINATION(destinationId)
    );
    return result.items;
  }

  async findByDateRange(startDate: Date, endDate: Date, destinationId?: string): Promise<Event[]> {
    const params: Record<string, string> = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    if (destinationId) {
      params.destinationId = destinationId;
    }

    const result = await apiClient.get<SearchResult<Event>>('/events/by-date-range', params);
    return result.items;
  }

  async findUpcomingEvents(destinationId: string, limit = 10): Promise<Event[]> {
    const result = await apiClient.get<SearchResult<Event>>(
      ApiEndpoints.UPCOMING_EVENTS(destinationId),
      { limit: limit.toString() }
    );
    return result.items;
  }
}

// Sightseeing Repository Implementation
export class ApiSightseeingRepository implements SightseeingRepository {
  async findById(id: string): Promise<Sightseeing | null> {
    try {
      return await apiClient.get<Sightseeing>(`${ApiEndpoints.SIGHTSEEING}/${id}`);
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<Sightseeing>> {
    return apiClient.get<SearchResult<Sightseeing>>(ApiEndpoints.SIGHTSEEING, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(sightseeingData: Omit<Sightseeing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sightseeing> {
    return apiClient.post<Sightseeing>(ApiEndpoints.SIGHTSEEING, sightseeingData);
  }

  async update(id: string, updates: Partial<Sightseeing>): Promise<Sightseeing> {
    return apiClient.patch<Sightseeing>(`${ApiEndpoints.SIGHTSEEING}/${id}`, updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${ApiEndpoints.SIGHTSEEING}/${id}`);
  }

  async findByDestination(destinationId: string): Promise<Sightseeing[]> {
    const result = await apiClient.get<SearchResult<Sightseeing>>(
      ApiEndpoints.SIGHTSEEING_BY_DESTINATION(destinationId)
    );
    return result.items;
  }

  async findByCategory(category: string): Promise<Sightseeing[]> {
    const result = await apiClient.get<SearchResult<Sightseeing>>(ApiEndpoints.SIGHTSEEING, {
      category,
    });
    return result.items;
  }

  async findTopRated(destinationId: string, limit = 10): Promise<Sightseeing[]> {
    const result = await apiClient.get<SearchResult<Sightseeing>>(
      ApiEndpoints.TOP_SIGHTSEEING(destinationId),
      { limit: limit.toString() }
    );
    return result.items;
  }
}

// Destination Repository Implementation
export class ApiDestinationRepository implements DestinationRepository {
  async findById(id: string): Promise<Destination | null> {
    try {
      return await apiClient.get<Destination>(ApiEndpoints.DESTINATION_BY_ID(id));
    } catch {
      return null;
    }
  }

  async findAll(limit = 10, offset = 0): Promise<SearchResult<Destination>> {
    return apiClient.get<SearchResult<Destination>>(ApiEndpoints.DESTINATIONS, {
      limit: limit.toString(),
      offset: offset.toString(),
    });
  }

  async create(destinationData: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> {
    return apiClient.post<Destination>(ApiEndpoints.DESTINATIONS, destinationData);
  }

  async update(id: string, updates: Partial<Destination>): Promise<Destination> {
    return apiClient.patch<Destination>(ApiEndpoints.DESTINATION_BY_ID(id), updates);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.DESTINATION_BY_ID(id));
  }

  async findByCountry(countryCode: string): Promise<Destination[]> {
    const result = await apiClient.get<SearchResult<Destination>>(ApiEndpoints.DESTINATIONS, {
      countryCode,
    });
    return result.items;
  }

  async findByName(name: string): Promise<Destination[]> {
    const result = await apiClient.get<SearchResult<Destination>>(ApiEndpoints.DESTINATIONS, {
      name,
    });
    return result.items;
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const result = await apiClient.get<SearchResult<Destination>>(ApiEndpoints.SEARCH_DESTINATIONS, {
      q: query,
    });
    return result.items;
  }
}
