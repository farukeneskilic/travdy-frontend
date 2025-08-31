// Repository interfaces following the Repository pattern
import { 
  User, 
  TravelPlan, 
  Activity, 
  Event, 
  Sightseeing, 
  Destination,
  SearchCriteria,
  SearchResult
} from '../entities';

// Base repository interface
export interface BaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(limit?: number, offset?: number): Promise<SearchResult<T>>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByContactNumber(contactNumber: string): Promise<User | null>;
}

export interface TravelPlanRepository extends BaseRepository<TravelPlan> {
  findByUserId(userId: string): Promise<TravelPlan[]>;
  findByDestination(destinationId: string): Promise<TravelPlan[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<TravelPlan[]>;
}

export interface ActivityRepository extends BaseRepository<Activity> {
  findByDestination(destinationId: string): Promise<Activity[]>;
  findByCategory(category: string): Promise<Activity[]>;
  search(criteria: SearchCriteria): Promise<SearchResult<Activity>>;
  findPopularActivities(destinationId: string, limit?: number): Promise<Activity[]>;
}

export interface EventRepository extends BaseRepository<Event> {
  findByDestination(destinationId: string): Promise<Event[]>;
  findByDateRange(startDate: Date, endDate: Date, destinationId?: string): Promise<Event[]>;
  findUpcomingEvents(destinationId: string, limit?: number): Promise<Event[]>;
}

export interface SightseeingRepository extends BaseRepository<Sightseeing> {
  findByDestination(destinationId: string): Promise<Sightseeing[]>;
  findByCategory(category: string): Promise<Sightseeing[]>;
  findTopRated(destinationId: string, limit?: number): Promise<Sightseeing[]>;
}

export interface DestinationRepository extends BaseRepository<Destination> {
  findByCountry(countryCode: string): Promise<Destination[]>;
  findByName(name: string): Promise<Destination[]>;
  searchDestinations(query: string): Promise<Destination[]>;
}
