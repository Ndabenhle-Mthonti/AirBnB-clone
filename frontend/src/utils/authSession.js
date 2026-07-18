/**
 * utils/authSession.js
 * --------------------
 * All login/logout helpers in ONE place (beginner-friendly).
 *
 * How auth works in this project:
 *  1. User logs in → backend returns { token, user }
 *  2. We save both in localStorage (survives page refresh)
 *  3. Protected API calls send: Authorization: Bearer <token>
 *  4. AuthContext shares the logged-in user with React components
 */

/** Save token + user after login or signup */
export function saveAuthSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

/** Read JWT — returns null if missing */
export function getStoredToken() {
  const token = localStorage.getItem('token')

  if (!token || token === 'undefined' || token === 'null') {
    return null
  }

  return token.trim()
}

/** Read saved user — only returns data when a token also exists */
export function getStoredUser() {
  const token = getStoredToken()
  const storedUser = localStorage.getItem('user')

  if (!token || !storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    return null
  }
}

/** Remove login data (logout or expired session) */
export function clearAuthSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/** Headers for protected routes — used by fetch() in forms and booking */
export function getAuthHeaders() {
  const token = getStoredToken()

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

/** True when user has a token (needed before booking) */
export function hasAuthToken() {
  return Boolean(getStoredToken())
}
