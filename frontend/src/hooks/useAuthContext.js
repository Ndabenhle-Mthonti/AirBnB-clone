/**
 * useAuthContext.js
 * -----------------
 * Shortcut to read auth data in any component.
 *
 * Returns:
 *  - user        → logged-in user object, or null
 *  - loginUser() → call after login/signup
 *  - logoutUser() → call when user logs out
 */

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used inside AuthContextProvider')
  }

  return context
}
