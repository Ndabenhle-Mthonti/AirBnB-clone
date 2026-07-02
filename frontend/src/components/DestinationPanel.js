/**
 * DestinationPanel.js
 * -------------------
 * Location dropdown for the search bar.
 *
 * Beginner notes:
 *  - "View all locations" shows every accommodation in the database.
 *  - Cities below come from GET /api/airbnbs/cities (only cities with listings).
 *  - Clicking a city opens /accommodations?city=... with filtered results.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CITIES_URL } from '../config/api'
import './DestinationPanel.css'

const DestinationPanel = ({ query, onQueryChange, onClose, onViewAllLocations }) => {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(CITIES_URL)
        const json = await response.json()

        if (response.ok) {
          setCities(json)
        } else {
          setError(json.error || 'Could not load cities')
        }
      } catch (err) {
        setError('Could not reach the server. Is the backend running?')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase()),
  )

  const handleViewAllLocations = () => {
    onViewAllLocations?.()
    onClose?.()
    navigate('/accommodations')
  }

  const handleCitySelect = (city) => {
    onQueryChange(city)
    onClose?.()
    navigate(`/accommodations?city=${encodeURIComponent(city)}`)
  }

  return (
    <div
      className="search-panel destination-panel"
      role="dialog"
      aria-label="Choose destination"
    >
      <input
        className="destination-input"
        type="text"
        value={query}
        placeholder="Search destinations"
        onChange={(event) => onQueryChange(event.target.value)}
      />

      <div className="destination-list">
        <button
          className="destination-list-item destination-list-item--all"
          type="button"
          onClick={handleViewAllLocations}
        >
          View all locations
        </button>

        {isLoading && (
          <p className="destination-status">Loading South African cities...</p>
        )}

        {error && (
          <p className="destination-status destination-status--error">{error}</p>
        )}

        {!isLoading && !error && (
          <>
            <p className="destination-section-title">South African cities</p>

            {filteredCities.map((city) => (
              <button
                key={city}
                className="destination-list-item"
                type="button"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}

            {cities.length === 0 && (
              <p className="destination-status">
                No cities with accommodations yet. Add a listing to see cities here.
              </p>
            )}

            {cities.length > 0 && filteredCities.length === 0 && (
              <p className="destination-status">No cities match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DestinationPanel
