// Domain Entities - Core business objects
export interface User {
  id: string;
  email: string;
  fullName: string;
  contactNumber?: string;
  birthDate?: Date;
  countryOfResidence?: string;
  preferredLanguage: 'english' | 'spanish' | 'french';
  wantsTravelTips: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelPlan {
  id: string;
  userId: string;
  destination: Destination;
  budget: Budget;
  dates: TravelDates;
  preferences: TravelPreferences;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Budget {
  totalAmount: number;
  currency: string;
  categories: BudgetCategories;
}

export interface BudgetCategories {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  other: number;
}

export interface TravelDates {
  startDate: Date;
  endDate: Date;
  duration: number; // in days
}

export interface TravelPreferences {
  accommodationType: 'hotel' | 'hostel' | 'airbnb' | 'resort';
  activityTypes: ActivityType[];
  dietaryRestrictions: string[];
  accessibility: boolean;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityType;
  duration: number; // in hours
  priceRange: PriceRange;
  rating: number;
  location: Location;
  images: string[];
  openingHours: OpeningHours;
  tags: string[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: Location;
  category: EventCategory;
  ticketPrice?: PriceRange;
  isRecurring: boolean;
  organizer: string;
  images: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Sightseeing {
  id: string;
  name: string;
  description: string;
  category: SightseeingCategory;
  location: Location;
  entryFee?: PriceRange;
  rating: number;
  visitDuration: number; // in hours
  bestTimeToVisit: string;
  images: string[];
  amenities: string[];
}

// Value Objects and Enums
export type ActivityType = 
  | 'cultural'
  | 'adventure'
  | 'food'
  | 'nightlife'
  | 'shopping'
  | 'nature'
  | 'sports'
  | 'relaxation';

export type EventCategory = 
  | 'festival'
  | 'concert'
  | 'exhibition'
  | 'sports'
  | 'conference'
  | 'workshop';

export type SightseeingCategory = 
  | 'monument'
  | 'museum'
  | 'park'
  | 'religious'
  | 'architectural'
  | 'natural'
  | 'historical';

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:mm format
  closeTime?: string; // HH:mm format
}

// Search and Filter Types
export interface SearchCriteria {
  destination?: string;
  dates?: TravelDates;
  budget?: Budget;
  activityTypes?: ActivityType[];
  priceRange?: PriceRange;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}
