/**
 * routes/user.js
 * --------------
 * User authentication routes.
 *
 *  POST /api/user/signup  → create account
 *  POST /api/user/login   → log in, receive JWT
 *  GET  /api/user/me      → validate JWT (protected)
 */

const express = require('express')
const { signupUser, loginUser, getMe } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.get('/me', requireAuth, getMe)

module.exports = router
