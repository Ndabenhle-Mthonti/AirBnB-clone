/**
 * AccommodationContext.js
 * -----------------------
 * Shares accommodation data across the whole React app.
 *
 * Why use Context?
 *  - Home page needs the list of accommodations (GET)
 *  - Add form needs to update the list after creating one (POST)
 *  - Context lets both pages use the same data without prop drilling
 *
 * Data flow:
 *  1. Provider fetches GET /api/airbnbs when a user is logged in
 *  2. Home reads accommodations from context
 *  3. Form dispatches ADD_ACCOMMODATION after successful POST
 */

import { createContext, useReducer, useEffect } from 'react'
import { API_URL } from '../config/api'
import { useAuthContext } from '../hooks/useAuthContext'
import { getAuthHeaders } from '../utils/authHeaders'

export const AccommodationContext = createContext(null)

const initialState = {
  accommodations: null,
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

    case 'CLEAR_ACCOMMODATIONS':
      return {
        ...state,
        accommodations: [],
        error: action.payload,
      }

    default:
      return state
  }
}

export function AccommodationContextProvider({ children }) {
  const [state, dispatch] = useReducer(accommodationReducer, initialState)
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user) {
      dispatch({
        type: 'CLEAR_ACCOMMODATIONS',
        payload: 'Please log in to view accommodations.',
      })
      return
    }

    const fetchAccommodations = async () => {
      dispatch({ type: 'SET_ACCOMMODATIONS', payload: null })

      try {
        const response = await fetch(API_URL, {
          headers: getAuthHeaders(),
        })
        const json = await response.json()

        if (response.ok) {
          dispatch({ type: 'SET_ACCOMMODATIONS', payload: json })
        } else {
          dispatch({
            type: 'SET_ERROR',
            payload: json.error || 'Failed to fetch accommodations',
          })
        }
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            'Could not connect to the server. Is the backend running on port 4000?',
        })
      }
    }

    fetchAccommodations()
  }, [user])

  return (
    <AccommodationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AccommodationContext.Provider>
  )
}
