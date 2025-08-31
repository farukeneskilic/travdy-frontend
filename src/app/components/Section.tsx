'use client'

import { ReactNode } from 'react'

interface SectionProps {
  id?: string
  title: string
  children: ReactNode
  asCarousel?: boolean
  className?: string
}

export default function Section({ 
  id, 
  title, 
  children, 
  asCarousel = false,
  className = ''
}: SectionProps) {
  return (
    <section id={id} className={`section container ${className}`}>
      <h2 className="section-title">{title}</h2>
      <div className={asCarousel ? 'carousel' : 'grid grid-auto-tiles'}>
        {children}
      </div>

      <style jsx>{`
        .section {
          margin-top: 1.5rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--td-dark);
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .section {
            margin-top: 1rem;
          }

          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
