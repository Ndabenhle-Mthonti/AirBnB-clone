/**
 * TripInspiration.js
 * ------------------
 * "Inspiration for your next trip" — horizontal row of destination cards.
 
 *  - DEFAULT_DESTINATIONS holds the card data (city, region, imageUrl).
 *  - .map() turns each object into a card in the JS.
 */

import './TripInspiration.css'

const DEFAULT_DESTINATIONS = [
  {
    city: 'Cape Town',
    region: 'Western Cape',
    imageUrl:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    city: 'Durban',
    region: 'KwaZulu-Natal',
    imageUrl:
      'https://images.unsplash.com/photo-1656776832783-c1671a7ad521?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    city: 'Johannesburg',
    region: 'Gauteng',
    imageUrl:
      'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Stellenbosch',
    region: 'Western Cape',
    imageUrl:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
  },
  {
    city: 'Kruger National Park',
    region: 'Mpumalanga',
    imageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
  },
]

function TripInspiration({ destinations = DEFAULT_DESTINATIONS }) {
  return (
    <section className="trip-inspiration" aria-label="Trip inspiration">
      <h2 className="trip-inspiration__heading">Inspiration for your next trip</h2>

      <div className="trip-inspiration__grid">
        {destinations.map((destination) => (
          <article key={destination.city} className="trip-inspiration__card">
            <div className="trip-inspiration__image-wrap">
              <img
                className="trip-inspiration__image"
                src={destination.imageUrl}
                alt={destination.city}
                loading="lazy"
              />
            </div>

            <div className="trip-inspiration__label">
              <h3 className="trip-inspiration__city">{destination.city}</h3>
              <p className="trip-inspiration__region">{destination.region}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TripInspiration
