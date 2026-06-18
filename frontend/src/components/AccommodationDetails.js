/**
 * AccommodationDetails.js
 * -----------------------
 * A small reusable card that displays ONE accommodation.
 * Home.js passes each item as the "accommodation" prop.
 */

const AccommodationDetails = ({ accommodation }) => {
  return (
    <div className="accommodation-details">
      {/* coverPhoto comes from the form / Postman and is stored in MongoDB */}
      {accommodation.coverPhoto && (
        <img
          src={accommodation.coverPhoto}
          alt={accommodation.title}
          className="cover-photo"
        />
      )}

      {/* Main title from the database */}
      <h4>{accommodation.title}</h4>

      {/* Show city and country if location exists */}
      {accommodation.location && (
        <p className="location">
          {accommodation.location.city}, {accommodation.location.country}
        </p>
      )}

      {/* Price per night */}
      <p className="price">
        {accommodation.currency || 'USD'} {accommodation.pricePerNight} / night
      </p>

      {/* Short description */}
      <p className="description">{accommodation.description}</p>
    </div>
  )
}

export default AccommodationDetails
