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
 */
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({}).sort({ createdAt: -1 })
    res.status(200).json(accommodations)
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
 * POST /api/airbnbs
 * Create a new accommodation from req.body (JSON sent from Postman).
 */
const createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body)
    res.status(201).json(accommodation)
  } catch (error) {
    // 400 usually means validation failed (missing required fields, etc.)
    res.status(400).json({ error: error.message })
  }
}

/**
 * DELETE /api/airbnbs/:id
 * Remove one accommodation from the database.
 */
const deleteAccommodation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  try {
    const accommodation = await Accommodation.findOneAndDelete({ _id: id })

    if (!accommodation) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    res.status(200).json(accommodation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * PATCH /api/airbnbs/:id
 * Update only the fields you send in req.body.
 */
const updateAccommodation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  try {
    const accommodation = await Accommodation.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true },
    )

    if (!accommodation) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    res.status(200).json(accommodation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
}
