/**
 * controllers/reservationController.js
 * ------------------------------------
 * Handles booking (reservation) CRUD operations.
 *
 * Endpoints:
 *  GET    /api/reservations       → current user's reservations
 *  POST   /api/reservations       → create a new booking
 *  PATCH  /api/reservations/:id   → cancel a booking (guest only)
 *  DELETE /api/reservations/:id   → delete a cancelled booking
 */

const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const Accommodation = require('../models/accommodation')
const {
  calculatePriceBreakdown,
  datesOverlap,
  validateBookingInput,
} = require('../utils/bookingUtils')

/**
 * GET /api/reservations
 * Return all reservations for the logged-in user, newest first.
 */
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ guest: req.user._id })
      .sort({ createdAt: -1 })
      .populate('accommodation', 'title coverPhoto location pricePerNight currency')

    res.status(200).json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * POST /api/reservations
 * Create a booking for an accommodation.
 *
 * Body example (Postman):
 * {
 *   "accommodationId": "...",
 *   "checkIn": "2026-08-01",
 *   "checkOut": "2026-08-05",
 *   "guests": { "adults": 2, "children": 0, "infants": 0 }
 * }
 */
const createReservation = async (req, res) => {
  const { accommodationId, checkIn, checkOut, guests } = req.body

  if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
    return res.status(400).json({ error: 'Valid accommodationId is required' })
  }

  try {
    const accommodation = await Accommodation.findById(accommodationId)

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation not found' })
    }

    if (!accommodation.isAvailable) {
      return res.status(400).json({ error: 'This accommodation is not available' })
    }

    const validation = validateBookingInput({
      checkIn,
      checkOut,
      guests,
      maxGuests: accommodation.maxGuests,
      minNights: accommodation.minNights || 1,
    })

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const nights = validation.nights

    /** Block overlapping confirmed bookings for the same listing */
    const existingBookings = await Reservation.find({
      accommodation: accommodationId,
      status: 'confirmed',
    })

    const hasOverlap = existingBookings.some((booking) =>
      datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
    )

    if (hasOverlap) {
      return res.status(409).json({
        error: 'These dates are already booked. Please choose different dates.',
      })
    }

    const { subtotal, cleaningFee, serviceFee, totalPrice } = calculatePriceBreakdown(
      accommodation.pricePerNight,
      nights,
    )

    const reservation = await Reservation.create({
      guest: req.user._id,
      accommodation: accommodation._id,
      accommodationTitle: accommodation.title,
      city: accommodation.location?.city,
      checkIn,
      checkOut,
      nights,
      guests: {
        adults: guests?.adults || 1,
        children: guests?.children || 0,
        infants: guests?.infants || 0,
      },
      pricePerNight: accommodation.pricePerNight,
      currency: accommodation.currency || 'ZAR',
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice,
      status: 'confirmed',
    })

    res.status(201).json(reservation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

/**
 * PATCH /api/reservations/:id
 * Cancel a reservation (only the guest who booked it).
 */
const cancelReservation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such reservation' })
  }

  try {
    const reservation = await Reservation.findById(id)

    if (!reservation) {
      return res.status(404).json({ error: 'No such reservation' })
    }

    if (!reservation.guest.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' })
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Reservation is already cancelled' })
    }

    reservation.status = 'cancelled'
    await reservation.save()

    res.status(200).json(reservation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * DELETE /api/reservations/:id
 * Permanently remove a cancelled reservation from the database.
 */
const deleteReservation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such reservation' })
  }

  try {
    const reservation = await Reservation.findById(id)

    if (!reservation) {
      return res.status(404).json({ error: 'No such reservation' })
    }

    if (!reservation.guest.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this reservation' })
    }

    await reservation.deleteOne()
    res.status(200).json({ message: 'Reservation deleted', _id: id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getReservations,
  createReservation,
  cancelReservation,
  deleteReservation,
}
