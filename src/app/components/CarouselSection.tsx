'use client'

import { ReactNode, useRef } from 'react'

interface CarouselSectionProps {
  id?: string
  title: string
  children: ReactNode
  className?: string
}

export default function CarouselSection({ 
  id, 
  title, 
  children, 
  className = '' 
}: CarouselSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id={id} className={`carousel-section container ${className}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-controls">
          <button 
            onClick={scrollLeft}
            className="carousel-arrow carousel-arrow-left"
            aria-label="Scroll left"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="carousel-arrow carousel-arrow-right"
            aria-label="Scroll right"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="carousel-container"
      >
        {children}
      </div>

      <style jsx>{`
        .carousel-section {
          margin-top: 1.5rem;
          position: relative;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 600;
          margin: 0;
          color: var(--td-dark);
          line-height: 1.2;
        }

        .carousel-controls {
          display: flex;
          gap: 0.5rem;
        }

        .carousel-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: white;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .carousel-arrow:hover {
          background: var(--td-blue);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
        }

        .carousel-arrow:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .carousel-arrow:focus {
          outline: none;
          ring: 2px;
          ring-color: var(--td-blue);
          ring-offset: 2px;
        }

        .carousel-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          padding-bottom: 0.5rem;
          
          /* Hide scrollbar */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .carousel-container > :global(*) {
          flex: 0 0 auto;
          scroll-snap-align: start;
        }

        @media (max-width: 768px) {
          .carousel-section {
            margin-top: 1rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
          }

          .carousel-container {
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .section-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .carousel-controls {
            gap: 0.25rem;
          }

          .carousel-arrow {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </section>
  )
}
