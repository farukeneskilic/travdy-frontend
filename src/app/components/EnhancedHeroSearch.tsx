'use client';

import React, { useState, useEffect } from 'react';
import { useTravelStore } from '@/application/stores/travel.store';

interface SearchFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
}

export default function EnhancedHeroSearch() {
  const [formData, setFormData] = useState<SearchFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 'moderate'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { updateSearchCriteria } = useTravelStore();

  const popularDestinations = [
    { name: 'Paris, France', icon: '🇫🇷', trending: true },
    { name: 'Tokyo, Japan', icon: '🇯🇵', trending: true },
    { name: 'Bali, Indonesia', icon: '🇮🇩', trending: false },
    { name: 'New York, USA', icon: '🇺🇸', trending: true },
    { name: 'London, UK', icon: '🇬🇧', trending: false },
    { name: 'Barcelona, Spain', icon: '🇪🇸', trending: true },
    { name: 'Rome, Italy', icon: '🇮🇹', trending: false },
    { name: 'Dubai, UAE', icon: '🇦🇪', trending: true },
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget-Friendly', icon: '💰', description: 'Under $50/day' },
    { value: 'moderate', label: 'Moderate', icon: '💎', description: '$50-150/day' },
    { value: 'luxury', label: 'Luxury', icon: '👑', description: '$150+/day' },
  ];

  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDestinationSelect = (destination: string) => {
    setFormData(prev => ({ ...prev, destination }));
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Update global travel store
    updateSearchCriteria({
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      travelers: formData.travelers,
      budgetRange: formData.budget as 'budget' | 'moderate' | 'luxury'
    });

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSearching(false);
    
    // Navigate to results or trigger search
    console.log('Search initiated with:', formData);
  };

  const isFormValid = formData.destination && formData.startDate && formData.endDate;

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Heading */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Where will your next
              <span className="block text-gradient-primary bg-clip-text text-transparent bg-white">
                adventure begin?
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Discover amazing destinations, plan your perfect itinerary, and create unforgettable memories.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-2xl animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
              {/* Destination */}
              <div className="lg:col-span-2 relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Where to?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => {
                      handleInputChange('destination', e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search destinations..."
                    className="w-full form-input pl-12 text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🌍
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                      {popularDestinations
                        .filter(dest => 
                          dest.name.toLowerCase().includes(formData.destination.toLowerCase())
                        )
                        .map((dest) => (
                          <button
                            key={dest.name}
                            onClick={() => handleDestinationSelect(dest.name)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                          >
                            <span className="text-2xl">{dest.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{dest.name}</div>
                              {dest.trending && (
                                <div className="text-xs text-orange-500 font-semibold">🔥 Trending</div>
                              )}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full form-input text-gray-700"
                />
              </div>

              <div>
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full form-input text-gray-700"
                />
              </div>

              {/* Search Button */}
              <div className="flex flex-col">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={handleSearch}
                  disabled={!isFormValid || isSearching}
                  className="btn btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {isSearching ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🔍</span>
                      <span>Search</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              {/* Travelers */}
              <div>
                <label className="block text-left text-sm font-semibold text-gray-700 mb-3">
                  👥 Travelers
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-gray-700 w-8 text-center">
                    {formData.travelers}
                  </span>
                  <button
                    onClick={() => handleInputChange('travelers', Math.min(20, formData.travelers + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-left text-sm font-semibold text-gray-700 mb-3">
                  💰 Budget per day
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('budget', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.budget === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-lg">{option.icon}</div>
                      <div className="text-xs font-semibold">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { label: 'Destinations', value: '200+', icon: '🌎' },
              { label: 'Happy Travelers', value: '50K+', icon: '😊' },
              { label: 'Activities', value: '10K+', icon: '🎯' },
              { label: 'Countries', value: '50+', icon: '🗺️' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
