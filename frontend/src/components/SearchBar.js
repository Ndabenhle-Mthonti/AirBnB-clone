/**
 * SearchBar.js
 * ------------
 * Old Airbnb-style search bar with four sections:
 * Location, Check-in date, Checkout date, and Guests.
 *
 * Beginner notes:
 *  - activePanel controls which dropdown is open.
 *  - The location dropdown loads cities from the database and navigates on click.
 *  - The date fields both open DatePanel because that panel chooses a range.
 *  - onSearch sends the final search values to Navbar, then context.
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import DestinationPanel from './DestinationPanel'
import DatePanel from './DatePanel'
import GuestPanel from './GuestPanel'
import './SearchBar.css'

const formatDate = (date) =>
  date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''

const getGuestSummary = (guests) => {
  const totalGuests = guests.adults + guests.children
  const parts = []

  if (totalGuests > 0) {
    parts.push(`${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}`)
  }

  if (guests.infants > 0) {
    parts.push(`${guests.infants} ${guests.infants === 1 ? 'infant' : 'infants'}`)
  }

  if (guests.pets > 0) {
    parts.push(`${guests.pets} ${guests.pets === 1 ? 'pet' : 'pets'}`)
  }

  return parts.length > 0 ? parts.join(', ') : 'Add guests'
}

const SearchBar = ({ onSearch = () => {} }) => {
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState(null)
  const [destination, setDestination] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  })

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActivePanel(null)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActivePanel(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handlePanelClick = (panelName) => {
    setValidationMessage('')
    setActivePanel((currentPanel) =>
      currentPanel === panelName ? null : panelName,
    )
  }

  const handleDestinationChange = (event) => {
    setDestinationQuery(event.target.value)
    setDestination(event.target.value)
    setValidationMessage('')
    setActivePanel('destination')
  }

  const handleViewAllLocations = () => {
    setDestination('All accommodations')
    setDestinationQuery('All accommodations')
    setValidationMessage('')
    setActivePanel(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedDestination = destination.trim()

    if (
      !trimmedDestination ||
      trimmedDestination.toLowerCase() === 'all accommodations' ||
      trimmedDestination.toLowerCase() === 'all locations'
    ) {
      setDestination('All accommodations')
      setDestinationQuery('All accommodations')
      onSearch({ destination: 'All accommodations', checkIn, checkOut, guests })
      setActivePanel(null)
      navigate('/accommodations')
      return
    }

    onSearch({ destination: trimmedDestination, checkIn, checkOut, guests })
    setActivePanel(null)
    navigate(`/accommodations?city=${encodeURIComponent(trimmedDestination)}`)
  }

  return (
    <div className="search-wrapper" ref={searchRef}>
      <form
        className="search-bar"
        aria-label="Search accommodations"
        onSubmit={handleSubmit}
      >
        <label
          className={`search-section search-section--location ${
            activePanel === 'destination' ? 'search-section--active' : ''
          }`}
        >
          <span className="search-label">Location</span>
          <input
            className="search-input"
            type="text"
            value={destinationQuery}
            placeholder="Search destinations"
            onChange={handleDestinationChange}
            onFocus={() => setActivePanel('destination')}
          />
        </label>

        <span className="search-divider" aria-hidden="true" />

        <button
          className={`search-section ${
            activePanel === 'dates' ? 'search-section--active' : ''
          }`}
          type="button"
          onClick={() => handlePanelClick('dates')}
        >
          <span className="search-label">Check-in date</span>
          <span className="search-value">{formatDate(checkIn) || 'Add dates'}</span>
        </button>

        <span className="search-divider" aria-hidden="true" />

        <button
          className={`search-section ${
            activePanel === 'dates' ? 'search-section--active' : ''
          }`}
          type="button"
          onClick={() => handlePanelClick('dates')}
        >
          <span className="search-label">Checkout date</span>
          <span className="search-value">{formatDate(checkOut) || 'Add dates'}</span>
        </button>

        <span className="search-divider" aria-hidden="true" />

        <button
          className={`search-section ${
            activePanel === 'guests' ? 'search-section--active' : ''
          }`}
          type="button"
          onClick={() => handlePanelClick('guests')}
        >
          <span className="search-label">Guests</span>
          <span className="search-value">{getGuestSummary(guests)}</span>
        </button>

        <button className="search-button" type="submit" aria-label="Search">
          <FiSearch />
        </button>
      </form>

      {validationMessage && (
        <p className="search-validation-message">{validationMessage}</p>
      )}

      {activePanel === 'destination' && (
        <DestinationPanel
          query={destinationQuery}
          onQueryChange={(value) => {
            setDestinationQuery(value)
            setDestination(value)
          }}
          onViewAllLocations={handleViewAllLocations}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'dates' && (
        <DatePanel
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />
      )}

      {activePanel === 'guests' && (
        <GuestPanel guests={guests} onGuestsChange={setGuests} />
      )}
    </div>
  )
}

export default SearchBar
