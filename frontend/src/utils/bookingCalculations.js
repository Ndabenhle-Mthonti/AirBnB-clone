/**
 * utils/bookingCalculations.js
 * ----------------------------
 * Price maths for the booking widget on the details page.
 *
 * IMPORTANT: These numbers must match backend/utils/bookingUtils.js
 *  - Cleaning fee = 8% of subtotal
 *  - Service fee = 12% of subtotal
 */

/** How many nights between two dates (YYYY-MM-DD strings) */
export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0
  }

  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffMs = end.getTime() - start.getTime()

  if (diffMs <= 0) {
    return 0
  }

  const oneDayMs = 1000 * 60 * 60 * 24
  return Math.ceil(diffMs / oneDayMs)
}

/**
 * Build the price breakdown shown under the Reserve button.
 * Returns zeros when nights is 0 (no dates selected yet).
 */
export function calculatePriceBreakdown(pricePerNight, nights) {
  if (!nights || nights < 1) {
    return { subtotal: 0, cleaningFee: 0, serviceFee: 0, totalPrice: 0 }
  }

  const subtotal = pricePerNight * nights
  const cleaningFee = Math.round(subtotal * 0.08)
  const serviceFee = Math.round(subtotal * 0.12)
  const totalPrice = subtotal + cleaningFee + serviceFee

  return { subtotal, cleaningFee, serviceFee, totalPrice }
}

/** Show prices like "ZAR 1,200" */
export function formatCurrency(amount, currency = 'ZAR') {
  return `${currency} ${amount.toLocaleString()}`
}
