/**
 * useAccommodationContext.js
 * ----------------------------
 * Custom hook to read accommodation data from AccommodationContext.
 *
 * Usage in any component:
 *   const { accommodations, error, dispatch } = useAccommodationContext()
 */

import { useContext } from 'react'
import { AccommodationContext } from '../context/AccommodationContext'

export function useAccommodationContext() {
  const context = useContext(AccommodationContext)

  // Helpful error if a component uses this hook outside the Provider
  if (!context) {
    throw new Error(
      'useAccommodationContext must be used inside AccommodationContextProvider',
    )
  }

  return context
}
