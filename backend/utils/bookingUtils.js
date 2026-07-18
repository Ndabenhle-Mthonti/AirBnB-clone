/**
 * utils/bookingUtils.js
 * ---------------------
 * Pure helper functions for booking logic.
 * Kept separate from controllers so they can be unit-tested without MongoDB.
 */

/**
 * Count nights between check-in and check-out (checkout day is not charged).
 * @param {Date|string} checkIn
 * @param {Date|string} checkOut
 * @returns {number}
 */
function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffMs = end.getTime() - start.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Returns true when two date ranges overlap (blocks double booking).
 * Example: existing booking 5–10 Aug, new booking 8–12 Aug → overlap = true
 */
function datesOverlap(rangeAStart, rangeAEnd, rangeBStart, rangeBEnd) {
  const aStart = new Date(rangeAStart)
  const aEnd = new Date(rangeAEnd)
  const bStart = new Date(rangeBStart)
  const bEnd = new Date(rangeBEnd)

  return aStart < bEnd && aEnd > bStart
}

/**
 * Build a cost breakdown matching the frontend booking widget.
 * @param {number} pricePerNight
 * @param {number} nights
 * @returns {{ subtotal: number, cleaningFee: number, serviceFee: number, totalPrice: number }}
 */
function calculatePriceBreakdown(pricePerNight, nights) {
  const subtotal = pricePerNight * nights
  const cleaningFee = Math.round(subtotal * 0.08)
  const serviceFee = Math.round(subtotal * 0.12)
  const totalPrice = subtotal + cleaningFee + serviceFee

  return { subtotal, cleaningFee, serviceFee, totalPrice }
}

/**
 * Validate booking input before saving to the database.
 * @returns {{ valid: boolean, error?: string }}
 */
function validateBookingInput({ checkIn, checkOut, guests, maxGuests, minNights }) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid check-in or check-out date' }
  }

  if (start < today) {
    return { valid: false, error: 'Check-in date cannot be in the past' }
  }

  if (end <= start) {
    return { valid: false, error: 'Check-out must be after check-in' }
  }

  const nights = calculateNights(start, end)

  if (nights < minNights) {
    return {
      valid: false,
      error: `This listing requires a minimum stay of ${minNights} night(s)`,
    }
  }

  const totalGuests = (guests?.adults || 0) + (guests?.children || 0)

  if (totalGuests < 1) {
    return { valid: false, error: 'At least one guest is required' }
  }

  if (totalGuests > maxGuests) {
    return {
      valid: false,
      error: `This listing allows a maximum of ${maxGuests} guests`,
    }
  }

  return { valid: true, nights }
}

module.exports = {
  calculateNights,
  datesOverlap,
  calculatePriceBreakdown,
  validateBookingInput,
}
