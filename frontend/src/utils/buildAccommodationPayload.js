/**
 * buildAccommodationPayload.js
 * ------------------------------
 * Converts the form state (listingReducer shape) into the JSON body
 * that POST /api/airbnbs expects — matching backend/models/accommodation.js
 *
 * Form state and database schema use different field names on purpose:
 * this file is the "translator" between them.
 */

// Fallback host id only used if no logged-in user id is passed in
const DEFAULT_HOST_ID = '507f1f77bcf86cd799439011'

/**
 * Turn amenities object { wifi: true, pool: false } into ["wifi"]
 */
function amenitiesToArray(amenitiesObject) {
  return Object.entries(amenitiesObject)
    .filter(([, isSelected]) => isSelected)
    .map(([name]) => name)
}

/**
 * Build houseRules array from checkbox rules + custom text
 */
function buildHouseRules(rules) {
  const houseRules = []

  if (rules.petsAllowed) houseRules.push('Pets allowed')
  if (rules.smokingAllowed) houseRules.push('Smoking allowed')
  if (rules.partiesAllowed) houseRules.push('Parties allowed')

  if (rules.customRules.trim()) {
    houseRules.push(rules.customRules.trim())
  }

  return houseRules
}

/**
 * Main export — call this right before fetch() in AccommodationForm.
 * hostId should be the logged-in user's id from auth context.
 */
export function buildAccommodationPayload(formState, hostId) {
  const coverPhoto =
    formState.photos[formState.coverPhotoIndex] || formState.photos[0] || ''

  return {
    // Required backend fields
    title: formState.basicInfo.title,
    description: formState.basicInfo.description,
    category: formState.basicInfo.propertyType,
    type: formState.basicInfo.roomType,

    photos: formState.photos,
    coverPhoto,

    pricePerNight: Number(formState.pricing.pricePerNight),
    currency: formState.pricing.currency,

    maxGuests: formState.capacity.guests,
    bedrooms: formState.capacity.bedrooms,
    bathrooms: formState.capacity.bathrooms,
    beds: formState.capacity.beds,

    amenities: amenitiesToArray(formState.amenities),

    location: {
      address: formState.location.address,
      city: formState.location.city,
      state: formState.location.state,
      country: formState.location.country,
    },

    host: hostId || DEFAULT_HOST_ID,

    minNights: Number(formState.availability.minNights),
    checkInTime: formState.rules.checkInTime,
    checkOutTime: formState.rules.checkOutTime,
    houseRules: buildHouseRules(formState.rules),
    cancellationPolicy: formState.cancellationPolicy,
  }
}

/**
 * Simple client-side checks before calling the API
 */
export function validateListingForm(formState) {
  const errors = {}

  if (!formState.basicInfo.roomType) errors.roomType = 'Choose a room type'
  if (!formState.basicInfo.propertyType) errors.propertyType = 'Choose a property type'
  if (!formState.location.city.trim()) errors.city = 'City is required'
  if (!formState.location.country.trim()) errors.country = 'Country is required'
  if (!formState.basicInfo.title.trim()) errors.title = 'Title is required'
  if (!formState.basicInfo.description.trim()) errors.description = 'Description is required'
  if (!formState.pricing.pricePerNight || Number(formState.pricing.pricePerNight) <= 0) {
    errors.pricePerNight = 'Enter a valid price per night'
  }
  if (formState.photos.length === 0) {
    errors.photos = 'Add at least one image URL'
  }

  return errors
}
