/**
 * routes/airbnbs.js
 * -----------------
 * Defines URL paths and connects them to controller functions.
 * This file should stay small and easy to read.
 *
 * Base path (set in server.js): /api/airbnbs
 *
 * Endpoints:
 *  GET    /api/airbnbs       -> getAccommodations
 *  GET    /api/airbnbs/:id   -> getAccommodation
 *  POST   /api/airbnbs       -> createAccommodation
 *  PATCH  /api/airbnbs/:id   -> updateAccommodation
 *  DELETE /api/airbnbs/:id   -> deleteAccommodation
 */

const express = require('express')
const {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
} = require('../controllers/airbnbControllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
//require auth for all accommodation routes
router.use(requireAuth)

router.get('/', getAccommodations)
router.get('/:id', getAccommodation)
router.post('/', createAccommodation)
router.delete('/:id', deleteAccommodation)
router.patch('/:id', updateAccommodation)

module.exports = router
