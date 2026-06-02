require('dotenv').config()

const express = require('express')
const dns = require('dns')
const mongoose = require('mongoose')
const airbnbRoutes = require('./routes/airbnbs')



const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI

// express app
const app = express()

// Use DNS servers that can resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '1.1.1.1'])
// middleware
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
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

// connect to db
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in backend/.env')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to MongoDB Atlas. Listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
