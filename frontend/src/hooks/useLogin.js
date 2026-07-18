/**
 * useLogin.js
 * -----------
 * Handles the login form → API → save session flow.
 */

import { useState } from 'react'
import { USER_LOGIN_URL } from '../config/api'
import { saveAuthSession } from '../utils/authSession'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useAuthContext()

  const login = async (email, password) => {
    if (!email || !password) {
      setError('Email and password are required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(USER_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error || 'Login failed')
        setIsLoading(false)
        return false
      }

      // Step 1: save to localStorage  |  Step 2: update React state
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

  return { login, isLoading, error }
}
