'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import PageHeader from '../components/layouts/PageHeader'
import AttractionCard from '../components/AttractionCard'
import { Attraction } from '../components/AttractionCard'

// Mock data for now - this would come from your backend
const mockSearchResults: Attraction[] = [
  {
    id: 'eiffel-tower',
    city: 'Paris',
    title: 'Eiffel Tower',
    image: '/placeholder.jpg',
    priceFrom: '$30/ticket',
    rating: 9.2
  },
  {
    id: 'louvre',
    city: 'Paris',
    title: 'Louvre Museum',
    image: '/placeholder.jpg',
    priceFrom: '$25/ticket',
    rating: 9.1
  }
]

function SearchResults() {
  const params = useSearchParams()
  
  const location = params.get('location') || 'Any destination'
  const start = params.get('start')
  const end = params.get('end')
  const travelers = params.get('travelers') || '1'

  const formatDateRange = () => {
    if (!start || !end) return 'Any dates'
    
    const startDate = new Date(start).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    const endDate = new Date(end).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    return `${startDate} - ${endDate}`
  }

  return (
    <MainLayout>
      <PageHeader
        title="Search Results"
        subtitle={`Found ${mockSearchResults.length} amazing destinations for your trip`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Search Results' }
        ]}
      />

      <div className="container search-page">
        <div className="search-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">Destination</span>
              <span className="summary-value">{location}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Dates</span>
              <span className="summary-value">{formatDateRange()}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Travelers</span>
              <span className="summary-value">
                {travelers} {parseInt(travelers) === 1 ? 'traveler' : 'travelers'}
              </span>
            </div>
          </div>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h2>Available Attractions</h2>
            <div className="results-count">
              {mockSearchResults.length} results found
            </div>
          </div>

          <div className="results-grid">
            {mockSearchResults.map(attraction => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
              />
            ))}
          </div>

          {mockSearchResults.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try adjusting your search criteria or explore our popular destinations.</p>
              <button className="btn btn-blue">
                View Popular Destinations
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-page {
          padding-bottom: 3rem;
        }

        .search-summary {
          margin-bottom: 2rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-card {
          background: white;
          border-radius: var(--td-radius);
          padding: 1.5rem;
          box-shadow: var(--td-shadow);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-label {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 500;
        }

        .summary-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--td-dark);
        }

        .search-results {
          background: white;
          border-radius: var(--td-radius);
          padding: 2rem;
          box-shadow: var(--td-shadow);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .results-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--td-dark);
        }

        .results-count {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 500;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .no-results {
          text-align: center;
          padding: 3rem 1rem;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: var(--td-dark);
        }

        .no-results p {
          color: #6B7280;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </MainLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Searching for destinations...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <SearchResults />
    </Suspense>
  )
}
