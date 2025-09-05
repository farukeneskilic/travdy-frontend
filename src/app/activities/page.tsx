'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Activity {
  id: string;
  title: string;
  type: 'CONCERT' | 'SIGHTSEEING' | 'CULTURAL' | 'MEETUP' | 'FOOD' | 'LOCAL_GUIDANCE';
  location: string;
  city: string;
  country: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviews: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: string;
  highlights: string[];
  description: string;
  included: string[];
  meetingPoint: string;
  cancellation: string;
  languages: string[];
  ageRestriction: string;
  popularity: number;
  budgetFriendly: boolean;
  trending: boolean;
  instantBooking: boolean;
  freeWifi: boolean;
  accessibility: boolean;
}

type ActivityType = 'ALL' | 'CONCERT' | 'SIGHTSEEING' | 'CULTURAL' | 'MEETUP' | 'FOOD' | 'LOCAL_GUIDANCE';
type SortBy = 'popularity' | 'price_low' | 'price_high' | 'rating' | 'duration';
type BudgetRange = 'any' | 'budget' | 'moderate' | 'luxury';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ActivityType>('ALL');
  const [selectedCity, setSelectedCity] = useState('all');
  const [budgetRange, setBudgetRange] = useState<BudgetRange>('any');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  const activityTypes = [
    { id: 'ALL', name: 'All Activities', icon: '🎯', color: 'bg-gray-100 text-gray-700' },
    { id: 'CONCERT', name: 'Concerts & Shows', icon: '🎵', color: 'bg-purple-100 text-purple-700' },
    { id: 'SIGHTSEEING', name: 'Sightseeing', icon: '👀', color: 'bg-blue-100 text-blue-700' },
    { id: 'CULTURAL', name: 'Cultural Experiences', icon: '🏛️', color: 'bg-orange-100 text-orange-700' },
    { id: 'MEETUP', name: 'Social Meetups', icon: '👥', color: 'bg-green-100 text-green-700' },
    { id: 'FOOD', name: 'Food & Culinary', icon: '🍽️', color: 'bg-red-100 text-red-700' },
    { id: 'LOCAL_GUIDANCE', name: 'Local Guides', icon: '🗺️', color: 'bg-yellow-100 text-yellow-700' },
  ];

  const cities = [
    'all', 'Paris', 'Tokyo', 'New York', 'London', 'Barcelona', 'Rome', 'Amsterdam', 'Berlin', 'Prague'
  ];

  const mockActivities: Activity[] = [
    {
      id: '1',
      title: 'Jazz Night at Montmartre with Wine Tasting',
      type: 'CONCERT',
      location: 'Montmartre District',
      city: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 45,
      originalPrice: 55,
      duration: '3 hours',
      rating: 4.8,
      reviews: 234,
      difficulty: 'Easy',
      groupSize: '10-20 people',
      highlights: ['Live jazz performance', 'Local wine tasting', 'Historic venue', 'Professional guide'],
      description: 'Experience the magic of Parisian jazz culture in the historic Montmartre district. Enjoy live performances while tasting carefully selected French wines.',
      included: ['Live jazz performance', 'Wine tasting (3 glasses)', 'Professional guide', 'Venue entry'],
      meetingPoint: 'Montmartre Metro Station Exit 2',
      cancellation: 'Free cancellation up to 24 hours',
      languages: ['English', 'French'],
      ageRestriction: '18+',
      popularity: 95,
      budgetFriendly: true,
      trending: true,
      instantBooking: true,
      freeWifi: false,
      accessibility: false
    },
    {
      id: '2',
      title: 'Traditional Tea Ceremony with Kimono Experience',
      type: 'CULTURAL',
      location: 'Gion District',
      city: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1544736150-6d4d4d0fe3d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 85,
      duration: '2.5 hours',
      rating: 4.9,
      reviews: 156,
      difficulty: 'Easy',
      groupSize: '4-8 people',
      highlights: ['Authentic tea ceremony', 'Kimono wearing', 'Traditional sweets', 'Cultural insights'],
      description: 'Immerse yourself in Japanese culture with an authentic tea ceremony experience. Learn the ancient art while wearing traditional kimono.',
      included: ['Kimono rental', 'Tea ceremony instruction', 'Traditional sweets', 'Photo session'],
      meetingPoint: 'Gion-Shijo Station',
      cancellation: 'Free cancellation up to 48 hours',
      languages: ['English', 'Japanese'],
      ageRestriction: 'All ages welcome',
      popularity: 88,
      budgetFriendly: false,
      trending: true,
      instantBooking: true,
      freeWifi: true,
      accessibility: true
    },
    {
      id: '3',
      title: 'Street Food Walking Tour & Market Visit',
      type: 'FOOD',
      location: 'Chinatown & Little Italy',
      city: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 65,
      originalPrice: 75,
      duration: '4 hours',
      rating: 4.7,
      reviews: 892,
      difficulty: 'Easy',
      groupSize: '8-15 people',
      highlights: ['12+ food tastings', 'Hidden local spots', 'Cultural stories', 'Recipe cards'],
      description: 'Discover NYC\'s incredible food scene through the eyes of a local. Taste authentic dishes from family-run establishments and learn the stories behind them.',
      included: ['12+ food tastings', 'Professional food guide', 'Recipe cards', 'Market visit'],
      meetingPoint: 'Columbus Park, Chinatown',
      cancellation: 'Free cancellation up to 24 hours',
      languages: ['English', 'Spanish'],
      ageRestriction: 'All ages welcome',
      popularity: 92,
      budgetFriendly: true,
      trending: false,
      instantBooking: true,
      freeWifi: false,
      accessibility: true
    },
    {
      id: '4',
      title: 'Sagrada Familia Skip-the-Line & Architecture Tour',
      type: 'SIGHTSEEING',
      location: 'Eixample District',
      city: 'Barcelona',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 55,
      duration: '2.5 hours',
      rating: 4.6,
      reviews: 1203,
      difficulty: 'Easy',
      groupSize: '15-25 people',
      highlights: ['Skip entrance lines', 'Expert architecture guide', 'Interior & exterior tour', 'Photo opportunities'],
      description: 'Explore Gaudí\'s masterpiece with an expert guide. Learn about the incredible architecture and symbolism while skipping the long entrance queues.',
      included: ['Skip-the-line tickets', 'Expert guide', 'Audio headsets', 'Digital guide'],
      meetingPoint: 'Sagrada Familia Main Entrance',
      cancellation: 'Free cancellation up to 24 hours',
      languages: ['English', 'Spanish', 'French'],
      ageRestriction: 'All ages welcome',
      popularity: 98,
      budgetFriendly: true,
      trending: true,
      instantBooking: true,
      freeWifi: false,
      accessibility: true
    },
    {
      id: '5',
      title: 'Photography Meetup: Northern Lights Chase',
      type: 'MEETUP',
      location: 'Reykjavik Outskirts',
      city: 'Reykjavik',
      country: 'Iceland',
      image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 125,
      duration: '6 hours',
      rating: 4.5,
      reviews: 67,
      difficulty: 'Moderate',
      groupSize: '5-12 people',
      highlights: ['Professional photographer guide', 'Equipment provided', 'Hot drinks included', 'Photo editing tips'],
      description: 'Join fellow photography enthusiasts for an unforgettable Northern Lights hunting experience. Learn advanced techniques while capturing nature\'s most spectacular show.',
      included: ['Transportation', 'Photography equipment', 'Hot drinks & snacks', 'Photo editing session'],
      meetingPoint: 'Reykjavik City Center',
      cancellation: 'Weather-dependent, full refund if cancelled',
      languages: ['English', 'Icelandic'],
      ageRestriction: '16+',
      popularity: 75,
      budgetFriendly: false,
      trending: true,
      instantBooking: false,
      freeWifi: false,
      accessibility: false
    },
    {
      id: '6',
      title: 'Private Roman Forum & Colosseum Guide Experience',
      type: 'LOCAL_GUIDANCE',
      location: 'Historic Center',
      city: 'Rome',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 180,
      duration: '4 hours',
      rating: 4.9,
      reviews: 445,
      difficulty: 'Easy',
      groupSize: '1-6 people',
      highlights: ['Private expert guide', 'Skip-the-line access', 'Hidden underground areas', 'Personalized pace'],
      description: 'Discover Ancient Rome with a private archaeologist guide. Explore areas usually closed to the public and get personalized insights into Roman history.',
      included: ['Private guide', 'Skip-the-line tickets', 'Underground access', 'Digital photos'],
      meetingPoint: 'Colosseum Metro Station',
      cancellation: 'Free cancellation up to 48 hours',
      languages: ['English', 'Italian', 'Spanish', 'French'],
      ageRestriction: 'All ages welcome',
      popularity: 90,
      budgetFriendly: false,
      trending: false,
      instantBooking: true,
      freeWifi: false,
      accessibility: true
    }
  ];

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActivities(mockActivities);
      setFilteredActivities(mockActivities);
      setLoading(false);
    };

    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = activities.filter(activity => {
      // Type filter
      if (selectedType !== 'ALL' && activity.type !== selectedType) return false;
      
      // City filter
      if (selectedCity !== 'all' && activity.city !== selectedCity) return false;
      
      // Budget filter
      if (budgetRange !== 'any') {
        if (budgetRange === 'budget' && activity.price > 50) return false;
        if (budgetRange === 'moderate' && (activity.price <= 50 || activity.price > 120)) return false;
        if (budgetRange === 'luxury' && activity.price <= 120) return false;
      }
      
      // Search query
      if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });

    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low': return a.price - b.price;
        case 'price_high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'duration': return parseInt(a.duration) - parseInt(b.duration);
        case 'popularity':
        default: return b.popularity - a.popularity;
      }
    });

    setFilteredActivities(filtered);
  }, [activities, selectedType, selectedCity, budgetRange, sortBy, searchQuery]);

  const getBudgetSuitability = (price: number) => {
    if (price <= 50) return { label: 'Budget-Friendly', color: 'bg-green-100 text-green-700', icon: '💰' };
    if (price <= 120) return { label: 'Moderate', color: 'bg-orange-100 text-orange-700', icon: '💎' };
    return { label: 'Premium', color: 'bg-purple-100 text-purple-700', icon: '👑' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      case 'Challenging': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeInfo = (type: string) => {
    return activityTypes.find(t => t.id === type) || activityTypes[0];
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="section bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="loading-shimmer h-12 w-96 mx-auto rounded mb-4" />
              <div className="loading-shimmer h-6 w-128 mx-auto rounded" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="loading-shimmer h-48 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="loading-shimmer h-4 w-3/4 rounded" />
                    <div className="loading-shimmer h-4 w-1/2 rounded" />
                    <div className="loading-shimmer h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
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
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              🎯 Discover Amazing Activities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find unique experiences tailored to your interests, budget, and travel style. 
              From cultural immersion to adventure sports, we've got something for everyone.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="card card-glass p-6 animate-slide-up">
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities, locations, or experiences..."
                  className="w-full form-input pl-12 pr-4 py-4 text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                {activityTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as ActivityType)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedType === type.id
                        ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                        : `${type.color} hover:shadow-md hover:scale-102`
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="form-input form-select"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city === 'all' ? 'All Cities' : city}
                      </option>
                    ))}
                  </select>

                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value as BudgetRange)}
                    className="form-input form-select"
                  >
                    <option value="any">Any Budget</option>
                    <option value="budget">Budget ($0-50)</option>
                    <option value="moderate">Moderate ($50-120)</option>
                    <option value="luxury">Luxury ($120+)</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="form-input form-select"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`btn ${showMap ? 'btn-primary' : 'btn-outline'} flex items-center space-x-2`}
                  >
                    <span>🗺️</span>
                    <span>Map View</span>
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-ghost flex items-center space-x-2"
                  >
                    <span>🔧</span>
                    <span>More Filters</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
                  <h4 className="font-semibold text-gray-700 mb-4">Advanced Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Difficulty Level</label>
                      <div className="space-y-2">
                        {['Easy', 'Moderate', 'Challenging'].map(diff => (
                          <label key={diff} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{diff}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">Features</label>
                      <div className="space-y-2">
                        {['Instant Booking', 'Free WiFi', 'Wheelchair Accessible', 'Free Cancellation'].map(feature => (
                          <label key={feature} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">Group Size</label>
                      <div className="space-y-2">
                        {['Small (1-8)', 'Medium (9-20)', 'Large (20+)', 'Private'].map(size => (
                          <label key={size} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Header */}
          <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredActivities.length} Activities Found
            </h2>
            <div className="text-gray-600">
              Showing results for {selectedCity === 'all' ? 'all cities' : selectedCity}
            </div>
          </div>

          {/* Activities Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity, index) => {
                const typeInfo = getTypeInfo(activity.type);
                const budgetInfo = getBudgetSuitability(activity.price);
                
                return (
                  <div 
                    key={activity.id}
                    className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden rounded-lg mb-4">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {activity.trending && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 Trending
                          </span>
                        )}
                        {activity.instantBooking && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ⚡ Instant
                          </span>
                        )}
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${typeInfo.color}`}>
                          {typeInfo.icon} {activity.type.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-white/95 rounded-lg px-3 py-2 text-right">
                          {activity.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              ${activity.originalPrice}
                            </div>
                          )}
                          <div className="text-lg font-bold text-gray-900">
                            ${activity.price}
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          ⏱️ {activity.duration}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {activity.title}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center mb-2">
                          📍 {activity.location}, {activity.city}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {activity.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{activity.rating}</span>
                            <span className="text-gray-500">({activity.reviews})</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${budgetInfo.color}`}>
                          {budgetInfo.icon} {budgetInfo.label}
                        </span>
                      </div>

                      {/* Group Size & Languages */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="mr-1">👥</span>
                          {activity.groupSize}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">🗣️</span>
                          {activity.languages.slice(0, 2).join(', ')}
                          {activity.languages.length > 2 && ` +${activity.languages.length - 2}`}
                        </span>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">What's included:</p>
                        <div className="flex flex-wrap gap-1">
                          {activity.highlights.slice(0, 3).map((highlight) => (
                            <span 
                              key={highlight}
                              className="bg-turquoise-50 text-turquoise-700 text-xs px-2 py-1 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                          {activity.highlights.length > 3 && (
                            <span className="text-xs text-gray-500 py-1">
                              +{activity.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {activity.freeWifi && <span>📶 WiFi</span>}
                        {activity.accessibility && <span>♿ Accessible</span>}
                        {activity.cancellation.includes('Free') && <span>🔄 Free Cancel</span>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 btn btn-primary text-sm">
                          {activity.instantBooking ? 'Book Instantly' : 'Request Booking'}
                        </button>
                        <button className="btn btn-ghost text-sm px-3">
                          💖
                        </button>
                        <button className="btn btn-ghost text-sm px-3">
                          📋
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No activities found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more activities.
                </p>
                <button 
                  onClick={() => {
                    setSelectedType('ALL');
                    setSelectedCity('all');
                    setBudgetRange('any');
                    setSearchQuery('');
                  }}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredActivities.length > 0 && (
              <div className="text-center mt-12">
                <button className="btn btn-outline text-lg px-8 py-4">
                  Load More Activities
                  <span className="ml-2">⬇️</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
