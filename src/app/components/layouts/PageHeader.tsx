'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        {breadcrumbs && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <a href={item.href}>{item.label}</a>
                  ) : (
                    <span aria-current="page">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="separator">/</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className="header-content">
          <div className="header-text">
            <h1>{title}</h1>
            {subtitle && <p className="subtitle">{subtitle}</p>}
          </div>
          {actions && (
            <div className="header-actions">
              {actions}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-header {
          background: linear-gradient(135deg, var(--td-blue) 0%, #1565C0 100%);
          color: white;
          padding: 2rem 0;
          margin-bottom: 2rem;
        }

        .breadcrumbs {
          margin-bottom: 1rem;
        }

        .breadcrumbs ol {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 0.875rem;
        }

        .breadcrumbs li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .breadcrumbs a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumbs a:hover {
          color: white;
          text-decoration: underline;
        }

        .breadcrumbs span[aria-current] {
          color: white;
          font-weight: 500;
        }

        .separator {
          color: rgba(255, 255, 255, 0.6);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }

        .header-text h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1.125rem;
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          line-height: 1.4;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 1.5rem 0;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-text h1 {
            font-size: 2rem;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .header-text h1 {
            font-size: 1.75rem;
          }

          .breadcrumbs ol {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </header>
  )
}
