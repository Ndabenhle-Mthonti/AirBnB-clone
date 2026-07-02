/**
 * useSignup.js
 * ------------
 * Custom hook that handles signup logic in one place.
 *
 * Beginner notes:
 *  - Hooks let us reuse the same logic in different components.
 *  - signup() calls the backend and updates auth state on success.
 *  - error and isLoading are returned so the page can show messages.
 */

import { useState } from 'react'
import { USER_SIGNUP_URL } from '../config/api'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    if (!email || !password) {
      setError('Email and password are required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(USER_SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error || 'Signup failed')
        setIsLoading(false)
        return false
      }

      // Save the JWT and user so auth survives a page refresh
      localStorage.setItem('token', json.token)
      localStorage.setItem('user', JSON.stringify(json.user))

      // Update the auth context with the logged-in user
      dispatch({ type: 'LOGIN', payload: json.user })

      setIsLoading(false)
      return true
    } catch (err) {
      setError('Could not reach the server. Is the backend running?')
      setIsLoading(false)
      return false
    }
  }

  return { signup, isLoading, error }
}
