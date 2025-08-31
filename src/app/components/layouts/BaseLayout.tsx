'use client'

import { ReactNode } from 'react'
import Navbar from '../Navbar'

interface BaseLayoutProps {
  children: ReactNode
  className?: string
  showNavbar?: boolean
}

export default function BaseLayout({ 
  children, 
  className = '',
  showNavbar = true 
}: BaseLayoutProps) {
  return (
    <div className={`base-layout ${className}`}>
      {showNavbar && <Navbar />}
      
      <main className="main-content">
        {children}
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Travdy</h3>
              <p>Your trusted travel companion for discovering amazing destinations around the world.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Explore</h4>
                <ul>
                  <li><a href="/search">Destinations</a></li>
                  <li><a href="/attraction">Attractions</a></li>
                  <li><a href="/travel-budget">Budget Planning</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="/help">Help Center</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                  <li><a href="/guide">Travel Guide</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Travdy. All rights reserved.</p>
            <div className="social-links">
              <span>Follow us:</span>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .base-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--td-light);
        }

        .main-content {
          flex: 1;
          padding-top: 0;
        }

        .site-footer {
          background: var(--td-dark);
          color: var(--td-white);
          margin-top: 4rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 3rem 0;
        }

        .footer-brand h3 {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          background: var(--td-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-brand p {
          margin: 0;
          opacity: 0.8;
          line-height: 1.6;
          max-width: 400px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .footer-column h4 {
          font-size: 1rem;
          margin: 0 0 1rem 0;
          color: var(--td-turquoise);
          font-weight: 600;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-column li {
          margin-bottom: 0.5rem;
        }

        .footer-column a {
          color: var(--td-white);
          text-decoration: none;
          opacity: 0.8;
          transition: var(--td-transition);
        }

        .footer-column a:hover {
          opacity: 1;
          color: var(--td-turquoise);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-top: 1px solid var(--td-dark-light);
        }

        .footer-bottom p {
          margin: 0;
          opacity: 0.7;
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .social-links span {
          opacity: 0.7;
          margin-right: 0.5rem;
        }

        .social-links a {
          font-size: 1.2rem;
          text-decoration: none;
          transition: var(--td-transition);
        }

        .social-links a:hover {
          transform: scale(1.2);
        }

        @media (max-width: 1024px) {
          .footer-content {
            gap: 2rem;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            padding: 2rem 0;
          }

          .footer-brand p {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
