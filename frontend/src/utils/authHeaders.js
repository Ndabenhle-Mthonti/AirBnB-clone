/**
 * authHeaders.js
 * --------------
 * Builds request headers for protected backend routes.
 *
 * Beginner notes:
 *  - The backend requireAuth middleware expects: Authorization: Bearer <token>
 *  - We read the token from localStorage (saved on login/signup).
 */

export function getAuthHeaders() {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}
