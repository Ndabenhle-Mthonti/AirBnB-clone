/**
 * AccommodationContext.js
 * -----------------------
 * Shares accommodation data across the React app.
 *
 * Used when creating a new listing (ADD_ACCOMMODATION after POST).
 * Browsing listings happens on AccommodationsPage via its own fetch.
 */

import { createContext, useReducer } from 'react'

export const AccommodationContext = createContext(null)

const initialState = {
  accommodations: [],
  searchParams: null,
  error: null,
}

function accommodationReducer(state, action) {
  switch (action.type) {
    case 'SET_ACCOMMODATIONS':
      return {
        ...state,
        accommodations: action.payload,
        error: null,
      }

    case 'ADD_ACCOMMODATION':
      return {
        ...state,
        accommodations: [action.payload, ...(state.accommodations || [])],
        error: null,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }

    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: action.payload,
      }

    default:
      return state
  }
}

export function AccommodationContextProvider({ children }) {
  const [state, dispatch] = useReducer(accommodationReducer, initialState)

  return (
    <AccommodationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AccommodationContext.Provider>
  )
}
