/**
 * routes/airbnbs.js
 * -----------------
 * Defines URL paths and connects them to controller functions.
 * This file should stay small and easy to read.
 *
 * Base path (set in server.js): /api/airbnbs
 *
 * Endpoints:
 *  GET    /api/airbnbs         -> getAccommodations (public)
 *  GET    /api/airbnbs/cities  -> getCities (public)
 *  GET    /api/airbnbs/:id     -> getAccommodation (public)
 *  POST   /api/airbnbs         -> createAccommodation (auth required)
 *  PATCH  /api/airbnbs/:id     -> updateAccommodation (auth required)
 *  DELETE /api/airbnbs/:id     -> deleteAccommodation (auth required)
 */

const express = require('express')
const {
  getAccommodations,
  getCities,
  getMyAccommodations,
  getAccommodation,
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
} = require('../controllers/airbnbControllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Public browsing routes (specific paths before /:id)
router.get('/cities', getCities)
router.get('/mine', requireAuth, getMyAccommodations)
router.get('/', getAccommodations)
router.get('/:id', getAccommodation)

// Protected routes — require a logged-in user
router.post('/', requireAuth, createAccommodation)
router.patch('/:id', requireAuth, updateAccommodation)
router.delete('/:id', requireAuth, deleteAccommodation)

module.exports = router
