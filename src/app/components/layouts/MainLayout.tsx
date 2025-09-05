'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({ 
  children, 
  className = '',
  showHeader = true,
  showFooter = true 
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && <Header />}
      
      <main className={`flex-1 ${showHeader ? 'pt-16 lg:pt-20' : ''}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}