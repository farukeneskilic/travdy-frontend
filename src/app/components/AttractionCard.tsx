'use client'

import Image from 'next/image'
import Link from 'next/link'

export interface Attraction {
  id: string
  city: string
  title: string
  image: string
  priceFrom?: string
  rating?: number
}

interface AttractionCardProps {
  attraction: Attraction
  className?: string
}

export default function AttractionCard({ 
  attraction, 
  className = '' 
}: AttractionCardProps) {
  return (
    <article className={`card attraction-card ${className}`}>
      <div className="card-image-container">
        {attraction.rating && (
          <span className="badge rating-badge">
            {attraction.rating.toFixed(1)}
          </span>
        )}
        <Image
          src={attraction.image}
          alt={attraction.title}
          width={640}
          height={480}
          className="card-img"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">{attraction.title}</h3>
          {attraction.priceFrom && (
            <span className="card-price">from {attraction.priceFrom}</span>
          )}
        </div>
        <p className="card-location">{attraction.city}</p>
      </div>
      
      <Link 
        href={`/attraction/${attraction.id}`} 
        aria-label={`View details for ${attraction.title}`}
        className="card-link"
      />

      <style jsx>{`
        .attraction-card {
          position: relative;
          min-width: 260px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .attraction-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-image-container {
          position: relative;
          overflow: hidden;
        }

        .rating-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          z-index: 1;
        }

        .card-img {
          width: 100%;
          height: auto;
          transition: transform 0.3s ease;
        }

        .attraction-card:hover .card-img {
          transform: scale(1.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }

        .card-title {
          font-weight: 600;
          font-size: 1rem;
          margin: 0;
          color: var(--td-dark);
        }

        .card-price {
          font-size: 0.875rem;
          opacity: 0.8;
          color: var(--td-blue);
          font-weight: 500;
        }

        .card-location {
          font-size: 0.875rem;
          opacity: 0.7;
          margin: 0;
          color: #6B7280;
        }

        .card-link {
          position: absolute;
          inset: 0;
          z-index: 2;
          text-decoration: none;
        }

        .card-link:focus {
          outline: 2px solid var(--td-blue);
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .attraction-card {
            min-width: 240px;
          }
        }
      `}</style>
    </article>
  )
}
