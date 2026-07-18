/**
 * CityFilter.js
 * -------------
 * Dropdown filter on the accommodations page (rubric: functional filter).
 * Loads cities from GET /api/airbnbs/cities and updates the URL ?city= param.
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CITIES_URL } from '../../config/api'
import './CityFilter.css'

const CityFilter = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentCity = searchParams.get('city') || ''

  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(CITIES_URL)
        const json = await response.json()
        if (response.ok) setCities(json)
      } catch (err) {
        // Filter still works with "All locations" if cities fail to load
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  const handleChange = (event) => {
    const selected = event.target.value

    if (!selected) {
      navigate('/accommodations')
      return
    }

    navigate(`/accommodations?city=${encodeURIComponent(selected)}`)
  }

  return (
    <div className="city-filter">
      <label htmlFor="city-filter-select" className="city-filter__label">
        Filter by city
      </label>
      <select
        id="city-filter-select"
        className="city-filter__select"
        value={currentCity}
        onChange={handleChange}
        disabled={isLoading}
      >
        <option value="">All locations (South Africa)</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CityFilter
