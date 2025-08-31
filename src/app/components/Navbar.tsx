'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image 
            src="/travdy-logo.png" 
            alt="Travdy" 
            width={240} 
            height={80}
            className="logo-image"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <div className="navbar-nav">
            <Link href="/search" className="nav-link">
              <span className="nav-icon">🔍</span>
              Explore
            </Link>
            <Link href="/travel-budget" className="nav-link">
              <span className="nav-icon">💰</span>
              Budget
            </Link>
            <Link href="/travel-planning" className="nav-link">
              <span className="nav-icon">🗺️</span>
              Plan Trip
            </Link>
            <Link href="/attraction" className="nav-link">
              <span className="nav-icon">🏛️</span>
              Attractions
            </Link>
          </div>

          <div className="navbar-actions">
            <Link href="/login" className="btn btn-outline">
              Sign In
            </Link>
            <Link href="/create-account" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav">
            <Link href="/search" className="mobile-nav-link" onClick={toggleMobileMenu}>
              <span className="nav-icon">🔍</span>
              Explore
            </Link>
            <Link href="/travel-budget" className="mobile-nav-link" onClick={toggleMobileMenu}>
              <span className="nav-icon">💰</span>
              Budget
            </Link>
            <Link href="/travel-planning" className="mobile-nav-link" onClick={toggleMobileMenu}>
              <span className="nav-icon">🗺️</span>
              Plan Trip
            </Link>
            <Link href="/attraction" className="mobile-nav-link" onClick={toggleMobileMenu}>
              <span className="nav-icon">🏛️</span>
              Attractions
            </Link>
          </div>
          <div className="mobile-actions">
            <Link href="/login" className="btn btn-outline" onClick={toggleMobileMenu}>
              Sign In
            </Link>
            <Link href="/create-account" className="btn btn-primary" onClick={toggleMobileMenu}>
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--td-white);
          border-bottom: 1px solid var(--td-gray-light);
          backdrop-filter: blur(10px);
          box-shadow: var(--td-shadow);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1rem;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: var(--td-transition);
        }

        .navbar-logo:hover {
          transform: scale(1.05);
        }

        .logo-image {
          height: 40px;
          width: auto;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--td-dark);
          font-weight: 500;
          border-radius: var(--td-radius-sm);
          transition: var(--td-transition);
          position: relative;
        }

        .nav-link:hover {
          background: var(--td-light);
          color: var(--td-turquoise);
          transform: translateY(-1px);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-menu-button {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          gap: 4px;
        }

        .hamburger-line {
          width: 24px;
          height: 3px;
          background: var(--td-dark);
          border-radius: 2px;
          transition: var(--td-transition);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--td-white);
          border-top: 1px solid var(--td-gray-light);
          box-shadow: var(--td-shadow-lg);
          padding: 1.5rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          text-decoration: none;
          color: var(--td-dark);
          font-weight: 500;
          border-radius: var(--td-radius-sm);
          transition: var(--td-transition);
        }

        .mobile-nav-link:hover {
          background: var(--td-light);
          color: var(--td-turquoise);
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (max-width: 1024px) {
          .navbar-nav {
            gap: 1rem;
          }
          
          .nav-link {
            padding: 0.5rem 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-menu {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0.75rem 1rem;
          }

          .mobile-actions {
            gap: 0.5rem;
          }

          .mobile-actions .btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </nav>
  )
}
