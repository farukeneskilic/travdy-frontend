'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTravelStore, useTravelActions, useTravelUI } from '@/application/stores/travel.store';
import { useAuth } from '@/application/stores/auth.store';
import { useServices } from '@/infrastructure/di/container';
import { Destination, Budget, TravelDates } from '@/domain/entities';

// Travel planning form schema
const travelPlanSchema = z.object({
  destination: z.string().min(1, 'Please select a destination'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  totalBudget: z.number().min(1, 'Budget must be greater than 0'),
  currency: z.string().default('USD'),
  accommodationType: z.enum(['hotel', 'hostel', 'airbnb', 'resort']),
  activityTypes: z.array(z.string()).min(1, 'Select at least one activity type'),
  dietaryRestrictions: z.array(z.string()).optional(),
  accessibility: z.boolean().default(false),
});

type TravelPlanFormData = z.infer<typeof travelPlanSchema>;

// Step components
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { number: 1, label: 'Destination & Dates', icon: '📍' },
    { number: 2, label: 'Budget Planning', icon: '💰' },
    { number: 3, label: 'Preferences', icon: '⚙️' },
    { number: 4, label: 'Review & Confirm', icon: '✅' },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className={`step ${step.number <= currentStep ? 'active' : ''}`}>
          <div className="step-circle">
            <span>{step.icon}</span>
          </div>
          <span className="step-label">{step.label}</span>
          {index < steps.length - 1 && <div className="step-connector" />}
        </div>
      ))}
    </div>
  );
}

