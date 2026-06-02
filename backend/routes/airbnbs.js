const express = require('express')
const mongoose = require('mongoose')
const Accommodation = require('../models/accommodation')

const router = express.Router()

// get all accommodations
router.get('/', async (req, res) => {
  try {
    const accommodations = await Accommodation.find({}).sort({ createdAt: -1 })
    res.status(200).json(accommodations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// get a single accommodation
router.get('/:id', async (req, res) => {
  const { id } = req.params

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
})

// create a new accommodation
router.post('/', async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body)
    res.status(201).json(accommodation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// delete accommodation
router.delete('/:id', async (req, res) => {
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
})

// update accommodation
router.patch('/:id', async (req, res) => {
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
})

module.exports = router