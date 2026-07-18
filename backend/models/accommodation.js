/**
 * models/accommodation.js
 * -----------------------
 * Defines the shape of an "Accommodation" document in MongoDB.
 * Mongoose uses this schema to validate data before saving.
 *
 * Collection name in MongoDB will be: accommodations (plural, lowercase)
 */

const mongoose = require('mongoose')

// Shortcut for creating a new schema
const Schema = mongoose.Schema

const accommodationSchema = new Schema(
  {
    // Basic listing info
    title: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String },

    // Listing category and room type
    category: {
      type: String,
      enum: ['house', 'apartment', 'cabin', 'villa', 'hotel'],
    },
    type: {
      type: String,
      enum: ['entire place', 'private room', 'shared room'],
    },

    // Images (URLs as strings for beginner simplicity)
    photos: [{ type: String }],
    coverPhoto: { type: String },

    // Pricing
    pricePerNight: { type: Number, required: true },
    currency: { type: String, default: 'USD' },

    // Capacity and rooms
    maxGuests: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    beds: { type: Number, required: true },

    // Extra features
    amenities: [{ type: String }],

    // Nested object for address details
    location: {
      address: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
    },

    // Reviews
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    /** Original Airbnb listing reference (for presentation / demo links) */
    airbnbListingId: { type: String },
    airbnbUrl: { type: String },

    /**
     * host stores a MongoDB ObjectId that points to a User document.
     * For Postman testing, send a valid 24-character hex id, for example:
     * "507f1f77bcf86cd799439011"
     */
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isSuperhost: { type: Boolean, default: false },

    // Booking rules
    isAvailable: { type: Boolean, default: true },
    minNights: { type: Number, default: 1 },
    houseRules: [{ type: String }],
    checkInTime: { type: String },
    checkOutTime: { type: String },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
    },

    tags: [{ type: String }],
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  },
)

// Export the model so controllers can use Accommodation.find(), .create(), etc.
module.exports = mongoose.model('Accommodation', accommodationSchema)
