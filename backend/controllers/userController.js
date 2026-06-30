/**
 * controllers/userController.js
 * -----------------------------
 * Handles simple user signup and login requests.
 *
 * These endpoints are beginner-friendly and easy to test in Postman.
 * Passwords are hashed with bcrypt before they are saved.
 */

const bcrypt = require('bcrypt')
const User = require('../models/userModel')

// Higher number = stronger hash, but slower. 10 is common for beginner projects.
const SALT_ROUNDS = 10

// POST /api/user/signup
const signupUser = async (req, res) => {
  const { email, password } = req.body

  // Basic validation so Postman gets a clear error message
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' })
    }

    // Hash the password before saving it. Never save plain text passwords.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await User.create({ email, password: hashedPassword })

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/user/login
const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // bcrypt.compare checks the plain password against the saved hash.
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { signupUser, loginUser }