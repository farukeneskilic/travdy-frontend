'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface TravelPlan {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  interests: string[];
  accommodation: string;
  weatherForecast: WeatherDay[];
}

interface WeatherDay {
  date: string;
  temperature: { min: number; max: number };
  condition: string;
  icon: string;
  precipitation: number;
}

interface PackingItem {
  id: string;
  name: string;
  category: string;
  essential: boolean;
  weatherDependent: boolean;
  quantity: number;
  packed: boolean;
  notes?: string;
}

interface DayActivity {
  id: string;
  time: string;
  title: string;
  type: 'activity' | 'meal' | 'transport' | 'accommodation';
  location: string;
  duration: string;
  cost: number;
  notes: string;
  weatherSensitive: boolean;
}

interface ItineraryDay {
  date: string;
  dayNumber: number;
  weather: WeatherDay;
  activities: DayActivity[];
  totalCost: number;
  estimatedWalking: string;
}

export default function TravelBuddyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [travelPlan, setTravelPlan] = useState<TravelPlan>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 1000,
    interests: [],
    accommodation: '',
    weatherForecast: []
  });
  const [packingList, setPackingList] = useState<PackingItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'packing' | 'calendar' | 'suggestions'>('planner');

  const interests = [
    { id: 'culture', name: 'Culture & History', icon: '🏛️' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'nature', name: 'Nature & Outdoors', icon: '🌲' },
    { id: 'adventure', name: 'Adventure Sports', icon: '🏔️' },
    { id: 'nightlife', name: 'Nightlife & Entertainment', icon: '🎵' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'relaxation', name: 'Spa & Wellness', icon: '🧘' },
    { id: 'museums', name: 'Museums & Galleries', icon: '🎨' },
    { id: 'local', name: 'Local Experiences', icon: '🏘️' }
  ];

  const accommodationTypes = [
    { id: 'hotel', name: 'Hotel', icon: '🏨' },
    { id: 'hostel', name: 'Hostel', icon: '🏠' },
    { id: 'apartment', name: 'Apartment/Airbnb', icon: '🏡' },
    { id: 'resort', name: 'Resort', icon: '🌴' },
    { id: 'guesthouse', name: 'Guesthouse', icon: '🏘️' }
  ];

  const handleInterestToggle = (interestId: string) => {
    setTravelPlan(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const generatePlan = async () => {
    setLoading(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate weather forecast
    const days = Math.ceil((new Date(travelPlan.endDate).getTime() - new Date(travelPlan.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const weatherConditions = ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌧️ Light Rain', '⛈️ Thunderstorm'];
    const weatherIcons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
    
    const forecast: WeatherDay[] = Array.from({ length: days }, (_, i) => {
      const date = new Date(travelPlan.startDate);
      date.setDate(date.getDate() + i);
      const conditionIndex = Math.floor(Math.random() * weatherConditions.length);
      
      return {
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.floor(Math.random() * 15) + 10,
          max: Math.floor(Math.random() * 15) + 20
        },
        condition: weatherConditions[conditionIndex],
        icon: weatherIcons[conditionIndex],
        precipitation: conditionIndex > 2 ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 20)
      };
    });

    // Generate packing list based on weather and interests
    const basePacking: PackingItem[] = [
      { id: '1', name: 'Passport', category: 'Documents', essential: true, weatherDependent: false, quantity: 1, packed: false },
      { id: '2', name: 'Travel Insurance', category: 'Documents', essential: true, weatherDependent: false, quantity: 1, packed: false },
      { id: '3', name: 'Phone Charger', category: 'Electronics', essential: true, weatherDependent: false, quantity: 1, packed: false },
      { id: '4', name: 'Comfortable Walking Shoes', category: 'Clothing', essential: true, weatherDependent: false, quantity: 1, packed: false },
      { id: '5', name: 'Underwear', category: 'Clothing', essential: true, weatherDependent: false, quantity: days + 2, packed: false },
      { id: '6', name: 'T-shirts', category: 'Clothing', essential: true, weatherDependent: false, quantity: Math.ceil(days / 2), packed: false },
    ];

    // Add weather-dependent items
    const hasRain = forecast.some(day => day.precipitation > 50);
    const isCold = forecast.some(day => day.temperature.min < 15);
    const isHot = forecast.some(day => day.temperature.max > 25);

    if (hasRain) {
      basePacking.push(
        { id: 'rain1', name: 'Rain Jacket', category: 'Clothing', essential: false, weatherDependent: true, quantity: 1, packed: false },
        { id: 'rain2', name: 'Umbrella', category: 'Accessories', essential: false, weatherDependent: true, quantity: 1, packed: false }
      );
    }

    if (isCold) {
      basePacking.push(
        { id: 'cold1', name: 'Warm Jacket', category: 'Clothing', essential: false, weatherDependent: true, quantity: 1, packed: false },
        { id: 'cold2', name: 'Long Pants', category: 'Clothing', essential: false, weatherDependent: true, quantity: 2, packed: false },
        { id: 'cold3', name: 'Warm Socks', category: 'Clothing', essential: false, weatherDependent: true, quantity: 3, packed: false }
      );
    }

    if (isHot) {
      basePacking.push(
        { id: 'hot1', name: 'Sunscreen', category: 'Personal Care', essential: false, weatherDependent: true, quantity: 1, packed: false },
        { id: 'hot2', name: 'Sunglasses', category: 'Accessories', essential: false, weatherDependent: true, quantity: 1, packed: false },
        { id: 'hot3', name: 'Hat', category: 'Accessories', essential: false, weatherDependent: true, quantity: 1, packed: false },
        { id: 'hot4', name: 'Shorts', category: 'Clothing', essential: false, weatherDependent: true, quantity: 2, packed: false }
      );
    }

    // Add interest-based items
    if (travelPlan.interests.includes('photography')) {
      basePacking.push(
        { id: 'photo1', name: 'Camera', category: 'Electronics', essential: false, weatherDependent: false, quantity: 1, packed: false },
        { id: 'photo2', name: 'Extra Memory Cards', category: 'Electronics', essential: false, weatherDependent: false, quantity: 2, packed: false },
        { id: 'photo3', name: 'Portable Tripod', category: 'Electronics', essential: false, weatherDependent: false, quantity: 1, packed: false }
      );
    }

    if (travelPlan.interests.includes('adventure')) {
      basePacking.push(
        { id: 'adventure1', name: 'Hiking Boots', category: 'Clothing', essential: false, weatherDependent: false, quantity: 1, packed: false },
        { id: 'adventure2', name: 'Quick-dry Clothes', category: 'Clothing', essential: false, weatherDependent: false, quantity: 2, packed: false },
        { id: 'adventure3', name: 'First Aid Kit', category: 'Health', essential: false, weatherDependent: false, quantity: 1, packed: false }
      );
    }

    // Generate itinerary
    const sampleActivities = [
      { title: 'City Walking Tour', type: 'activity' as const, duration: '3 hours', cost: 25, weatherSensitive: true },
      { title: 'Museum Visit', type: 'activity' as const, duration: '2 hours', cost: 15, weatherSensitive: false },
      { title: 'Local Restaurant Lunch', type: 'meal' as const, duration: '1 hour', cost: 30, weatherSensitive: false },
      { title: 'Scenic Viewpoint', type: 'activity' as const, duration: '1 hour', cost: 0, weatherSensitive: true },
      { title: 'Cultural Show', type: 'activity' as const, duration: '2 hours', cost: 45, weatherSensitive: false },
      { title: 'Local Market Visit', type: 'activity' as const, duration: '2 hours', cost: 20, weatherSensitive: true },
    ];

    const generatedItinerary: ItineraryDay[] = forecast.map((weather, index) => {
      const dayActivities: DayActivity[] = [
        {
          id: `${index}_1`,
          time: '09:00',
          title: 'Breakfast',
          type: 'meal',
          location: 'Hotel/Local Café',
          duration: '1 hour',
          cost: 15,
          notes: 'Start your day with local cuisine',
          weatherSensitive: false
        },
        {
          id: `${index}_2`,
          time: '10:30',
          title: sampleActivities[index % sampleActivities.length].title,
          type: sampleActivities[index % sampleActivities.length].type,
          location: travelPlan.destination,
          duration: sampleActivities[index % sampleActivities.length].duration,
          cost: sampleActivities[index % sampleActivities.length].cost,
          notes: weather.precipitation > 50 ? 'Indoor alternative ready due to rain forecast' : 'Perfect weather for this activity',
          weatherSensitive: sampleActivities[index % sampleActivities.length].weatherSensitive
        },
        {
          id: `${index}_3`,
          time: '13:00',
          title: 'Lunch',
          type: 'meal',
          location: 'Local Restaurant',
          duration: '1.5 hours',
          cost: 25,
          notes: 'Try local specialties',
          weatherSensitive: false
        },
        {
          id: `${index}_4`,
          time: '15:30',
          title: sampleActivities[(index + 1) % sampleActivities.length].title,
          type: sampleActivities[(index + 1) % sampleActivities.length].type,
          location: travelPlan.destination,
          duration: sampleActivities[(index + 1) % sampleActivities.length].duration,
          cost: sampleActivities[(index + 1) % sampleActivities.length].cost,
          notes: 'Afternoon exploration',
          weatherSensitive: sampleActivities[(index + 1) % sampleActivities.length].weatherSensitive
        },
        {
          id: `${index}_5`,
          time: '19:00',
          title: 'Dinner',
          type: 'meal',
          location: 'Restaurant',
          duration: '2 hours',
          cost: 40,
          notes: 'Evening dining experience',
          weatherSensitive: false
        }
      ];

      return {
        date: weather.date,
        dayNumber: index + 1,
        weather,
        activities: dayActivities,
        totalCost: dayActivities.reduce((sum, activity) => sum + activity.cost, 0),
        estimatedWalking: `${Math.floor(Math.random() * 5) + 3} km`
      };
    });

    // Generate AI suggestions
    const aiSuggestions = [
      `Based on the weather forecast, pack extra layers for ${forecast.filter(d => d.temperature.min < 15).length} cold days.`,
      `Consider booking indoor activities for ${forecast.filter(d => d.precipitation > 50).length} rainy days.`,
      `Your interests in ${travelPlan.interests.slice(0, 2).join(' and ')} suggest visiting the local ${travelPlan.interests.includes('culture') ? 'museums and historical sites' : 'outdoor markets and adventure spots'}.`,
      `With a budget of $${travelPlan.budget}, you can afford approximately $${Math.floor(travelPlan.budget / days)} per day.`,
      `Download offline maps and translation apps for ${travelPlan.destination} before departure.`,
      `Book accommodations in advance, especially ${travelPlan.accommodation} options which tend to fill up quickly.`,
      `Consider getting travel insurance that covers ${travelPlan.interests.includes('adventure') ? 'adventure activities' : 'standard travel risks'}.`
    ];

    setTravelPlan(prev => ({ ...prev, weatherForecast: forecast }));
    setPackingList(basePacking);
    setItinerary(generatedItinerary);
    setSuggestions(aiSuggestions);
    setLoading(false);
    setCurrentStep(2);
  };

  const togglePackingItem = (itemId: string) => {
    setPackingList(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const getPackingProgress = () => {
    const total = packingList.length;
    const packed = packingList.filter(item => item.packed).length;
    return total > 0 ? Math.round((packed / total) * 100) : 0;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'activity': return '🎯';
      case 'meal': return '🍽️';
      case 'transport': return '🚗';
      case 'accommodation': return '🏨';
      default: return '📍';
    }
  };

  if (currentStep === 1) {
    return (
      <MainLayout>
        <div className="section bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                🧳 Your AI Travel Buddy
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized travel suggestions, smart packing lists, and optimized itineraries 
                based on weather, your interests, and budget.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="card card-glass p-8 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Tell us about your trip
                </h2>

                <div className="space-y-8">
                  {/* Basic Trip Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Destination</label>
                      <input
                        type="text"
                        value={travelPlan.destination}
                        onChange={(e) => setTravelPlan(prev => ({ ...prev, destination: e.target.value }))}
                        className="form-input"
                        placeholder="e.g., Paris, France"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Number of Travelers</label>
                      <input
                        type="number"
                        value={travelPlan.travelers}
                        onChange={(e) => setTravelPlan(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                        min="1"
                        max="20"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        value={travelPlan.startDate}
                        onChange={(e) => setTravelPlan(prev => ({ ...prev, startDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        value={travelPlan.endDate}
                        onChange={(e) => setTravelPlan(prev => ({ ...prev, endDate: e.target.value }))}
                        min={travelPlan.startDate || new Date().toISOString().split('T')[0]}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="form-group">
                    <label className="form-label">Total Budget (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={travelPlan.budget}
                        onChange={(e) => setTravelPlan(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                        min="0"
                        step="100"
                        className="form-input pl-8"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  {/* Accommodation Type */}
                  <div className="form-group">
                    <label className="form-label">Preferred Accommodation</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {accommodationTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setTravelPlan(prev => ({ ...prev, accommodation: type.id }))}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            travelPlan.accommodation === type.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-sm font-medium">{type.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="form-group">
                    <label className="form-label">Your Interests (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {interests.map((interest) => (
                        <button
                          key={interest.id}
                          onClick={() => handleInterestToggle(interest.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            travelPlan.interests.includes(interest.id)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{interest.icon}</div>
                          <div className="text-sm font-medium">{interest.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="text-center pt-6">
                    <button
                      onClick={generatePlan}
                      disabled={!travelPlan.destination || !travelPlan.startDate || !travelPlan.endDate || loading}
                      className="btn btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" color="white" />
                          <span>Creating your personalized plan...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>🤖</span>
                          <span>Generate AI Travel Plan</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="section bg-gradient-hero">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              🤖 Your Personalized Travel Plan
            </h1>
            <p className="text-lg text-gray-600">
              {travelPlan.destination} • {travelPlan.startDate} to {travelPlan.endDate} • {travelPlan.travelers} traveler{travelPlan.travelers > 1 ? 's' : ''}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2">
              {[
                { id: 'suggestions', name: 'AI Suggestions', icon: '🤖' },
                { id: 'calendar', name: 'Daily Itinerary', icon: '📅' },
                { id: 'packing', name: 'Smart Packing', icon: '🧳' },
                { id: 'planner', name: 'Trip Overview', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'suggestions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">🤖</span>
                    AI-Powered Travel Suggestions
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-turquoise-50 to-orange-50 rounded-lg border border-turquoise-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-leaf-50 rounded-lg border border-leaf-200">
                    <h3 className="text-lg font-semibold text-leaf-800 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Pro Tips for {travelPlan.destination}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-leaf-700">
                      <div>• Download local transit apps before arrival</div>
                      <div>• Learn basic local phrases</div>
                      <div>• Research tipping customs</div>
                      <div>• Check visa/vaccination requirements</div>
                      <div>• Notify banks of travel plans</div>
                      <div>• Research local emergency numbers</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6 animate-fade-in">
                {itinerary.map((day, index) => (
                  <div key={day.date} className="card p-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Day {day.dayNumber} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <span className="mr-1">{day.weather.icon}</span>
                            {day.weather.temperature.min}°-{day.weather.temperature.max}°C
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">🌧️</span>
                            {day.weather.precipitation}% rain
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">🚶</span>
                            {day.estimatedWalking} walking
                          </span>
                        </div>
                      </div>
                      <div className="text-right mt-4 lg:mt-0">
                        <div className="text-2xl font-bold text-primary">${day.totalCost}</div>
                        <div className="text-sm text-gray-500">Total budget</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {day.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center min-w-16">
                            <div className="text-sm font-semibold text-gray-900">{activity.time}</div>
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.location} • {activity.duration}</p>
                            {activity.notes && <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">${activity.cost}</div>
                            {activity.weatherSensitive && day.weather.precipitation > 50 && (
                              <div className="text-xs text-orange-600">☔ Weather Alert</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'packing' && (
              <div className="animate-fade-in">
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="mr-3">🧳</span>
                      Smart Packing List
                    </h2>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{getPackingProgress()}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getPackingProgress()}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {['Documents', 'Clothing', 'Electronics', 'Personal Care', 'Accessories', 'Health'].map((category) => {
                      const categoryItems = packingList.filter(item => item.category === category);
                      if (categoryItems.length === 0) return null;
                      
                      const packedInCategory = categoryItems.filter(item => item.packed).length;
                      
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                            <span className="text-sm text-gray-500">
                              {packedInCategory}/{categoryItems.length} packed
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => togglePackingItem(item.id)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  item.packed
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className={`text-lg ${item.packed ? '✅' : '⬜'}`}>
                                        {item.packed ? '✅' : '⬜'}
                                      </span>
                                      <span className={`font-medium ${item.packed ? 'line-through' : ''}`}>
                                        {item.name}
                                      </span>
                                      {item.essential && <span className="text-red-500 text-xs">*</span>}
                                    </div>
                                    {item.quantity > 1 && (
                                      <div className="text-sm text-gray-500 ml-6">Qty: {item.quantity}</div>
                                    )}
                                    {item.weatherDependent && (
                                      <div className="text-xs text-blue-600 ml-6 flex items-center">
                                        <span className="mr-1">🌤️</span>
                                        Weather-based
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">💡 Tip:</span> Items marked with * are essential. 
                      Weather-dependent items are suggested based on the forecast for your trip.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planner' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                {/* Trip Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{itinerary.length}</div>
                        <div className="text-sm text-gray-600">Days</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-500">${itinerary.reduce((sum, day) => sum + day.totalCost, 0)}</div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-leaf-500">{packingList.length}</div>
                        <div className="text-sm text-gray-600">Packing Items</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">{suggestions.length}</div>
                        <div className="text-sm text-gray-600">AI Tips</div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Weather Forecast</h3>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                      {travelPlan.weatherForecast.slice(0, 7).map((day, index) => (
                        <div key={day.date} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">
                            Day {index + 1}
                          </div>
                          <div className="text-2xl mb-1">{day.icon}</div>
                          <div className="text-sm font-semibold">
                            {day.temperature.max}°
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.temperature.min}°
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {day.precipitation}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full btn btn-primary">
                        📧 Email Itinerary
                      </button>
                      <button className="w-full btn btn-outline">
                        📱 Download App
                      </button>
                      <button className="w-full btn btn-outline">
                        🗂️ Export PDF
                      </button>
                      <button className="w-full btn btn-outline">
                        📅 Add to Calendar
                      </button>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Preferences</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Interests:</div>
                      <div className="flex flex-wrap gap-2">
                        {travelPlan.interests.map(interestId => {
                          const interest = interests.find(i => i.id === interestId);
                          return interest ? (
                            <span key={interestId} className="bg-turquoise-100 text-turquoise-700 text-xs px-2 py-1 rounded-full">
                              {interest.icon} {interest.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-3">Accommodation:</div>
                      <div className="text-sm font-medium">{accommodationTypes.find(a => a.id === travelPlan.accommodation)?.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back to Planning Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentStep(1)}
              className="btn btn-outline text-lg px-8 py-4"
            >
              ← Plan Another Trip
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
