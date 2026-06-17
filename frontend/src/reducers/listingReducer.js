/**
 * listingReducer.js
 * -----------------
 * Manages ALL form data for the multi-step "Add accommodation" wizard.
 *
 * useReducer pattern (beginner explanation):
 *  - state  = current form values (title, price, photos, etc.)
 *  - action = { type: "WHAT_HAPPENED", payload: data }
 *  - reducer = function that returns the NEW state based on the action
 *
 * This file only handles form UI state.
 * When submitting, buildAccommodationPayload() converts this shape
 * into the format your backend/MongoDB expects.
 */

// Starting values when the form first loads
export const initialListingState = {
  // Which step of the wizard we are on (1–10)
  currentStep: 1,

  // Step 1, 6, 7 — title, description, category, type
  basicInfo: {
    title: '',
    description: '',
    // Matches backend field: category (house, apartment, cabin, villa, hotel)
    propertyType: '',
    // Matches backend field: type (entire place, private room, shared room)
    roomType: '',
  },

  // Step 2 — matches backend location object
  location: {
    address: '', // backend uses "address" (not "street")
    city: '',
    state: '', // backend uses "state" (not "province")
    country: '',
    zipCode: '', // kept in form only; backend schema has no zip field
  },

  // Step 3 — "guests" becomes maxGuests when we submit
  capacity: {
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },

  // Step 4 — stored as object here; converted to string[] on submit
  amenities: {
    wifi: false,
    kitchen: false,
    washer: false,
    airConditioning: false,
    heating: false,
    tv: false,
    pool: false,
    parking: false,
    petFriendly: false,
  },

  // Step 5 — array of image URL strings (what MongoDB stores)
  photos: [],
  coverPhotoIndex: 0,

  // Step 8 — pricePerNight and currency match backend
  pricing: {
    pricePerNight: '',
    currency: 'ZAR',
  },

  // Step 9 — minNights matches backend; other fields are form-only for now
  availability: {
    minNights: 1,
    maxNights: 365,
    advanceNotice: 0,
  },

  // Step 9 — check-in/out and rules; some map to backend on submit
  rules: {
    checkInTime: '15:00',
    checkOutTime: '11:00',
    petsAllowed: false,
    smokingAllowed: false,
    partiesAllowed: false,
    customRules: '',
  },

  // Matches backend enum: flexible | moderate | strict
  cancellationPolicy: 'flexible',

  // Form status (not sent to backend)
  meta: {
    isDraft: true,
    lastSaved: null,
    hasUnsavedChanges: false,
    isSubmitting: false,
    submitError: null,
    submitSuccess: false,
    listingId: null,
  },

  errors: {},
}

/**
 * Reducer function — called by dispatch({ type, payload })
 */
export function listingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'UPDATE_LOCATION':
      return {
        ...state,
        location: { ...state.location, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'UPDATE_CAPACITY':
      return {
        ...state,
        capacity: { ...state.capacity, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'TOGGLE_AMENITY':
      return {
        ...state,
        amenities: {
          ...state.amenities,
          [action.payload]: !state.amenities[action.payload],
        },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

  // payload is a URL string like "https://images.unsplash.com/..."
    case 'ADD_PHOTO':
      return {
        ...state,
        photos: [...state.photos, action.payload],
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'REMOVE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter((_, i) => i !== action.payload),
        coverPhotoIndex:
          state.coverPhotoIndex >= action.payload
            ? Math.max(0, state.coverPhotoIndex - 1)
            : state.coverPhotoIndex,
      }

    case 'SET_COVER_PHOTO':
      return { ...state, coverPhotoIndex: action.payload }

    case 'UPDATE_PRICING':
      return {
        ...state,
        pricing: { ...state.pricing, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'UPDATE_AVAILABILITY':
      return {
        ...state,
        availability: { ...state.availability, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'UPDATE_RULES':
      return {
        ...state,
        rules: { ...state.rules, ...action.payload },
        meta: { ...state.meta, hasUnsavedChanges: true },
      }

    case 'SET_CANCELLATION_POLICY':
      return { ...state, cancellationPolicy: action.payload }

    case 'SET_ERRORS':
      return { ...state, errors: action.payload }

    case 'SET_SUBMITTING':
      return {
        ...state,
        meta: { ...state.meta, isSubmitting: action.payload },
      }

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        meta: {
          ...state.meta,
          isSubmitting: false,
          submitSuccess: true,
          listingId: action.payload,
          isDraft: false,
        },
      }

    case 'SUBMIT_ERROR':
      return {
        ...state,
        meta: {
          ...state.meta,
          isSubmitting: false,
          submitError: action.payload,
        },
      }

    case 'SAVE_DRAFT':
      return {
        ...state,
        meta: {
          ...state.meta,
          isDraft: true,
          lastSaved: new Date().toISOString(),
          hasUnsavedChanges: false,
        },
      }

    case 'RESET':
      return initialListingState

    default:
      return state
  }
}
