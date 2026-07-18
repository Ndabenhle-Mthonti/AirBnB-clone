/**
 * config/api.js
 * -------------
 * API URLs — must match backend routes (see routes/ in backend).
 *
 * Postman equivalents:
 *  GET    /api/airbnbs              → all accommodations
 *  GET    /api/airbnbs?city=X       → accommodations in one city
 *  GET    /api/airbnbs/cities       → distinct cities with listings
 *  GET    /api/airbnbs/:id          → single accommodation (details page)
 *  GET    /api/airbnbs/mine         → host's own listings (auth)
 *  POST   /api/airbnbs              → create listing (auth)
 *  PATCH  /api/airbnbs/:id          → update listing (auth)
 *  DELETE /api/airbnbs/:id          → delete listing (auth)
 *  GET    /api/reservations         → user's bookings (auth)
 *  POST   /api/reservations         → create booking (auth)
 *  PATCH  /api/reservations/:id     → cancel booking (auth)
 */
export const API_URL = '/api/airbnbs'
export const CITIES_URL = '/api/airbnbs/cities'
export const MY_LISTINGS_URL = '/api/airbnbs/mine'
export const RESERVATIONS_URL = '/api/reservations'
export const HEALTH_URL = '/api/health'
export const USER_SIGNUP_URL = '/api/user/signup'
export const USER_LOGIN_URL = '/api/user/login'
export const USER_ME_URL = '/api/user/me'

/** Build the same URL the accommodations page uses */
export function getAccommodationsUrl(city) {
  if (!city) {
    return API_URL
  }

  return `${API_URL}?city=${encodeURIComponent(city)}`
}

/** Single listing for the details page */
export function getAccommodationUrl(id) {
  return `${API_URL}/${id}`
}
