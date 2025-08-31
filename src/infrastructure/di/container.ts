// Dependency Injection Container implementing IoC pattern
import {
  UserRepository,
  TravelPlanRepository,
  ActivityRepository,
  EventRepository,
  SightseeingRepository,
  DestinationRepository,
} from '@/domain/repositories';

import {
  ApiUserRepository,
  ApiTravelPlanRepository,
  ApiActivityRepository,
  ApiEventRepository,
  ApiSightseeingRepository,
  ApiDestinationRepository,
} from '@/infrastructure/repositories/implementations';

import {
  AuthService,
  UserService,
  TravelPlanningService,
  DestinationService,
  ActivityService,
  EventService,
  SightseeingService,
  AuthServiceImpl,
  UserServiceImpl,
  TravelPlanningServiceImpl,
  DestinationServiceImpl,
  ActivityServiceImpl,
  EventServiceImpl,
  SightseeingServiceImpl,
} from '@/application/services';

// Container interface for type safety
interface Container {
  // Repositories
  userRepository: UserRepository;
  travelPlanRepository: TravelPlanRepository;
  activityRepository: ActivityRepository;
  eventRepository: EventRepository;
  sightseeingRepository: SightseeingRepository;
  destinationRepository: DestinationRepository;

  // Services
  authService: AuthService;
  userService: UserService;
  travelPlanningService: TravelPlanningService;
  destinationService: DestinationService;
  activityService: ActivityService;
  eventService: EventService;
  sightseeingService: SightseeingService;
}

class DIContainer implements Container {
  private static instance: DIContainer;
  
  // Repositories (Lazy initialization)
  private _userRepository?: UserRepository;
  private _travelPlanRepository?: TravelPlanRepository;
  private _activityRepository?: ActivityRepository;
  private _eventRepository?: EventRepository;
  private _sightseeingRepository?: SightseeingRepository;
  private _destinationRepository?: DestinationRepository;

  // Services (Lazy initialization)
  private _authService?: AuthService;
  private _userService?: UserService;
  private _travelPlanningService?: TravelPlanningService;
  private _destinationService?: DestinationService;
  private _activityService?: ActivityService;
  private _eventService?: EventService;
  private _sightseeingService?: SightseeingService;

  private constructor() {}

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repository getters with lazy initialization
  get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new ApiUserRepository();
    }
    return this._userRepository;
  }

  get travelPlanRepository(): TravelPlanRepository {
    if (!this._travelPlanRepository) {
      this._travelPlanRepository = new ApiTravelPlanRepository();
    }
    return this._travelPlanRepository;
  }

  get activityRepository(): ActivityRepository {
    if (!this._activityRepository) {
      this._activityRepository = new ApiActivityRepository();
    }
    return this._activityRepository;
  }

  get eventRepository(): EventRepository {
    if (!this._eventRepository) {
      this._eventRepository = new ApiEventRepository();
    }
    return this._eventRepository;
  }

  get sightseeingRepository(): SightseeingRepository {
    if (!this._sightseeingRepository) {
      this._sightseeingRepository = new ApiSightseeingRepository();
    }
    return this._sightseeingRepository;
  }

  get destinationRepository(): DestinationRepository {
    if (!this._destinationRepository) {
      this._destinationRepository = new ApiDestinationRepository();
    }
    return this._destinationRepository;
  }

  // Service getters with lazy initialization and dependency injection
  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthServiceImpl(this.userRepository);
    }
    return this._authService;
  }

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserServiceImpl(this.userRepository);
    }
    return this._userService;
  }

  get travelPlanningService(): TravelPlanningService {
    if (!this._travelPlanningService) {
      this._travelPlanningService = new TravelPlanningServiceImpl(
        this.travelPlanRepository,
        this.destinationRepository
      );
    }
    return this._travelPlanningService;
  }

  get destinationService(): DestinationService {
    if (!this._destinationService) {
      this._destinationService = new DestinationServiceImpl(this.destinationRepository);
    }
    return this._destinationService;
  }

  get activityService(): ActivityService {
    if (!this._activityService) {
      this._activityService = new ActivityServiceImpl(this.activityRepository);
    }
    return this._activityService;
  }

  get eventService(): EventService {
    if (!this._eventService) {
      this._eventService = new EventServiceImpl(this.eventRepository);
    }
    return this._eventService;
  }

  get sightseeingService(): SightseeingService {
    if (!this._sightseeingService) {
      this._sightseeingService = new SightseeingServiceImpl(this.sightseeingRepository);
    }
    return this._sightseeingService;
  }

  // Method to reset container (useful for testing)
  public reset(): void {
    this._userRepository = undefined;
    this._travelPlanRepository = undefined;
    this._activityRepository = undefined;
    this._eventRepository = undefined;
    this._sightseeingRepository = undefined;
    this._destinationRepository = undefined;
    this._authService = undefined;
    this._userService = undefined;
    this._travelPlanningService = undefined;
    this._destinationService = undefined;
    this._activityService = undefined;
    this._eventService = undefined;
    this._sightseeingService = undefined;
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Hook for React components to access services
export function useServices() {
  return {
    authService: container.authService,
    userService: container.userService,
    travelPlanningService: container.travelPlanningService,
    destinationService: container.destinationService,
    activityService: container.activityService,
    eventService: container.eventService,
    sightseeingService: container.sightseeingService,
  };
}
