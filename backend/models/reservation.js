/**
 * models/reservation.js
 * ---------------------
 * Defines a booking/reservation document in MongoDB.
 *
 * Each reservation links:
 *  - guest (user who booked)
 *  - accommodation (the listing)
 *  - check-in / check-out dates
 *  - guest count and calculated total price
 *
 * Used by POST /api/reservations and GET /api/reservations.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reservationSchema = new Schema(
  {
    /** Guest who made the booking (logged-in user) */
    guest: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /** The accommodation being booked */
    accommodation: {
      type: Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true,
    },

    /** Snapshot of listing title for display in "My reservations" */
    accommodationTitle: { type: String, required: true },

    /** City snapshot for quick filtering in the UI */
    city: { type: String },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    /** Number of nights (stored for reporting and price breakdown) */
    nights: { type: Number, required: true, min: 1 },

    guests: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
    },

    /** Price per night at time of booking (snapshot) */
    pricePerNight: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' },

    /** Cost breakdown stored for the reservation receipt */
    subtotal: { type: Number, required: true },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true },
)

/** Prevent double-booking queries: find overlapping dates for one listing */
reservationSchema.index({ accommodation: 1, checkIn: 1, checkOut: 1 })

module.exports = mongoose.model('Reservation', reservationSchema)
