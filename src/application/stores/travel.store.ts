// Travel planning store using Zustand with reactive patterns
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  TravelPlan, 
  Destination, 
  Budget, 
  TravelDates, 
  Activity, 
  Event, 
  Sightseeing
} from '@/domain/entities';

interface TravelState {
  // Current travel plan being created/edited
  currentPlan: Partial<TravelPlan> | null;
  
  // Search and selection state
  searchQuery: string;
  selectedDestination: Destination | null;
  selectedDates: TravelDates | null;
  selectedBudget: Budget | null;
  
  // Recommendations
  recommendedActivities: Activity[];
  recommendedEvents: Event[];
  recommendedSightseeing: Sightseeing[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  currentStep: number; // For multi-step flow
}

interface TravelActions {
  // Plan management
  createPlan: (planData: Partial<TravelPlan>) => void;
  updatePlan: (updates: Partial<TravelPlan>) => void;
  clearPlan: () => void;
  
  // Search and selection
  setSearchQuery: (query: string) => void;
  setDestination: (destination: Destination) => void;
  setDates: (dates: TravelDates) => void;
  setBudget: (budget: Budget) => void;
  
  // Recommendations
  setRecommendedActivities: (activities: Activity[]) => void;
  setRecommendedEvents: (events: Event[]) => void;
  setRecommendedSightseeing: (sightseeing: Sightseeing[]) => void;
  
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  clearError: () => void;
}

type TravelStore = TravelState & TravelActions;

export const useTravelStore = create<TravelStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentPlan: null,
        searchQuery: '',
        selectedDestination: null,
        selectedDates: null,
        selectedBudget: null,
        recommendedActivities: [],
        recommendedEvents: [],
        recommendedSightseeing: [],
        isLoading: false,
        error: null,
        currentStep: 1,

        // Actions
        createPlan: (planData: Partial<TravelPlan>) => {
          set({ currentPlan: planData });
        },

        updatePlan: (updates: Partial<TravelPlan>) => {
          const { currentPlan } = get();
          set({
            currentPlan: {
              ...currentPlan,
              ...updates,
            },
          });
        },

        clearPlan: () => {
          set({
            currentPlan: null,
            selectedDestination: null,
            selectedDates: null,
            selectedBudget: null,
            recommendedActivities: [],
            recommendedEvents: [],
            recommendedSightseeing: [],
            currentStep: 1,
          });
        },

        setSearchQuery: (query: string) => set({ searchQuery: query }),

        setDestination: (destination: Destination) => {
          set({ selectedDestination: destination });
          
          // Update current plan
          const { currentPlan } = get();
          set({
            currentPlan: {
              ...currentPlan,
              destination,
            },
          });
        },

        setDates: (dates: TravelDates) => {
          set({ selectedDates: dates });
          
          // Update current plan
          const { currentPlan } = get();
          set({
            currentPlan: {
              ...currentPlan,
              dates,
            },
          });
        },

        setBudget: (budget: Budget) => {
          set({ selectedBudget: budget });
          
          // Update current plan
          const { currentPlan } = get();
          set({
            currentPlan: {
              ...currentPlan,
              budget,
            },
          });
        },

        setRecommendedActivities: (activities: Activity[]) => 
          set({ recommendedActivities: activities }),

        setRecommendedEvents: (events: Event[]) => 
          set({ recommendedEvents: events }),

        setRecommendedSightseeing: (sightseeing: Sightseeing[]) => 
          set({ recommendedSightseeing: sightseeing }),

        setLoading: (isLoading: boolean) => set({ isLoading }),

        setError: (error: string | null) => set({ error }),

        setCurrentStep: (step: number) => set({ currentStep: step }),

        nextStep: () => {
          const { currentStep } = get();
          set({ currentStep: Math.min(currentStep + 1, 6) }); // Max 6 steps
        },

        previousStep: () => {
          const { currentStep } = get();
          set({ currentStep: Math.max(currentStep - 1, 1) }); // Min 1 step
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'travel-storage',
        partialize: (state) => ({
          currentPlan: state.currentPlan,
          selectedDestination: state.selectedDestination,
          selectedDates: state.selectedDates,
          selectedBudget: state.selectedBudget,
          currentStep: state.currentStep,
        }),
      }
    ),
    { name: 'travel-store' }
  )
);

// Selectors for optimized re-renders
export const useTravelPlan = () => {
  const currentPlan = useTravelStore((state) => state.currentPlan);
  const selectedDestination = useTravelStore((state) => state.selectedDestination);
  const selectedDates = useTravelStore((state) => state.selectedDates);
  const selectedBudget = useTravelStore((state) => state.selectedBudget);
  
  return { currentPlan, selectedDestination, selectedDates, selectedBudget };
};

export const useTravelRecommendations = () => {
  const activities = useTravelStore((state) => state.recommendedActivities);
  const events = useTravelStore((state) => state.recommendedEvents);
  const sightseeing = useTravelStore((state) => state.recommendedSightseeing);
  
  return { activities, events, sightseeing };
};

export const useTravelUI = () => {
  const isLoading = useTravelStore((state) => state.isLoading);
  const error = useTravelStore((state) => state.error);
  const currentStep = useTravelStore((state) => state.currentStep);
  
  return { isLoading, error, currentStep };
};

export const useTravelActions = () => {
  const createPlan = useTravelStore((state) => state.createPlan);
  const updatePlan = useTravelStore((state) => state.updatePlan);
  const clearPlan = useTravelStore((state) => state.clearPlan);
  const setDestination = useTravelStore((state) => state.setDestination);
  const setDates = useTravelStore((state) => state.setDates);
  const setBudget = useTravelStore((state) => state.setBudget);
  const setLoading = useTravelStore((state) => state.setLoading);
  const setError = useTravelStore((state) => state.setError);
  const nextStep = useTravelStore((state) => state.nextStep);
  const previousStep = useTravelStore((state) => state.previousStep);
  const clearError = useTravelStore((state) => state.clearError);
  
  return {
    createPlan,
    updatePlan,
    clearPlan,
    setDestination,
    setDates,
    setBudget,
    setLoading,
    setError,
    nextStep,
    previousStep,
    clearError,
  };
};
