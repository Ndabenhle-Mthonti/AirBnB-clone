/**
 * useSignup.js
 * ------------
 * Handles the signup form → API → save session flow.
 * (Same pattern as useLogin.js)
 */

import { useState } from 'react'
import { USER_SIGNUP_URL } from '../config/api'
import { saveAuthSession } from '../utils/authSession'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useAuthContext()

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

      saveAuthSession(json.token, json.user)
      loginUser(json.user)

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
