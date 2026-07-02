/**
 * Home.js
 * -------
 * Main page — displays all accommodations from the backend.
 *
 * Data comes from AccommodationContext (fetched when the user is logged in).
 * Protected routes on the backend require a valid JWT in the request.
 */

import { Link } from 'react-router-dom'
import AccommodationDetails from '../components/AccommodationDetails'
import { useAccommodationContext } from '../hooks/useAccommodationContext'
import { useAuthContext } from '../hooks/useAuthContext'

const Home = () => {
  const { accommodations, searchParams, error } = useAccommodationContext()
  const { user } = useAuthContext()

  const visibleAccommodations =
    accommodations && searchParams?.destination
      ? accommodations.filter(
          (accommodation) =>
            accommodation.location?.city?.toLowerCase() ===
            searchParams.destination.toLowerCase(),
        )
      : accommodations

  if (!user) {
    return (
      <div className="home">
        <h2>Available Accommodations</h2>
        <p className="error">
          Please log in to view accommodations.{' '}
          <Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className="home">
      <h2>Available Accommodations</h2>

      {accommodations === null && !error && <p>Loading accommodations...</p>}

      {error && <p className="error">{error}</p>}

      {visibleAccommodations && visibleAccommodations.length === 0 && !error && (
        <p>
          {searchParams?.destination
            ? `No accommodations found in ${searchParams.destination}.`
            : 'No accommodations yet. Go to Become a host to add your first listing.'}
        </p>
      )}

      <div className="airbnbs">
        {visibleAccommodations &&
          visibleAccommodations.map((accommodation) => (
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
