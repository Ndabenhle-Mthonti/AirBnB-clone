/**
 * controllers/airbnbControllers.js
 * --------------------------------
 * Contains the logic for each API endpoint.
 * Routes file only maps URLs to these functions.
 *
 * Pattern:
 *  - Read data from req (params, body)
 *  - Talk to MongoDB using the Accommodation model
 *  - Send a JSON response with res.status(...).json(...)
 */

const mongoose = require('mongoose')
const Accommodation = require('../models/accommodation')

/**
 * GET /api/airbnbs
 * Return all accommodations, newest first.
 * Optional query: ?city=Cape Town (case-insensitive match on location.city)
 */
const getAccommodations = async (req, res) => {
  try {
    const { city } = req.query
    const filter = {}

    if (city) {
      filter['location.city'] = { $regex: new RegExp(`^${city.trim()}$`, 'i') }
    }

    const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 })
    res.status(200).json(accommodations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * GET /api/airbnbs/cities
 * Return a sorted list of distinct cities that have accommodations.
 */
const getCities = async (req, res) => {
  try {
    const cities = await Accommodation.distinct('location.city')
    const sortedCities = cities.filter(Boolean).sort((a, b) => a.localeCompare(b))

    res.status(200).json(sortedCities)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * GET /api/airbnbs/:id
 * Return one accommodation by MongoDB _id.
 */
const getAccommodation = async (req, res) => {
  const { id } = req.params

  // Check id format before querying the database
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  try {
    const accommodation = await Accommodation.findById(id)

    if (!accommodation) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    res.status(200).json(accommodation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * GET /api/airbnbs/mine
 * Return listings owned by the logged-in host (admin "View listings" page).
 */
const getMyAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    })
    res.status(200).json(accommodations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * POST /api/airbnbs
 * Create a new accommodation from req.body (JSON sent from Postman).
 * host and user_id always come from the JWT — never from the request body.
 */
const createAccommodation = async (req, res) => {
  try {
    const { host, user_id, ...safeBody } = req.body
    const accommodation = await Accommodation.create({
      ...safeBody,
      host: req.user._id,
      user_id: req.user._id,
    })
    res.status(201).json(accommodation)
  } catch (error) {
    // 400 usually means validation failed (missing required fields, etc.)
    res.status(400).json({ error: error.message })
  }
}

/**
 * DELETE /api/airbnbs/:id
 * Remove one accommodation from the database.
 * Only the host who created the listing may delete it.
 */
const deleteAccommodation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  try {
    const accommodation = await Accommodation.findById(id)

    if (!accommodation) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    if (!accommodation.user_id.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' })
    }

    await accommodation.deleteOne()
    res.status(200).json({ message: 'Listing deleted', _id: id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * PATCH /api/airbnbs/:id
 * Update only the fields you send in req.body.
 * Only the host who owns the listing may update it.
 */
const updateAccommodation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  try {
    const existing = await Accommodation.findById(id)

    if (!existing) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    if (!existing.user_id.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to update this listing' })
    }

    const { host, user_id, ...safeBody } = req.body

    const accommodation = await Accommodation.findOneAndUpdate(
      { _id: id },
      safeBody,
      { new: true, runValidators: true },
    )

    res.status(200).json(accommodation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAccommodations,
  getCities,
  getMyAccommodations,
  getAccommodation,
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
}
