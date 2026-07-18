/**
 * MyListingsPage.js
 * -----------------
 * Admin "View listings" page (rubric).
 *
 * Route: /admin/listings
 * API:   GET /api/airbnbs/mine (JWT required)
 *
 * Each card shows key details with Edit and Delete actions.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, MY_LISTINGS_URL } from '../../config/api'
import { getAuthHeaders } from '../../utils/authHeaders'
import './MyListingsPage.css'

const MyListingsPage = () => {
  const [listings, setListings] = useState(null)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const fetchListings = async () => {
    setError('')
    setListings(null)

    try {
      const response = await fetch(MY_LISTINGS_URL, {
        headers: getAuthHeaders(),
      })
      const json = await response.json()

      if (response.ok) {
        setListings(json)
      } else {
        setError(json.error || 'Failed to load your listings')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const json = await response.json()

      if (response.ok) {
        setActionMessage(`Deleted "${title}"`)
        fetchListings()
      } else {
        setError(json.error || 'Delete failed')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    }
  }

  return (
    <div className="my-listings">
      <div className="my-listings__header">
        <h1>My listings</h1>
        <Link to="/add" className="my-listings__create">
          + Create listing
        </Link>
      </div>

      <Link to="/admin" className="my-listings__back">
        ← Back to dashboard
      </Link>

      {actionMessage && <p className="my-listings__success">{actionMessage}</p>}
      {error && <p className="my-listings__error">{error}</p>}

      {listings === null && !error && (
        <p className="my-listings__status">Loading your listings...</p>
      )}

      {listings && listings.length === 0 && (
        <p className="my-listings__status">
          You have no listings yet.{' '}
          <Link to="/add">Create your first listing</Link>
        </p>
      )}

      <div className="my-listings__grid">
        {listings?.map((listing) => (
          <article key={listing._id} className="my-listings__card">
            {listing.coverPhoto && (
              <img src={listing.coverPhoto} alt={listing.title} />
            )}
            <div className="my-listings__body">
              <h2>{listing.title}</h2>
              <p className="my-listings__location">
                {listing.location?.city}, {listing.location?.country}
              </p>
              <p className="my-listings__price">
                {listing.currency || 'ZAR'} {listing.pricePerNight} / night
              </p>
              <div className="my-listings__actions">
                <Link to={`/admin/listings/${listing._id}/edit`}>Edit</Link>
                <button
                  type="button"
                  onClick={() => handleDelete(listing._id, listing.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default MyListingsPage
