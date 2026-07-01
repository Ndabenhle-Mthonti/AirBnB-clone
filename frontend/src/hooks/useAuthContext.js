import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuthContext() {
  const context = useContext(AuthContext)

  // Helpful error if a component uses this hook outside the Provider
  if (!context) {
    throw new Error(
      'useAuthContext must be used inside AuthContextProvider',
    )
  }

  return context
}