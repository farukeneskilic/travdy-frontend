'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Activity {
  id: string;
  title: string;
  type: 'CONCERT' | 'SIGHTSEEING' | 'CULTURAL' | 'MEETUP' | 'FOOD' | 'LOCAL_GUIDANCE';
  location: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: string;
  highlights: string[];
  trending: boolean;
}

export default function TrendingActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const activityTypes = [
    { id: 'all', name: 'All Activities', icon: '🎯', color: 'bg-gray-100' },
    { id: 'CONCERT', name: 'Concerts', icon: '🎵', color: 'bg-purple-100' },
    { id: 'SIGHTSEEING', name: 'Sightseeing', icon: '👀', color: 'bg-blue-100' },
    { id: 'CULTURAL', name: 'Cultural', icon: '🏛️', color: 'bg-orange-100' },
    { id: 'MEETUP', name: 'Meetups', icon: '👥', color: 'bg-green-100' },
    { id: 'FOOD', name: 'Food Tours', icon: '🍽️', color: 'bg-red-100' },
    { id: 'LOCAL_GUIDANCE', name: 'Local Guides', icon: '🗺️', color: 'bg-yellow-100' },
  ];

  const trendingActivities: Activity[] = [
    {
      id: '1',
      title: 'Sunset Jazz Concert at Montmartre',
      type: 'CONCERT',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 45,
      duration: '3 hours',
      rating: 4.8,
      reviews: 234,
      difficulty: 'Easy',
      groupSize: '10-20 people',
      highlights: ['Live jazz music', 'Sunset views', 'Local artists', 'Wine tasting'],
      trending: true
    },
    {
      id: '2',
      title: 'Traditional Tea Ceremony Experience',
      type: 'CULTURAL',
      location: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1544736150-6d4d4d0fe3d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 65,
      duration: '2 hours',
      rating: 4.9,
      reviews: 156,
      difficulty: 'Easy',
      groupSize: '4-8 people',
      highlights: ['Authentic ceremony', 'Traditional sweets', 'Cultural insight', 'Photo session'],
      trending: true
    },
    {
      id: '3',
      title: 'Street Food Walking Tour',
      type: 'FOOD',
      location: 'Bangkok, Thailand',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 35,
      duration: '4 hours',
      rating: 4.7,
      reviews: 892,
      difficulty: 'Easy',
      groupSize: '8-15 people',
      highlights: ['10+ food stops', 'Local markets', 'Cultural stories', 'Recipe cards'],
      trending: true
    },
    {
      id: '4',
      title: 'Sagrada Familia Skip-the-Line Tour',
      type: 'SIGHTSEEING',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 55,
      duration: '2.5 hours',
      rating: 4.6,
      reviews: 1203,
      difficulty: 'Easy',
      groupSize: '15-25 people',
      highlights: ['Skip entrance lines', 'Expert guide', 'Architecture details', 'Photo spots'],
      trending: false
    },
    {
      id: '5',
      title: 'Local Photography Meetup',
      type: 'MEETUP',
      location: 'Reykjavik, Iceland',
      image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 25,
      duration: '3 hours',
      rating: 4.5,
      reviews: 67,
      difficulty: 'Moderate',
      groupSize: '5-12 people',
      highlights: ['Northern Lights tips', 'Local spots', 'Photo editing', 'Equipment sharing'],
      trending: true
    },
    {
      id: '6',
      title: 'Private City Guide Experience',
      type: 'LOCAL_GUIDANCE',
      location: 'Rome, Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 120,
      duration: '6 hours',
      rating: 4.9,
      reviews: 445,
      difficulty: 'Easy',
      groupSize: '1-4 people',
      highlights: ['Personalized itinerary', 'Hidden gems', 'Local insights', 'Flexible timing'],
      trending: false
    },
  ];

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setActivities(trendingActivities);
      setLoading(false);
    };

    loadActivities();
  }, []);

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedType);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      case 'Challenging': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = activityTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : '🎯';
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="loading-shimmer h-8 w-64 mx-auto rounded mb-4" />
            <div className="loading-shimmer h-4 w-96 mx-auto rounded" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-shimmer h-10 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="loading-shimmer h-48 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="loading-shimmer h-4 w-3/4 rounded" />
                  <div className="loading-shimmer h-4 w-1/2 rounded" />
                  <div className="loading-shimmer h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🌟 Trending Activities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join unique experiences curated by locals and fellow travelers. 
            From cultural immersion to adventure sports, find your perfect activity.
          </p>
        </div>

        {/* Activity Type Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-300 border-2
                ${selectedType === type.id
                  ? 'bg-gradient-primary text-white border-transparent shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:shadow-md'
                }
              `}
            >
              <span className="mr-2">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity, index) => (
            <div 
              key={activity.id}
              className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-lg mb-4">
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
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full w-fit">
                      🔥 Trending
                    </span>
                  )}
                  <span className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full w-fit flex items-center">
                    {getTypeIcon(activity.type)} {activity.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Price & Duration */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="bg-white/90 rounded-full px-3 py-1">
                    <span className="text-lg font-bold text-gray-900">${activity.price}</span>
                  </div>
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    ⏱️ {activity.duration}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center">
                    📍 {activity.location}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{activity.rating}</span>
                      <span className="text-gray-500">({activity.reviews})</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>

                {/* Group Size */}
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">👥</span>
                  <span>{activity.groupSize}</span>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Highlights:</p>
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 btn btn-primary text-sm">
                    Book Now
                  </button>
                  <button className="btn btn-ghost text-sm px-3">
                    💖
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 animate-fade-in">
          <button className="btn btn-outline text-lg px-8 py-4">
            Discover More Activities
            <span className="ml-2">🎯</span>
          </button>
        </div>
      </div>
    </section>
  );
}
