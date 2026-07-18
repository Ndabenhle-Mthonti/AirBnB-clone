/**
 * BookingWidget.js
 * ----------------
 * Booking card on the details page (cost calculator + Reserve button).
 *
 * Beginner flow:
 *  1. User picks check-in, check-out, guests
 *  2. We calculate price on the screen (same fees as backend)
 *  3. User clicks Reserve → POST /api/reservations with JWT token
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { RESERVATIONS_URL } from '../../config/api'
import { getAuthHeaders } from '../../utils/authSession'
import {
  calculateNights,
  calculatePriceBreakdown,
  formatCurrency,
} from '../../utils/bookingCalculations'
import './BookingWidget.css'

const BookingWidget = ({ accommodation }) => {
  const { user, logoutUser } = useAuthContext()
  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple variables (no useMemo — easier to read for beginners)
  const nights = calculateNights(checkIn, checkOut)
  const breakdown = calculatePriceBreakdown(accommodation.pricePerNight, nights)
  const currency = accommodation.currency || 'ZAR'
  const totalGuests = adults + children

  const handleReserve = async () => {
    setError('')
    setSuccess('')

    if (!user) {
      navigate('/login', { state: { from: 'booking' } })
      return
    }

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.')
      return
    }

    // Quick checks for the UI — backend validates again on POST
    if (nights < (accommodation.minNights || 1)) {
      setError(`Minimum stay is ${accommodation.minNights || 1} night(s).`)
      return
    }

    if (totalGuests > accommodation.maxGuests) {
      setError(`Maximum ${accommodation.maxGuests} guests allowed.`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(RESERVATIONS_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accommodationId: accommodation._id,
          checkIn,
          checkOut,
          guests: { adults, children, infants: 0 },
        }),
      })

      const json = await response.json()

      if (response.ok) {
        setSuccess('Booking confirmed! View it under My reservations.')
        setTimeout(() => navigate('/reservations'), 1500)
      } else if (response.status === 401) {
        logoutUser()
        setError('Your session expired. Redirecting to login...')
        setTimeout(() => navigate('/login', { state: { from: 'booking' } }), 1500)
      } else {
        setError(json.error || 'Booking failed. Please try again.')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="booking-widget" aria-label="Book this accommodation">
      <div className="booking-widget__price">
        <strong>
          {formatCurrency(accommodation.pricePerNight, currency)}
        </strong>
        <span> / night</span>
      </div>

      <div className="booking-widget__fields">
        <label className="booking-widget__field">
          <span>Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
          />
        </label>

        <label className="booking-widget__field">
          <span>Check-out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
          />
        </label>

        <label className="booking-widget__field booking-widget__field--full">
          <span>Guests</span>
          <div className="booking-widget__guest-row">
            <span>Adults</span>
            <input
              type="number"
              min={1}
              max={accommodation.maxGuests}
              value={adults}
              onChange={(event) => setAdults(Number(event.target.value))}
            />
          </div>
          <div className="booking-widget__guest-row">
            <span>Children</span>
            <input
              type="number"
              min={0}
              max={accommodation.maxGuests}
              value={children}
              onChange={(event) => setChildren(Number(event.target.value))}
            />
          </div>
        </label>
      </div>

      <button
        className="booking-widget__reserve"
        type="button"
        onClick={handleReserve}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Reserving...' : user ? 'Reserve' : 'Log in to reserve'}
      </button>

      {nights > 0 && (
        <div className="booking-widget__breakdown">
          <div className="booking-widget__line">
            <span>
              {formatCurrency(accommodation.pricePerNight, currency)} × {nights}{' '}
              nights
            </span>
            <span>{formatCurrency(breakdown.subtotal, currency)}</span>
          </div>
          <div className="booking-widget__line">
            <span>Cleaning fee</span>
            <span>{formatCurrency(breakdown.cleaningFee, currency)}</span>
          </div>
          <div className="booking-widget__line">
            <span>Service fee</span>
            <span>{formatCurrency(breakdown.serviceFee, currency)}</span>
          </div>
          <div className="booking-widget__line booking-widget__line--total">
            <span>Total</span>
            <span>{formatCurrency(breakdown.totalPrice, currency)}</span>
          </div>
        </div>
      )}

      {error && <p className="booking-widget__error">{error}</p>}
      {success && <p className="booking-widget__success">{success}</p>}

      <p className="booking-widget__note">You won&apos;t be charged yet</p>
    </aside>
  )
}

export default BookingWidget
