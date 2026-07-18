/**
 * AccommodationDetails.js
 * -----------------------
 * Listing card for the accommodations grid (rubric: location cards).
 *
 * Clicking a card navigates to /accommodations/:id (details page).
 * Shows cover photo, title, city, price, and short description.
 */

import { Link } from 'react-router-dom'

const AccommodationDetails = ({ accommodation }) => {
  return (
    <Link
      to={`/accommodations/${accommodation._id}`}
      className="accommodation-details accommodation-details--link"
    >
      {accommodation.coverPhoto && (
        <img
          src={accommodation.coverPhoto}
          alt={accommodation.title}
          className="cover-photo"
        />
      )}

      <h4>{accommodation.title}</h4>

      {accommodation.location && (
        <p className="location">
          {accommodation.location.city}, {accommodation.location.country}
        </p>
      )}

      <p className="price">
        <strong>
          {accommodation.currency || 'ZAR'} {accommodation.pricePerNight}
        </strong>{' '}
        / night
      </p>

      {accommodation.rating > 0 && (
        <p className="rating">
          ★ {accommodation.rating.toFixed(2)}
          {accommodation.reviewCount > 0 && (
            <span className="review-count"> ({accommodation.reviewCount} reviews)</span>
          )}
        </p>
      )}

      <p className="description">{accommodation.description}</p>
    </Link>
  )
}

export default AccommodationDetails
