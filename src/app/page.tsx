import React from 'react';
import Link from 'next/link';
import MainLayout from './components/layouts/MainLayout';
import EnhancedHeroSearch from './components/EnhancedHeroSearch';
import TrendingDestinations from './components/TrendingDestinations';
import TrendingActivities from './components/TrendingActivities';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Journey Section - Where/When/Who */}
      <EnhancedHeroSearch />

      {/* Trending Destinations */}
      <TrendingDestinations />

      {/* Trending Activities */}
      <TrendingActivities />

      {/* Quick Access to Other Sections */}
      <section className="section bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🚀 Your Travel Toolkit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan, budget, and enjoy your perfect trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Budget Tool */}
            <div className="card card-glass hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center animate-scale-in">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Budget</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Calculate costs, track expenses, and get real-time budget suggestions based on your preferences.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">🏨 Accommodation</span>
                  <span className="font-semibold">Auto-calculated</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">🍽️ Food & Dining</span>
                  <span className="font-semibold">Real-time pricing</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">🎯 Activities</span>
                  <span className="font-semibold">Budget-aware</span>
                </div>
              </div>
              <Link href="/budget" className="btn btn-secondary w-full mt-6">
                Plan Budget
              </Link>
            </div>

            {/* Activities Finder */}
            <div className="card card-glass hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Activities</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover experiences based on your interests, budget, and group preferences with popularity insights.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['🎵 Concerts', '🏛️ Cultural', '🍽️ Food Tours', '👥 Meetups', '🗺️ Local Guides'].map((tag) => (
                  <span key={tag} className="bg-turquoise-100 text-turquoise-700 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/activities" className="btn btn-primary w-full">
                Explore Activities
              </Link>
            </div>

            {/* Travel Buddy */}
            <div className="card card-glass hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6">🧳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Travel Buddy</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your AI travel companion with packing lists, weather-based suggestions, and daily itinerary planning.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">📦 Smart Packing</span>
                  <span className="font-semibold">Weather-based</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">📅 Daily Plans</span>
                  <span className="font-semibold">Optimized routes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">💡 AI Suggestions</span>
                  <span className="font-semibold">Personalized</span>
                </div>
              </div>
              <Link href="/travel-buddy" className="btn btn-accent w-full mt-6">
                Get Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-gradient-sunset text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready for your next adventure?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Join thousands of travelers who trust Travdy to create unforgettable journeys. 
              Start planning your perfect trip today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/travel-buddy" className="btn bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
                Start Planning Now
                <span className="ml-2">✈️</span>
              </Link>
              <Link href="/activities" className="btn btn-outline border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4">
                Explore Activities
                <span className="ml-2">🎯</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-80">
              {[
                { number: '50K+', label: 'Happy Travelers' },
                { number: '200+', label: 'Destinations' },
                { number: '10K+', label: 'Activities' },
                { number: '4.9⭐', label: 'User Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}