function DestinationStep({ 
  register, 
  watch, 
  setValue, 
  errors 
}: { 
  register: any; 
  watch: any; 
  setValue: any; 
  errors: any; 
}) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { destinationService } = useServices();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const popular = await destinationService.getPopularDestinations(10);
        setDestinations(popular);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      }
    };
    loadDestinations();
  }, [destinationService]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await destinationService.searchDestinations(query);
        setDestinations(results);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  return (
    <div className="step-content">
      <h2>Where would you like to go?</h2>
      
      <div className="form-group">
        <label htmlFor="destination-search">Search destinations</label>
        <input
          id="destination-search"
          type="text"
          placeholder="Search for cities, countries..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="destinations-grid">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className={`destination-card ${watch('destination') === destination.id ? 'selected' : ''}`}
            onClick={() => setValue('destination', destination.id)}
          >
            <h3>{destination.name}</h3>
            <p>{destination.country}</p>
          </div>
        ))}
      </div>
      {errors.destination && <span className="error">{errors.destination.message}</span>}

      <div className="dates-section">
        <h3>When are you traveling?</h3>
        <div className="date-inputs">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && <span className="error">{errors.startDate.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className="form-input"
              min={watch('startDate')}
            />
            {errors.endDate && <span className="error">{errors.endDate.message}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetStep({ register, watch, setValue, errors }: { register: any; watch: any; setValue: any; errors: any }) {
  const [budgetRecommendation, setBudgetRecommendation] = useState<Budget | null>(null);
  const { travelPlanningService } = useServices();

  const selectedDestination = watch('destination');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    const calculateRecommendation = async () => {
      if (selectedDestination && startDate && endDate) {
        try {
          // This would normally fetch the destination object
          const mockDestination: Destination = {
            id: selectedDestination,
            name: 'Selected City',
            city: 'Selected City',
            country: 'Selected Country',
            countryCode: 'XX',
            coordinates: { latitude: 0, longitude: 0 },
          };

          const dates: TravelDates = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            duration: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
          };

          const recommendation = await travelPlanningService.calculateBudgetRecommendations(mockDestination, dates);
          setBudgetRecommendation(recommendation);
          setValue('totalBudget', recommendation.totalAmount);
        } catch (error) {
          console.error('Failed to calculate budget recommendation:', error);
        }
      }
    };

    calculateRecommendation();
  }, [selectedDestination, startDate, endDate, travelPlanningService, setValue]);

  return (
    <div className="step-content">
      <h2>Plan your budget</h2>
      
      {budgetRecommendation && (
        <div className="budget-recommendation">
          <h3>Recommended Budget</h3>
          <div className="budget-breakdown">
            <div className="budget-total">
              <span className="amount">${budgetRecommendation.totalAmount}</span>
              <span className="duration">for {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
            </div>
            <div className="budget-categories">
              <div className="category">
                <span>Accommodation</span>
                <span>${budgetRecommendation.categories.accommodation}</span>
              </div>
              <div className="category">
                <span>Food</span>
                <span>${budgetRecommendation.categories.food}</span>
              </div>
              <div className="category">
                <span>Activities</span>
                <span>${budgetRecommendation.categories.activities}</span>
              </div>
              <div className="category">
                <span>Transport</span>
                <span>${budgetRecommendation.categories.transport}</span>
              </div>
              <div className="category">
                <span>Other</span>
                <span>${budgetRecommendation.categories.other}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="totalBudget">Your Budget (USD)</label>
        <input
          id="totalBudget"
          type="number"
          {...register('totalBudget', { valueAsNumber: true })}
          className="form-input"
          placeholder="Enter your total budget"
        />
        {errors.totalBudget && <span className="error">{errors.totalBudget.message}</span>}
      </div>
    </div>
  );
}

function PreferencesStep({ register, watch, setValue, errors }: { register: any; watch: any; setValue: any; errors: any }) {
  const activityOptions = [
    { value: 'cultural', label: 'Cultural Sites', icon: '🏛️' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'nightlife', label: 'Nightlife', icon: '🌙' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'nature', label: 'Nature', icon: '🌿' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
  ];

  const selectedActivities = watch('activityTypes') || [];

  const toggleActivity = (activity: string) => {
    const updated = selectedActivities.includes(activity)
      ? selectedActivities.filter((a: string) => a !== activity)
      : [...selectedActivities, activity];
    setValue('activityTypes', updated);
  };

  return (
    <div className="step-content">
      <h2>Customize your experience</h2>
      
      <div className="form-group">
        <label>Accommodation Type</label>
        <div className="radio-group">
          {[
            { value: 'hotel', label: 'Hotel' },
            { value: 'hostel', label: 'Hostel' },
            { value: 'airbnb', label: 'Airbnb' },
            { value: 'resort', label: 'Resort' },
          ].map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                value={option.value}
                {...register('accommodationType')}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Activity Preferences</label>
        <div className="activity-grid">
          {activityOptions.map((option) => (
            <div
              key={option.value}
              className={`activity-option ${selectedActivities.includes(option.value) ? 'selected' : ''}`}
              onClick={() => toggleActivity(option.value)}
            >
              <span className="icon">{option.icon}</span>
              <span className="label">{option.label}</span>
            </div>
          ))}
        </div>
        {errors.activityTypes && <span className="error">{errors.activityTypes.message}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-option">
          <input
            type="checkbox"
            {...register('accessibility')}
          />
          <span>I need accessibility accommodations</span>
        </label>
      </div>
    </div>
  );
}

export default function TravelPlanningPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { currentStep } = useTravelUI();
  const { setCurrentStep, nextStep, previousStep, createPlan } = useTravelActions();
  const { travelPlanningService } = useServices();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TravelPlanFormData>({
    resolver: zodResolver(travelPlanSchema),
    defaultValues: {
      currency: 'USD',
      accommodationType: 'hotel',
      activityTypes: [],
      dietaryRestrictions: [],
      accessibility: false,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: TravelPlanFormData) => {
    if (!user) return;

    try {
      const travelPlanData = {
        userId: user.id,
        destinationId: data.destination,
        budget: {
          totalAmount: data.totalBudget,
          currency: data.currency,
          categories: {
            accommodation: Math.round(data.totalBudget * 0.4),
            food: Math.round(data.totalBudget * 0.3),
            activities: Math.round(data.totalBudget * 0.2),
            transport: Math.round(data.totalBudget * 0.07),
            other: Math.round(data.totalBudget * 0.03),
          },
        },
        dates: {
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          duration: Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        },
        preferences: {
          accommodationType: data.accommodationType,
          activityTypes: data.activityTypes,
          dietaryRestrictions: data.dietaryRestrictions || [],
          accessibility: data.accessibility,
        },
      };

      const plan = await travelPlanningService.createTravelPlan(travelPlanData);
      createPlan(plan);
      router.push('/pages/travel-recommendations');
    } catch (error) {
      console.error('Failed to create travel plan:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      previousStep();
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="travel-planning-page">
      <div className="container">
        <header className="page-header">
          <h1>Plan Your Perfect Trip</h1>
          <p>Let's create an amazing travel experience tailored just for you</p>
        </header>

        <StepIndicator currentStep={currentStep} totalSteps={4} />

        <form onSubmit={handleSubmit(onSubmit)} className="travel-form">
          {currentStep === 1 && (
            <DestinationStep register={register} watch={watch} setValue={setValue} errors={errors} />
          )}
          {currentStep === 2 && (
            <BudgetStep register={register} watch={watch} setValue={setValue} errors={errors} />
          )}
          {currentStep === 3 && (
            <PreferencesStep register={register} watch={watch} setValue={setValue} errors={errors} />
          )}
          {currentStep === 4 && (
            <div className="step-content">
              <h2>Review your trip</h2>
              <div className="trip-summary">
                <h3>Trip Summary</h3>
                <p><strong>Destination:</strong> {watch('destination')}</p>
                <p><strong>Dates:</strong> {watch('startDate')} to {watch('endDate')}</p>
                <p><strong>Budget:</strong> ${watch('totalBudget')}</p>
                <p><strong>Accommodation:</strong> {watch('accommodationType')}</p>
                <p><strong>Activities:</strong> {watch('activityTypes')?.join(', ')}</p>
              </div>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Creating Plan...' : 'Create Travel Plan'}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .travel-planning-page {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--td-dark);
        }

        .page-header p {
          color: #6B7280;
          font-size: 1.1rem;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 3rem;
          gap: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .step-circle {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .step.active .step-circle {
          background: var(--td-blue);
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: #6B7280;
          text-align: center;
          max-width: 6rem;
        }

        .step-connector {
          position: absolute;
          top: 2rem;
          left: 100%;
          width: 2rem;
          height: 2px;
          background: #E5E7EB;
        }

        .travel-form {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .step-content {
          margin-bottom: 2rem;
        }

        .step-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--td-dark);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--td-dark);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #D1D5DB;
          border-radius: 0.5rem;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--td-blue);
          box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .destination-card {
          padding: 1rem;
          border: 2px solid #E5E7EB;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .destination-card:hover {
          border-color: var(--td-blue);
        }

        .destination-card.selected {
          border-color: var(--td-blue);
          background: rgba(30, 136, 229, 0.05);
        }

        .dates-section {
          margin-top: 2rem;
        }

        .date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .budget-recommendation {
          background: #F9FAFB;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .budget-total {
          text-align: center;
          margin-bottom: 1rem;
        }

        .budget-total .amount {
          font-size: 2rem;
          font-weight: 700;
          color: var(--td-blue);
        }

        .budget-categories {
          display: grid;
          gap: 0.5rem;
        }

        .category {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .radio-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .activity-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid #E5E7EB;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .activity-option:hover {
          border-color: var(--td-blue);
        }

        .activity-option.selected {
          border-color: var(--td-blue);
          background: rgba(30, 136, 229, 0.05);
        }

        .activity-option .icon {
          font-size: 2rem;
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .trip-summary {
          background: #F9FAFB;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--td-blue);
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #1565C0;
        }

        .btn-secondary {
          background: #6B7280;
          color: white;
          border: none;
        }

        .btn-secondary:hover {
          background: #4B5563;
        }

        .error {
          color: #DC2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .step-indicator {
            gap: 1rem;
          }

          .step-circle {
            width: 3rem;
            height: 3rem;
            font-size: 1.2rem;
          }

          .step-connector {
            width: 1rem;
          }

          .date-inputs {
            grid-template-columns: 1fr;
          }

          .radio-group {
            grid-template-columns: 1fr;
          }

          .activity-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
