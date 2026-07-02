/**
 * AuthContext.js
 * --------------
 * Shares the logged-in user across the app.
 * Restores the user from localStorage when the page reloads.
 */

import { createContext, useReducer } from 'react'

export const AuthContext = createContext()

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: getStoredUser(),
  })

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
