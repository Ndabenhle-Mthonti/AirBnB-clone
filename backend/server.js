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
 * The logger prints every request path + method in the terminal (useful while learning).
 */
app.use(express.json())
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
