/**
 * Footer.js
 * ---------
 * Site footer with four link columns and a bottom copyright row.
 *
 * Beginner notes:
 *  - FOOTER_COLUMNS holds each section heading and its links.
 *  - On mobile, useState toggles each column open/closed like an accordion.
 */

import { useState } from 'react'
import './Footer.css'

const FOOTER_COLUMNS = [
  {
    heading: 'Support',
    links: [
      'Help Center',
      'Safety information',
      'Cancellation options',
      'Our COVID-19 Response',
      'Supporting people with disabilities',
      'Report a neighborhood concern',
    ],
  },
  {
    heading: 'Community',
    links: [
      'Airbnb.org: disaster relief housing',
      'Support Afghan refugees',
      'Combating discrimination',
      'Guest Referrals',
      'Gift cards',
    ],
  },
  {
    heading: 'Hosting',
    links: [
      'Try hosting',
      'AirCover: protection for Hosts',
      'Explore hosting resources',
      'Visit our community forum',
      'How to host responsibly',
      'Host an online experience',
    ],
  },
  {
    heading: 'About',
    links: [
      'Newsroom',
      'Learn about new features',
      'Letter from our founders',
      'Careers',
      'Investors',
      'Airbnb Luxe',
    ],
  },
]

const LEGAL_LINKS = ['Privacy', 'Terms', 'Sitemap']

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/airbnb' },
  { name: 'Twitter', href: 'https://x.com/airbnb' },
  { name: 'Instagram', href: 'https://www.instagram.com/airbnb' },
]

function SocialIcon({ name }) {
  if (name === 'Facebook') {
    return (
      <svg className="footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 8.5V6.75c0-.69.56-1.25 1.25-1.25H16V3h-2.25A3.75 3.75 0 0010 6.75V8.5H8v2.75h2v6.75h3.5v-6.75H16l.5-2.75h-3z" />
      </svg>
    )
  }

  if (name === 'Twitter') {
    return (
      <svg className="footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 3H21.5l-7.36 8.41L22.5 21h-6.78l-5.31-6.16L4.1 21H.84l7.87-9-7.3-8.34h6.93l4.8 5.58L18.24 3zm-2.38 16.2h1.86L7.82 5.67H5.82l10.04 13.53z" />
      </svg>
    )
  }

  return (
    <svg className="footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm4.88-2.63a.88.88 0 11-1.76 0 .88.88 0 011.76 0z" />
    </svg>
  )
}

function Footer({ columns = FOOTER_COLUMNS }) {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (heading) => {
    setOpenSections((prev) => ({
      ...prev,
      [heading]: !prev[heading],
    }))
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__columns">
          {columns.map((column) => {
            const isOpen = Boolean(openSections[column.heading])

            return (
              <div key={column.heading} className="footer__column">
                <button
                  type="button"
                  className="footer__column-header"
                  aria-expanded={isOpen}
                  onClick={() => toggleSection(column.heading)}
                >
                  <span className="footer__heading">{column.heading}</span>
                  <svg
                    className={`footer__chevron ${isOpen ? 'footer__chevron--open' : ''}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <ul
                  className={`footer__links ${
                    isOpen ? 'footer__links--open' : ''
                  }`}
                >
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="footer__link" href="/">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="footer__divider" />

        <div className="footer__bottom">
          <div className="footer__legal">
            <span className="footer__copyright">© 2026 Airbnb Clone, Inc.</span>
            {LEGAL_LINKS.map((link) => (
              <a key={link} className="footer__legal-link" href="/">
                {link}
              </a>
            ))}
          </div>

          <div className="footer__bottom-end">
            <div className="footer__controls">
              <button className="footer__control" type="button">
                <svg className="footer__globe" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.07-4.02A8.03 8.03 0 0119.93 11zM12 4c.9 1.23 1.63 2.62 2.12 4H9.88A11.7 11.7 0 0112 4zM4.25 13h3.18a15.9 15.9 0 001.07 4.02A8.03 8.03 0 014.25 13zm3.18-2H4.25a8.03 8.03 0 014.11-4.02A15.9 15.9 0 007.43 11zM12 20a11.7 11.7 0 01-2.12-4h4.24A11.7 11.7 0 0112 20zm2.57-5.98A15.9 15.9 0 0015.57 13h3.18a8.03 8.03 0 01-4.11 4.02zM9.88 13h4.24a13.6 13.6 0 01-1.12 4 13.6 13.6 0 01-1.12-4z" />
                </svg>
                English (US)
              </button>

              <button className="footer__control" type="button">
                ZAR
              </button>
            </div>

            <div className="footer__social">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  className="footer__social-link"
                  href={social.href}
                  aria-label={social.name}
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
