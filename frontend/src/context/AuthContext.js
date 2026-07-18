/**
 * AuthContext.js
 * --------------
 * Shares the logged-in user with the whole React app.
 *
 * Beginner notes:
 *  - useState(user) holds who is logged in (or null)
 *  - loginUser() and logoutUser() are called after login/signup/logout
 *  - On page load we check localStorage and verify the token with the API
 */

import { createContext, useEffect, useState } from 'react'
import {
  clearAuthSession,
  getAuthHeaders,
  getStoredUser,
} from '../utils/authSession'
import { USER_ME_URL } from '../config/api'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  // Start with user from localStorage (if they logged in before)
  const [user, setUser] = useState(getStoredUser())

  /** Call after successful login or signup */
  const loginUser = (userData) => {
    setUser(userData)
  }

  /** Call when user clicks Log out */
  const logoutUser = () => {
    clearAuthSession()
    setUser(null)
  }

  /**
   * When the app first loads, ask the backend if the saved token is still valid.
   * If expired (401), clear localStorage so the user must log in again.
   */
  useEffect(() => {
    const checkTokenOnLoad = async () => {
      if (!getStoredUser()) {
        logoutUser()
        return
      }

      try {
        const response = await fetch(USER_ME_URL, {
          headers: getAuthHeaders(),
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.user)
        } else if (response.status === 401) {
          logoutUser()
        }
      } catch (error) {
        // Server offline — keep cached login so the app still works locally
      }
    }

    checkTokenOnLoad()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
