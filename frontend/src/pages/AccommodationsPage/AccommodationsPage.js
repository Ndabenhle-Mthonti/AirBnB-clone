/**
 * AccommodationsPage.js
 * ---------------------
 * Shows all accommodations or results filtered by city from the URL.
 *
 * Beginner notes:
 *  - No ?city=  → GET /api/airbnbs (all listings — same as Postman)
 *  - ?city=Cape Town → GET /api/airbnbs?city=Cape Town (filtered)
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AccommodationDetails from '../../components/AccommodationDetails'
import CityFilter from '../../components/CityFilter/CityFilter'
import { getAccommodationsUrl } from '../../config/api'
import './AccommodationsPage.css'

const AccommodationsPage = () => {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')

  const [accommodations, setAccommodations] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAccommodations = async () => {
      setAccommodations(null)
      setError('')

      try {
        const response = await fetch(getAccommodationsUrl(city))
        const json = await response.json()

        if (response.ok) {
          setAccommodations(json)
        } else {
          setError(json.error || 'Failed to fetch accommodations')
        }
      } catch (err) {
        setError('Could not connect to the server.')
      }
    }

    fetchAccommodations()
  }, [city])

  const heading = city ? `Accommodations in ${city}` : 'All accommodations'

  return (
    <div className="accommodations-page">
      <h2 className="accommodations-page__heading">{heading}</h2>

      <CityFilter />

      {accommodations === null && !error && (
        <p className="accommodations-page__status">Loading accommodations...</p>
      )}

      {error && <p className="accommodations-page__error">{error}</p>}

      {accommodations && accommodations.length === 0 && !error && (
        <p className="accommodations-page__status">
          {city
            ? `No accommodations found in ${city}.`
            : 'No accommodations found yet.'}
        </p>
      )}

      <div className="accommodations-page__grid">
        {accommodations &&
          accommodations.map((accommodation) => (
            <AccommodationDetails
              key={accommodation._id}
              accommodation={accommodation}
            />
          ))}
      </div>
    </div>
  )
}

export default AccommodationsPage
