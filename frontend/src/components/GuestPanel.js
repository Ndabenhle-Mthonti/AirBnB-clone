/**
 * GuestPanel.js
 * -------------
 * Counter controls for adults, children, infants, and pets.
 *
 * The parent SearchBar stores the guests object.
 * This component only calculates the next value and sends it back up.
 */

import './GuestPanel.css'

const guestRows = [
  { key: 'adults', label: 'Adults', sublabel: 'Ages 13 or above', max: 16 },
  { key: 'children', label: 'Children', sublabel: 'Ages 2-12', max: 10 },
  { key: 'infants', label: 'Infants', sublabel: 'Under 2', max: 5 },
  { key: 'pets', label: 'Pets', sublabel: 'Bringing a service animal?', max: 5 },
]

const hasNonAdultGuests = (guests) =>
  guests.children > 0 || guests.infants > 0 || guests.pets > 0

const GuestPanel = ({ guests, onGuestsChange }) => {
  const getMinimumValue = (key) => {
    if (key === 'adults' && hasNonAdultGuests(guests)) {
      return 1
    }

    return 0
  }

  const changeGuestCount = (key, amount, max) => {
    const minimum = getMinimumValue(key)
    const nextValue = Math.min(max, Math.max(minimum, guests[key] + amount))
    const nextGuests = { ...guests, [key]: nextValue }

    // If someone adds a child, infant, or pet first, make adults at least 1.
    if (key !== 'adults' && amount > 0 && nextGuests.adults === 0) {
      nextGuests.adults = 1
    }

    onGuestsChange(nextGuests)
  }

  return (
    <div className="search-panel guest-panel" role="dialog" aria-label="Choose guests">
      {guestRows.map((row) => {
        const minimum = getMinimumValue(row.key)
        const isMinusDisabled = guests[row.key] <= minimum
        const isPlusDisabled = guests[row.key] >= row.max

        return (
          <div className="guest-row" key={row.key}>
            <div>
              <p className="guest-label">{row.label}</p>
              <p className="guest-sublabel">{row.sublabel}</p>
            </div>

            <div className="guest-counter">
              <button
                type="button"
                disabled={isMinusDisabled}
                onClick={() => changeGuestCount(row.key, -1, row.max)}
                aria-label={`Decrease ${row.label}`}
              >
                -
              </button>
              <span>{guests[row.key]}</span>
              <button
                type="button"
                disabled={isPlusDisabled}
                onClick={() => changeGuestCount(row.key, 1, row.max)}
                aria-label={`Increase ${row.label}`}
              >
                +
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default GuestPanel
