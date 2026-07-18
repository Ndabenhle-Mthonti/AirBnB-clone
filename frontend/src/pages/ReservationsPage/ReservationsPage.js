/**
 * ReservationsPage.js
 * -------------------
 * Guest reservations page (rubric: profile → view reservations).
 *
 * Route: /reservations
 * API:   GET /api/reservations
 *        PATCH /api/reservations/:id (cancel)
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RESERVATIONS_URL } from '../../config/api'
import { getAuthHeaders } from '../../utils/authHeaders'
import './ReservationsPage.css'

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const ReservationsPage = () => {
  const [reservations, setReservations] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchReservations = async () => {
    setError('')
    setReservations(null)

    try {
      const response = await fetch(RESERVATIONS_URL, {
        headers: getAuthHeaders(),
      })
      const json = await response.json()

      if (response.ok) {
        setReservations(json)
      } else {
        setError(json.error || 'Failed to load reservations')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleCancel = async (id, title) => {
    if (!window.confirm(`Cancel your booking for "${title}"?`)) return

    try {
      const response = await fetch(`${RESERVATIONS_URL}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })
      const json = await response.json()

      if (response.ok) {
        setMessage('Reservation cancelled.')
        fetchReservations()
      } else {
        setError(json.error || 'Cancel failed')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    }
  }

  return (
    <div className="reservations-page">
      <h1>My reservations</h1>
      <p className="reservations-page__hint">
        Bookings you made on accommodations across South Africa.
      </p>

      {message && <p className="reservations-page__success">{message}</p>}
      {error && <p className="reservations-page__error">{error}</p>}

      {reservations === null && !error && (
        <p className="reservations-page__status">Loading reservations...</p>
      )}

      {reservations && reservations.length === 0 && (
        <p className="reservations-page__status">
          No reservations yet.{' '}
          <Link to="/accommodations">Browse accommodations</Link>
        </p>
      )}

      <div className="reservations-page__list">
        {reservations?.map((booking) => (
          <article
            key={booking._id}
            className={`reservations-page__card reservations-page__card--${booking.status}`}
          >
            <div className="reservations-page__card-main">
              <h2>{booking.accommodationTitle}</h2>
              {booking.city && <p className="reservations-page__city">{booking.city}</p>}
              <p>
                {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)} ·{' '}
                {booking.nights} night(s)
              </p>
              <p className="reservations-page__total">
                {booking.currency} {booking.totalPrice?.toLocaleString()} total
              </p>
              <span className="reservations-page__badge">{booking.status}</span>
            </div>

            <div className="reservations-page__actions">
              <Link to={`/accommodations/${booking.accommodation?._id || booking.accommodation}`}>
                View listing
              </Link>
              {booking.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => handleCancel(booking._id, booking.accommodationTitle)}
                >
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReservationsPage
