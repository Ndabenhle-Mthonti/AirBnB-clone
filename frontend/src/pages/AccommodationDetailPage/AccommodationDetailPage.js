/**
 * AccommodationDetailPage.js
 * --------------------------
 * Full listing details page (rubric: Location Details Page).
 *
 * Route: /accommodations/:id
 * API:   GET /api/airbnbs/:id
 *
 * Sections:
 *  - Heading + location
 *  - Image gallery (5-tile grid)
 *  - Static info (description, amenities, house rules)
 *  - Booking widget with dynamic cost calculator
 */

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import BookingWidget from '../../components/BookingWidget/BookingWidget'
import { getAccommodationUrl } from '../../config/api'
import './AccommodationDetailPage.css'

const AccommodationDetailPage = () => {
  const { id } = useParams()
  const [accommodation, setAccommodation] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      setAccommodation(null)
      setError('')

      try {
        const response = await fetch(getAccommodationUrl(id))
        const json = await response.json()

        if (response.ok) {
          setAccommodation(json)
        } else {
          setError(json.error || 'Listing not found')
        }
      } catch (err) {
        setError('Could not connect to the server.')
      }
    }

    fetchListing()
  }, [id])

  if (error) {
    return (
      <div className="detail-page">
        <p className="detail-page__error">{error}</p>
        <Link to="/accommodations" className="detail-page__back">
          ← Back to accommodations
        </Link>
      </div>
    )
  }

  if (!accommodation) {
    return <p className="detail-page__loading">Loading accommodation...</p>
  }

  const locationLabel = accommodation.location
    ? `${accommodation.location.city}, ${accommodation.location.country}`
    : ''

  return (
    <div className="detail-page">
      <Link to="/accommodations" className="detail-page__back">
        ← Back to accommodations
      </Link>

      <header className="detail-page__header">
        <h1 className="detail-page__title">{accommodation.title}</h1>
        <p className="detail-page__subtitle">
          {accommodation.type} in {locationLabel}
          {accommodation.rating > 0 && (
            <span className="detail-page__rating">
              ★ {Number(accommodation.rating).toFixed(2)} ·{' '}
              {accommodation.reviewCount} reviews
            </span>
          )}
          {accommodation.isSuperhost && (
            <span className="detail-page__superhost"> · Superhost</span>
          )}
        </p>
        {accommodation.airbnbUrl && (
          <a
            className="detail-page__airbnb-link"
            href={accommodation.airbnbUrl}
            target="_blank"
            rel="noreferrer"
          >
            View original listing on Airbnb ↗
          </a>
        )}
      </header>

      <ImageGallery
        photos={accommodation.photos}
        coverPhoto={accommodation.coverPhoto}
        title={accommodation.title}
      />

      <div className="detail-page__layout">
        <section className="detail-page__main">
          <div className="detail-page__host-row">
            <h2>
              {accommodation.type} hosted in {accommodation.location?.city}
            </h2>
            <p>
              {accommodation.maxGuests} guests · {accommodation.bedrooms} bedrooms ·{' '}
              {accommodation.beds} beds · {accommodation.bathrooms} bathrooms
            </p>
          </div>

          {accommodation.summary && (
            <p className="detail-page__summary">{accommodation.summary}</p>
          )}

          <hr className="detail-page__divider" />

          <section className="detail-page__section">
            <h3>About this place</h3>
            <p>{accommodation.description}</p>
          </section>

          {accommodation.amenities?.length > 0 && (
            <section className="detail-page__section">
              <h3>What this place offers</h3>
              <ul className="detail-page__amenities">
                {accommodation.amenities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {accommodation.houseRules?.length > 0 && (
            <section className="detail-page__section">
              <h3>House rules</h3>
              <ul>
                {accommodation.houseRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="detail-page__section">
            <h3>Booking details</h3>
            <p>Check-in: {accommodation.checkInTime || '3:00 PM'}</p>
            <p>Check-out: {accommodation.checkOutTime || '11:00 AM'}</p>
            <p>
              Cancellation policy:{' '}
              <strong>{accommodation.cancellationPolicy || 'flexible'}</strong>
            </p>
            <p>Minimum nights: {accommodation.minNights || 1}</p>
          </section>
        </section>

        <BookingWidget accommodation={accommodation} />
      </div>
    </div>
  )
}

export default AccommodationDetailPage
