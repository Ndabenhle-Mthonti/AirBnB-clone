const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accommodationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String },
  category: { type: String, enum: ['house', 'apartment', 'cabin', 'villa', 'hotel'] },
  type: { type: String, enum: ['entire place', 'private room', 'shared room'] },

  photos: [{ type: String }],
  coverPhoto: { type: String },

  pricePerNight: { type: Number, required: true },
  currency: { type: String, default: 'USD' },

  maxGuests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  beds: { type: Number, required: true },

  amenities: [{ type: String }],
  

  location: {
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    
  },

  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isSuperhost: { type: Boolean, default: false },

  isAvailable: { type: Boolean, default: true },
  minNights: { type: Number, default: 1 },

  houseRules: [{ type: String }],
  checkInTime: { type: String },
  checkOutTime: { type: String },
  cancellationPolicy: { type: String, enum: ['flexible', 'moderate', 'strict'] },

  tags: [{ type: String }],
  
}, { timestamps: true }) // auto adds createdAt & updatedAt

module.exports = mongoose.model('Accommodation', accommodationSchema)
