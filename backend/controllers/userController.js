/**
 * controllers/userController.js
 * -----------------------------
 * Handles simple user signup and login requests.
 *
 * These endpoints are beginner-friendly and easy to test in Postman.
 * Passwords are hashed with bcrypt before they are saved.
 * Successful signup/login returns a JWT signed with jsonwebtoken.
 * validator checks that emails and passwords have the right format.
 */

const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// Higher number = stronger hash, but slower. 10 is common for beginner projects.
const SALT_ROUNDS = 10

/**
 * Password rule used by validator.isStrongPassword().
 * This requires:
 *  - at least 8 characters
 *  - at least 1 lowercase letter
 *  - at least 1 uppercase letter
 *  - at least 1 number
 *  - at least 1 symbol, for example ! @ # $
 */
const PASSWORD_RULES = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}

// POST /api/user/signup
const signupUser = async (req, res) => {
  const { email, password } = req.body

  // Basic validation so Postman gets a clear error message
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }

  if (!validator.isStrongPassword(password, PASSWORD_RULES)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol',
    })
  }

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' })
    }

    // Hash the password before saving it. Never save plain text passwords.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await User.create({ email, password: hashedPassword })
    const token = createToken(user._id)

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
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

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
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

    const token = createToken(user._id)

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * GET /api/user/me
 * Validates the JWT and returns the current user (used on page refresh).
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('_id email')

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' })
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { signupUser, loginUser, getMe }