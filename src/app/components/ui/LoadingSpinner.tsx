'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-orange-500 border-t-transparent',
    accent: 'border-leaf-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        border-2 rounded-full animate-spin
        ${className}
      `}
    />
  );
}

export function LoadingDots({ 
  color = 'primary',
  className = ''
}: {
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
}) {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-orange-500',
    accent: 'bg-leaf-500',
    white: 'bg-white'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <LoadingSpinner size="xl" color="primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-full animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Loading your adventure...</h3>
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}

export function SectionLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <LoadingSpinner size="lg" color="primary" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
