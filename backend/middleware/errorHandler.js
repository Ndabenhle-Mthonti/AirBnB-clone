/**
 * middleware/errorHandler.js
 * --------------------------
 * Central error handler for Express.
 * Catches errors passed via next(error) and returns a consistent JSON shape.
 */

const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.stack || error.message)

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    error: error.message || 'Internal server error',
  })
}

module.exports = { notFound, errorHandler }
