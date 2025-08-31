'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const searchSchema = z.object({
  location: z.string().min(1, 'Please enter a destination'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  travelers: z.number().min(1).max(12),
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

type SearchFormData = z.infer<typeof searchSchema>

export default function HeroSearch() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: '',
      startDate: '',
      endDate: '',
      travelers: 2,
    },
  })

  const watchedStartDate = watch('startDate')

  const handleFormSubmit = async (data: SearchFormData) => {
    setIsSubmitting(true)
    try {
      const params = new URLSearchParams({
        location: data.location.trim(),
        start: data.startDate,
        end: data.endDate,
        travelers: data.travelers.toString(),
      })
      
      router.push(`/search?${params.toString()}`)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form className="hero-search" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="search-field">
        <input
          {...register('location')}
          type="text"
          placeholder="Where to explore?"
          aria-label="Destination"
          className={errors.location ? 'error' : ''}
        />
        {errors.location && (
          <span className="field-error">{errors.location.message}</span>
        )}
      </div>

      <div className="search-field">
        <input
          {...register('startDate')}
          type="date"
          min={today}
          aria-label="Start date"
          className={errors.startDate ? 'error' : ''}
        />
        {errors.startDate && (
          <span className="field-error">{errors.startDate.message}</span>
        )}
      </div>

      <div className="search-field">
        <input
          {...register('endDate')}
          type="date"
          min={watchedStartDate || today}
          aria-label="End date"
          className={errors.endDate ? 'error' : ''}
        />
        {errors.endDate && (
          <span className="field-error">{errors.endDate.message}</span>
        )}
      </div>

      <div className="search-field">
        <select
          {...register('travelers', { valueAsNumber: true })}
          aria-label="Number of travelers"
          className={errors.travelers ? 'error' : ''}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'traveler' : 'travelers'}
            </option>
          ))}
        </select>
        {errors.travelers && (
          <span className="field-error">{errors.travelers.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-blue search-button"
        disabled={isSubmitting}
        aria-label={isSubmitting ? 'Searching...' : 'Search destinations'}
      >
        {isSubmitting ? 'Searching...' : 'Search'}
      </button>

      <style jsx>{`
        .hero-search {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto auto;
          gap: 0.5rem;
          align-items: start;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 0.5rem;
          width: max-content;
          max-width: 100%;
          margin: 0 auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .search-field {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .hero-search input,
        .hero-search select {
          border: none;
          background: transparent;
          padding: 0.75rem 1rem;
          min-width: 150px;
          border-radius: 999px;
          font-size: 0.875rem;
          transition: background-color 0.2s ease;
        }

        .hero-search input:focus,
        .hero-search select:focus {
          outline: 2px solid var(--td-blue);
          outline-offset: -2px;
          background: rgba(255, 255, 255, 0.8);
        }

        .hero-search input.error,
        .hero-search select.error {
          outline: 2px solid #DC2626;
          outline-offset: -2px;
        }

        .search-button {
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .search-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .field-error {
          position: absolute;
          top: 100%;
          left: 1rem;
          right: 1rem;
          font-size: 0.75rem;
          color: #DC2626;
          background: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 10;
          margin-top: 0.25rem;
        }

        @media (max-width: 1024px) {
          .hero-search {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            border-radius: 1rem;
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .hero-search {
            grid-template-columns: 1fr;
            gap: 1rem;
            border-radius: 1rem;
            padding: 1.5rem;
            width: 100%;
          }

          .hero-search input,
          .hero-search select {
            min-width: auto;
            width: 100%;
            padding: 1rem;
            border-radius: 0.5rem;
            background: white;
            border: 1px solid #E5E7EB;
          }

          .search-button {
            width: 100%;
            padding: 1rem;
            border-radius: 0.5rem;
          }

          .field-error {
            position: static;
            margin-top: 0.5rem;
            border-radius: 0.25rem;
          }
        }
      `}</style>
    </form>
  )
}
