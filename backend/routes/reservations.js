/**
 * routes/reservations.js
 * ----------------------
 * Booking / reservation endpoints.
 *
 * Base path (set in server.js): /api/reservations
 *
 * All routes require authentication (JWT Bearer token).
 *
 * Postman:
 *  GET    /api/reservations
 *  POST   /api/reservations
 *  PATCH  /api/reservations/:id
 *  DELETE /api/reservations/:id
 */

const express = require('express')
const {
  getReservations,
  createReservation,
  cancelReservation,
  deleteReservation,
} = require('../controllers/reservationController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getReservations)
router.post('/', createReservation)
router.patch('/:id', cancelReservation)
router.delete('/:id', deleteReservation)

module.exports = router
