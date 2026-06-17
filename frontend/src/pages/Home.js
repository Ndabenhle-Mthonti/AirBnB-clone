/**
 * Home.js
 * -------
 * Main page — displays all accommodations from the backend.
 *
 * Data comes from AccommodationContext (fetched in AccommodationContext.js).
 * We do NOT fetch here directly — that keeps one single source of truth.
 */

import AccommodationDetails from '../components/AccommodationDetails'
import { useAccommodationContext } from '../hooks/useAccommodationContext'
import { API_URL } from '../config/api'

const Home = () => {
  const { accommodations, error } = useAccommodationContext()

  return (
    <div className="home">
      <h2>Available Accommodations</h2>

      {/* null means the GET request is still in progress */}
      {accommodations === null && !error && <p>Loading accommodations...</p>}

      {/* Backend unreachable or returned an error */}
      {error && <p className="error">{error}</p>}

      {/* API worked but database has no listings yet */}
      {accommodations && accommodations.length === 0 && (
        <p>
          No accommodations yet. Go to <strong>Add listing</strong> or use Postman
          POST {API_URL}
        </p>
      )}

      {/* Render one card per accommodation from MongoDB */}
      <div className="airbnbs">
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

export default Home
