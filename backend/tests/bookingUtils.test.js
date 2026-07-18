/**
 * tests/bookingUtils.test.js
 * --------------------------
 * Unit tests for booking helper functions (no database required).
 * Run: npm test
 */

const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  calculateNights,
  datesOverlap,
  calculatePriceBreakdown,
  validateBookingInput,
} = require('../utils/bookingUtils')

test('calculateNights returns correct night count', () => {
  assert.equal(calculateNights('2026-08-01', '2026-08-05'), 4)
})

test('datesOverlap detects overlapping ranges', () => {
  assert.equal(
    datesOverlap('2026-08-01', '2026-08-05', '2026-08-03', '2026-08-07'),
    true,
  )
  assert.equal(
    datesOverlap('2026-08-01', '2026-08-05', '2026-08-05', '2026-08-10'),
    false,
  )
})

test('calculatePriceBreakdown includes fees', () => {
  const result = calculatePriceBreakdown(1000, 3)
  assert.equal(result.subtotal, 3000)
  assert.equal(result.totalPrice, result.subtotal + result.cleaningFee + result.serviceFee)
})

test('validateBookingInput rejects too many guests', () => {
  const result = validateBookingInput({
    checkIn: '2030-01-10',
    checkOut: '2030-01-12',
    guests: { adults: 5, children: 0 },
    maxGuests: 2,
    minNights: 1,
  })
  assert.equal(result.valid, false)
})
