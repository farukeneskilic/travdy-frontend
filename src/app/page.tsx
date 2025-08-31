'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import BaseLayout from './components/layouts/BaseLayout'
import Section from './components/Section'
import CarouselSection from './components/CarouselSection'
import AttractionCard from './components/AttractionCard'
import { getFeaturedCities, getTopAttractions } from '@/app/lib/api'
import HeroSearch from './components/HeroSearch'
import { Attraction } from './components/AttractionCard'

export default function Home() {
  const [cities, setCities] = useState<Attraction[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [citiesData, attractionsData] = await Promise.all([
          getFeaturedCities(), 
          getTopAttractions()
        ])
        setCities(citiesData)
        setAttractions(attractionsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading amazing destinations...</p>
        </div>
      </div>
    )
  }

    return (
    <BaseLayout>
      {/* Hero Section */}
      <section className="container hero-section">
        <div className="hero" aria-label="Discover the best sights with Travdy">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop"
            alt="Beautiful travel destination landscape"
            width={1600} 
            height={800} 
            className="hero-image" 
            priority
          />
          <div className="hero-content">
            <h1 className="hero-title">
              Discover the best sights with Travdy
            </h1>
            <p className="hero-subtitle">
              Explore amazing attractions in your city!
            </p>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Top Attractions Grid */}
      <Section id="attractions" title="Top attractions">
        {cities.map(city => (
          <AttractionCard key={city.id} attraction={city} />
        ))}
      </Section>

      {/* Highly Rated Attractions Carousel */}
      <CarouselSection id="top-picks" title="Highly rated attractions">
        {attractions.map(attraction => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </CarouselSection>

      {/* Newsletter Signup Banner */}
      <section className="container newsletter-section">
        <div className="banner">
          <div className="banner-content">
            <span className="banner-icon">✈️</span>
            <div className="banner-text">
              <strong>Ready for your next adventure?</strong>
              <p>Join our Travel Club for exclusive deals, insider tips, and personalized recommendations!</p>
            </div>
          </div>
          <button className="btn btn-white" type="button">
            Start Exploring
          </button>
        </div>
      </section>



      <style jsx>{`
        .hero-section {
          margin-top: 1rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
          background: var(--td-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          opacity: 0.95;
          margin: 0.375rem 0 0.875rem;
          font-size: 1.125rem;
        }

        .newsletter-section {
          margin: 3rem 0;
        }

        .banner {
          background: var(--td-gradient-primary);
          color: white;
          padding: 2.5rem;
          border-radius: var(--td-radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }

        .banner::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: float 20s infinite linear;
          pointer-events: none;
        }

        @keyframes float {
          0% { transform: translateX(-100px) translateY(-100px) rotate(0deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
        }

        .banner-content {
          display: flex;
          gap: 1rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .banner-icon {
          width: 3rem;
          height: 3rem;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--td-radius);
          backdrop-filter: blur(10px);
          font-size: 1.5rem;
        }

        .banner-text p {
          opacity: 0.7;
          margin: 0;
        }



        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.875rem;
          }

          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }
      `}</style>
    </BaseLayout>
  )
}
