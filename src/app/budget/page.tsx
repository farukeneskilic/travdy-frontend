'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  shopping: number;
  miscellaneous: number;
}

interface BudgetSuggestion {
  category: string;
  description: string;
  estimatedCost: number;
  priority: 'high' | 'medium' | 'low';
  savings: number;
}

export default function BudgetPage() {
  const [budget, setBudget] = useState(1500);
  const [destination, setDestination] = useState('Paris, France');
  const [duration, setDuration] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [budgetType, setBudgetType] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [breakdown, setBreakdown] = useState<BudgetBreakdown>({
    accommodation: 0,
    food: 0,
    activities: 0,
    transport: 0,
    shopping: 0,
    miscellaneous: 0
  });
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const budgetTypes = [
    {
      id: 'budget',
      name: 'Budget-Friendly',
      icon: '💰',
      description: 'Backpacker style, hostels, street food',
      dailyRange: '$30-80'
    },
    {
      id: 'moderate',
      name: 'Moderate',
      icon: '💎',
      description: 'Mid-range hotels, local restaurants',
      dailyRange: '$80-200'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: '👑',
      description: 'Premium hotels, fine dining',
      dailyRange: '$200+'
    }
  ];

  const calculateBudget = async () => {
    setIsCalculating(true);
    
    // Simulate API call for budget calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dailyBudget = budget / duration;
    const multiplier = budgetType === 'budget' ? 0.7 : budgetType === 'luxury' ? 1.5 : 1;
    
    const newBreakdown: BudgetBreakdown = {
      accommodation: Math.round(dailyBudget * 0.4 * multiplier * duration),
      food: Math.round(dailyBudget * 0.25 * multiplier * duration),
      activities: Math.round(dailyBudget * 0.2 * multiplier * duration),
      transport: Math.round(dailyBudget * 0.1 * multiplier * duration),
      shopping: Math.round(dailyBudget * 0.03 * multiplier * duration),
      miscellaneous: Math.round(dailyBudget * 0.02 * multiplier * duration)
    };
    
    setBreakdown(newBreakdown);
    
    // Generate suggestions
    const newSuggestions: BudgetSuggestion[] = [
      {
        category: 'Accommodation',
        description: 'Book accommodations 2 months in advance for better rates',
        estimatedCost: newBreakdown.accommodation,
        priority: 'high',
        savings: Math.round(newBreakdown.accommodation * 0.15)
      },
      {
        category: 'Food',
        description: 'Mix local markets with restaurants for authentic & budget-friendly meals',
        estimatedCost: newBreakdown.food,
        priority: 'medium',
        savings: Math.round(newBreakdown.food * 0.25)
      },
      {
        category: 'Activities',
        description: 'Look for city passes and group discounts for major attractions',
        estimatedCost: newBreakdown.activities,
        priority: 'medium',
        savings: Math.round(newBreakdown.activities * 0.2)
      },
      {
        category: 'Transport',
        description: 'Use public transport and walk when possible',
        estimatedCost: newBreakdown.transport,
        priority: 'low',
        savings: Math.round(newBreakdown.transport * 0.3)
      }
    ];
    
    setSuggestions(newSuggestions);
    setIsCalculating(false);
  };

  useEffect(() => {
    calculateBudget();
  }, [budget, duration, travelers, budgetType]);

  const totalBreakdown = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const dailyAverage = totalBreakdown / duration;

  const getBreakdownPercentage = (amount: number) => {
    return totalBreakdown > 0 ? (amount / totalBreakdown) * 100 : 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="section bg-gradient-hero">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              💰 Smart Budget Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized budget breakdowns, real-time cost estimates, and money-saving tips 
              for your perfect trip.
            </p>
          </div>

          {/* Budget Input Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="card card-glass p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Trip Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Destination */}
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="Paris, France">Paris, France</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                    <option value="New York, USA">New York, USA</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="Barcelona, Spain">Barcelona, Spain</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label className="form-label">Duration (days)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    min="1"
                    max="365"
                    className="form-input"
                  />
                </div>

                {/* Travelers */}
                <div className="form-group">
                  <label className="form-label">Travelers</label>
                  <input
                    type="number"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    min="1"
                    max="20"
                    className="form-input"
                  />
                </div>

                {/* Total Budget */}
                <div className="form-group">
                  <label className="form-label">Total Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                    min="0"
                    step="100"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Budget Type Selection */}
              <div className="mb-8">
                <label className="form-label mb-4">Travel Style</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {budgetTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setBudgetType(type.id as any)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        budgetType === type.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="font-semibold">{type.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                      <div className="text-sm font-medium text-primary mt-2">{type.dailyRange}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Budget Summary */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">${budget.toLocaleString()}</div>
                    <div className="text-gray-600">Total Budget</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500">${Math.round(dailyAverage).toLocaleString()}</div>
                    <div className="text-gray-600">Per Day</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-leaf-600">${Math.round(budget / travelers).toLocaleString()}</div>
                    <div className="text-gray-600">Per Person</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          {isCalculating ? (
            <div className="max-w-4xl mx-auto">
              <div className="card p-12 text-center">
                <LoadingSpinner size="xl" />
                <h3 className="text-xl font-semibold text-gray-700 mt-6">
                  Calculating your personalized budget...
                </h3>
                <p className="text-gray-600 mt-2">
                  Analyzing {destination} prices and finding the best deals for you
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Budget Breakdown Chart */}
              <div className="card p-8 animate-scale-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Budget Breakdown
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(breakdown).map(([category, amount]) => {
                    const percentage = getBreakdownPercentage(amount);
                    const categoryLabels: { [key: string]: { label: string; icon: string; color: string } } = {
                      accommodation: { label: 'Accommodation', icon: '🏨', color: 'bg-blue-500' },
                      food: { label: 'Food & Dining', icon: '🍽️', color: 'bg-green-500' },
                      activities: { label: 'Activities', icon: '🎯', color: 'bg-orange-500' },
                      transport: { label: 'Transport', icon: '🚗', color: 'bg-purple-500' },
                      shopping: { label: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
                      miscellaneous: { label: 'Miscellaneous', icon: '💼', color: 'bg-gray-500' }
                    };
                    
                    const categoryInfo = categoryLabels[category];
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{categoryInfo.icon}</span>
                            <span className="font-medium text-gray-700">{categoryInfo.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">${amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${categoryInfo.color} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total Estimated Cost</span>
                    <span className="text-2xl font-bold text-primary">${totalBreakdown.toLocaleString()}</span>
                  </div>
                  {totalBreakdown !== budget && (
                    <div className="mt-2 text-sm">
                      <span className={`font-medium ${
                        totalBreakdown > budget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {totalBreakdown > budget ? 'Over' : 'Under'} budget by ${Math.abs(totalBreakdown - budget).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget Suggestions */}
              <div className="card p-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  💡 Money-Saving Tips
                </h3>
                
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{suggestion.category}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Potential Savings</span>
                        <span className="font-bold text-green-600">-${suggestion.savings.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800">Total Potential Savings</span>
                    <span className="text-xl font-bold text-green-600">
                      -${suggestions.reduce((sum, s) => sum + s.savings, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Budget Tracker */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="card p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📅 Daily Budget Tracker
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Array.from({ length: Math.min(duration, 14) }, (_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="font-semibold text-gray-700 mb-2">Day {i + 1}</div>
                    <div className="text-lg font-bold text-primary">${Math.round(dailyAverage)}</div>
                    <div className="text-xs text-gray-500 mt-1">Budget</div>
                  </div>
                ))}
                {duration > 14 && (
                  <div className="flex items-center justify-center text-gray-500">
                    <span>+{duration - 14} more days</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
