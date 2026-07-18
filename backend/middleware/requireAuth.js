/**
 * middleware/requireAuth.js
 * -------------------------
 * Protects routes that need a logged-in user.
 *
 * Expects header: Authorization: Bearer <jwt>
 * On success, attaches req.user so controllers know who made the request.
 */

const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(_id).select('_id email')

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' })
    }

    return res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = requireAuth
