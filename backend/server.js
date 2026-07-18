/**
 * server.js
 * ---------
 * This is the main entry point for the backend API.
 * It:
 *  1. Loads environment variables from .env
 *  2. Connects to MongoDB Atlas
 *  3. Starts the Express server
 *  4. Registers routes (airbnbs + health check)
 */

// Load variables from backend/.env (PORT, MONGO_URI, etc.)
require('dotenv').config()

const express = require('express')
const dns = require('dns')
const mongoose = require('mongoose')
const airbnbRoutes = require('./routes/airbnbs')
const userRoutes = require('./routes/user')
const reservationRoutes = require('./routes/reservations')
const { notFound, errorHandler } = require('./middleware/errorHandler')

// Port number for Postman/local testing (default 4000 if not set in .env)
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI

// Create the Express application
const app = express()

/**
 * DNS fix for MongoDB Atlas (mongodb+srv://...)
 * Some networks cannot resolve Atlas SRV records by default.
 * Using public DNS servers helps the connection succeed.
 */
dns.setServers(['8.8.8.8', '1.1.1.1'])

/**
 * Middleware
 * ----------
 * express.json() lets Express read JSON request bodies from Postman.
 * CORS allows the React app (port 3000) to call this API (port 4000).
 * The logger prints every request path + method in the terminal (useful while learning).
 */
app.use(express.json())

// Allow frontend (React) to fetch data from this backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Browsers send OPTIONS before POST/PATCH/DELETE — answer it quickly
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

/**
 * Routes
 * ------
 * All Airbnb/accommodation endpoints live under /api/airbnbs
 * Health check is useful in Postman to confirm server + DB status.
 */
app.use('/api/airbnbs', airbnbRoutes)
app.use('/api/user', userRoutes)
app.use('/api/reservations', reservationRoutes)

app.get('/api/health', (_req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.status(200).json({
    status: 'ok',
    database: states[mongoose.connection.readyState] || 'unknown',
  })
})

/**
 * Database connection
 * -------------------
 * We only start listening AFTER MongoDB connects successfully.
 * If MONGO_URI is missing or invalid, the app exits with an error message.
 */
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in backend/.env')
  process.exit(1)
}

if (!process.env.SECRET) {
  console.error('Missing SECRET in backend/.env — JWT auth will fail')
  process.exit(1)
}

/** Unknown routes and global errors — consistent JSON responses for Postman */
app.use(notFound)
app.use(errorHandler)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to MongoDB Atlas. Listening on port ${PORT}`)
      console.log(`Postman base URL: http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
