/**
 * seedListings.js
 * ---------------
 * Seeds the database with real South African Airbnb listings.
 *
 * Run: npm run seed
 *
 * Data source: backend/data/airbnbListings.js (from airbnb.co.za links)
 
 */

require('dotenv').config()

const dns = require('dns')
const mongoose = require('mongoose')

dns.setServers(['8.8.8.8', '1.1.1.1'])

const Accommodation = require('./models/accommodation')
const User = require('./models/userModel')
const LISTINGS = require('./data/airbnbListings')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  const host =
    (await User.findOne({ email: 'seed-host@example.com' })) || (await User.findOne())

  if (!host) {
    throw new Error('No user found. Sign up once in the app or Postman first.')
  }

  /** Remove old placeholder listings so only real Airbnb data remains */
  const removed = await Accommodation.deleteMany({
    airbnbListingId: { $exists: false },
  })

  let created = 0
  let updated = 0

  // Loop through each real Airbnb listing and save to MongoDB
  for (const listing of LISTINGS) {
    const existing = await Accommodation.findOne({
      airbnbListingId: listing.airbnbListingId,
    })

    if (existing) {
      await Accommodation.findByIdAndUpdate(
        existing._id,
        { ...listing, host: host._id, user_id: host._id },
        { runValidators: true },
      )
      updated += 1
      console.log(`Updated: ${listing.title} (${listing.location.city})`)
      continue
    }

    await Accommodation.create({
      ...listing,
      host: host._id,
      user_id: host._id,
    })
    created += 1
    console.log(`Created: ${listing.title} (${listing.location.city})`)
  }

  const cities = await Accommodation.distinct('location.city')
  const total = await Accommodation.countDocuments()

  console.log(`\nRemoved ${removed.deletedCount} old placeholder listing(s).`)
  console.log(`Created ${created}, updated ${updated}. Total in DB: ${total}`)
  console.log('Cities:', cities.sort().join(', '))

  await mongoose.disconnect()
}

seed().catch(async (error) => {
  console.error(error.message)
  await mongoose.disconnect()
  process.exit(1)
})
