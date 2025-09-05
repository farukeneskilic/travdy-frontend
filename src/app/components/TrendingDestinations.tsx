'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  avgPrice: number;
  trending: boolean;
  description: string;
  activities: string[];
}

export default function TrendingDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Destinations', icon: '🌍' },
    { id: 'beach', name: 'Beach Paradise', icon: '🏖️' },
    { id: 'city', name: 'City Breaks', icon: '🏙️' },
    { id: 'nature', name: 'Nature & Adventure', icon: '🏔️' },
    { id: 'culture', name: 'Cultural Heritage', icon: '🏛️' },
  ];

  const trendingDestinations: Destination[] = [
    {
      id: '1',
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews: 2847,
      avgPrice: 180,
      trending: true,
      description: 'Iconic white-washed buildings and stunning sunsets over the Aegean Sea.',
      activities: ['Sunset viewing', 'Wine tasting', 'Beach relaxation', 'Photography']
    },
    {
      id: '2',
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: 3254,
      avgPrice: 120,
      trending: true,
      description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
      activities: ['Temple visits', 'Tea ceremony', 'Cherry blossom viewing', 'Traditional crafts']
    },
    {
      id: '3',
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviews: 4123,
      avgPrice: 75,
      trending: true,
      description: 'Tropical paradise with rice terraces, temples, and vibrant culture.',
      activities: ['Surfing', 'Yoga retreats', 'Temple tours', 'Rice terrace trekking']
    },
    {
      id: '4',
      name: 'Barcelona',
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1544722736-ef7ad40b4b86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviews: 5672,
      avgPrice: 140,
      trending: true,
      description: 'Gaudí\'s architectural masterpieces and Mediterranean charm.',
      activities: ['Architecture tours', 'Beach time', 'Tapas tasting', 'Flamenco shows']
    },
    {
      id: '5',
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviews: 3891,
      avgPrice: 250,
      trending: true,
      description: 'Futuristic city with luxury shopping, desert adventures, and modern marvels.',
      activities: ['Desert safari', 'Luxury shopping', 'Skydiving', 'Fine dining']
    },
    {
      id: '6',
      name: 'Iceland',
      country: 'Iceland',
      image: 'https://images.unsplash.com/photo-1539160368583-6ef70b2ccc2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews: 2156,
      avgPrice: 200,
      trending: false,
      description: 'Land of fire and ice with dramatic landscapes and Northern Lights.',
      activities: ['Northern Lights', 'Hot springs', 'Glacier hiking', 'Whale watching']
    },
  ];

  useEffect(() => {
    // Simulate API call
    const loadDestinations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDestinations(trendingDestinations);
      setLoading(false);
    };

    loadDestinations();
  }, []);

  const filteredDestinations = selectedCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => {
        // Simple category filtering logic - in real app, this would be based on destination categories
        switch (selectedCategory) {
          case 'beach': return ['Santorini', 'Bali', 'Barcelona'].includes(dest.name);
          case 'city': return ['Barcelona', 'Dubai', 'Kyoto'].includes(dest.name);
          case 'nature': return ['Iceland', 'Bali'].includes(dest.name);
          case 'culture': return ['Kyoto', 'Santorini', 'Barcelona'].includes(dest.name);
          default: return true;
        }
      });

  if (loading) {
    return (
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trending Destinations
            </h2>
            <div className="loading-shimmer h-4 w-64 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="loading-shimmer h-48 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="loading-shimmer h-4 w-3/4 rounded" />
                  <div className="loading-shimmer h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🔥 Trending Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular destinations loved by travelers worldwide. 
            Book now for the best experiences and exclusive deals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-6 py-3 rounded-full font-semibold transition-all duration-300
                ${selectedCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm hover:shadow-md'
                }
              `}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {destination.trending && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      🔥 Trending
                    </span>
                  )}
                  <span className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                    ${destination.avgPrice}/day
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-semibold text-gray-800">{destination.rating}</span>
                    <span className="text-xs text-gray-600">({destination.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    📍 {destination.country}
                  </p>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {destination.description}
                </p>

                {/* Activities */}
                <div className="flex flex-wrap gap-2">
                  {destination.activities.slice(0, 3).map((activity) => (
                    <span 
                      key={activity}
                      className="bg-turquoise-100 text-turquoise-700 text-xs px-2 py-1 rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                  {destination.activities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{destination.activities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action */}
                <button className="w-full btn btn-primary group">
                  <span>Explore Destination</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in">
          <button className="btn btn-outline text-lg px-8 py-4">
            View All Destinations
            <span className="ml-2">🌍</span>
          </button>
        </div>
      </div>
    </section>
  );
}
