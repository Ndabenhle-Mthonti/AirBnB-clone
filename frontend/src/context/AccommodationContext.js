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
 *  1. Provider fetches GET /api/airbnbs when app loads
 *  2. Home reads accommodations from context
 *  3. Form dispatches ADD_ACCOMMODATION after successful POST
 */

import { createContext, useReducer, useEffect } from 'react'
import { API_URL } from '../config/api'

// Create the context object (empty until Provider wraps the app)
export const AccommodationContext = createContext(null)

// Starting state before data is loaded from the backend
const initialState = {
  accommodations: null, // null = still loading, [] = empty, array = has data
  searchParams: null,
  error: null,
}

/**
 * Reducer — updates accommodation list based on actions
 */
function accommodationReducer(state, action) {
  switch (action.type) {
    // Replace entire list (used after GET /api/airbnbs)
    case 'SET_ACCOMMODATIONS':
      return {
        ...state,
        accommodations: action.payload,
        error: null,
      }

    // Add one new listing to the top (used after POST /api/airbnbs)
    case 'ADD_ACCOMMODATION':
      return {
        ...state,
        accommodations: [action.payload, ...(state.accommodations || [])],
        error: null,
      }

    // Store an error message to show on the Home page
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }

    // Store values selected from the navbar search bar
    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: action.payload,
      }

    default:
      return state
  }
}

/**
 * Provider component — wrap App with this in index.js or App.js
 */
export function AccommodationContextProvider({ children }) {
  const [state, dispatch] = useReducer(accommodationReducer, initialState)

  /**
   * Fetch all accommodations from the backend once when the app starts.
   * useEffect with [] runs only on first render.
   */
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(API_URL)
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
  }, [])

  // value is what child components receive via useAccommodationContext()
  return (
    <AccommodationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AccommodationContext.Provider>
  )
}
