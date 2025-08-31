'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong!</h2>
        <p>
          We encountered an unexpected error while loading this page. 
          Don&apos;t worry, our team has been notified.
        </p>
        <div className="error-actions">
          <button 
            onClick={reset}
            className="btn btn-blue"
          >
            Try again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-secondary"
          >
            Go home
          </button>
        </div>
      </div>

      <style jsx>{`
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
        }

        .error-content {
          text-align: center;
          max-width: 500px;
          padding: 2rem;
          border-radius: var(--td-radius);
          background: white;
          box-shadow: var(--td-shadow);
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-content h2 {
          color: var(--td-dark);
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .error-content p {
          color: #6B7280;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-secondary {
          background: #6B7280;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }

        .btn-secondary:hover {
          background: #4B5563;
        }

        @media (max-width: 768px) {
          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn,
          .btn-secondary {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  )
}
