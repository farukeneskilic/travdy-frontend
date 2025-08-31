'use client'

import { ReactNode } from 'react'
import Navbar from '../Navbar'

interface MainLayoutProps {
  children: ReactNode
  showNavbar?: boolean
  className?: string
}

export default function MainLayout({ 
  children, 
  showNavbar = true, 
  className = '' 
}: MainLayoutProps) {
  return (
    <div className={`main-layout ${className}`}>
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>

      <style jsx>{`
        .main-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          width: 100%;
        }

        @media (max-width: 768px) {
          .main-layout {
            min-height: 100dvh;
          }
        }
      `}</style>
    </div>
  )
}
