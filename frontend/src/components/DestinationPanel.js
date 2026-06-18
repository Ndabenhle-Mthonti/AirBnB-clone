/**
 * DestinationPanel.js
 * -------------------
 * Shows a search input and city suggestions.
 * Later, the hardcoded city list can be replaced with cities from the backend.
 */

import './DestinationPanel.css'

const popularCities = [
  {
    name: 'Cape Town',
    image:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Johannesburg',
    image:
      'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Durban',
    image:
      'https://images.unsplash.com/photo-1579493934830-eab45746b51b?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Pretoria',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Port Elizabeth',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Knysna',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Stellenbosch',
    image:
      'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Mbombela',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=300&q=80',
  },
]

const DestinationPanel = ({ query, onQueryChange, onSelectCity }) => {
  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase()),
  )

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

      <div className="destination-city-grid">
        {filteredCities.map((city) => (
          <button
            className="destination-city-card"
            key={city.name}
            type="button"
            onClick={() => onSelectCity(city.name)}
          >
            <img src={city.image} alt={city.name} />
            <span>{city.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DestinationPanel
