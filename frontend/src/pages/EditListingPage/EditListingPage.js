/**
 * EditListingPage.js
 * ------------------
 * Admin "Update listing" page (rubric).
 *
 * Route: /admin/listings/:id/edit
 * API:   GET /api/airbnbs/:id  → pre-fill form
 *        PATCH /api/airbnbs/:id → save changes
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../../config/api'
import { getAuthHeaders } from '../../utils/authHeaders'
import './EditListingPage.css'

const EditListingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`)
        const json = await response.json()

        if (response.ok) {
          setForm({
            title: json.title || '',
            description: json.description || '',
            pricePerNight: json.pricePerNight || '',
            city: json.location?.city || '',
            country: json.location?.country || 'South Africa',
            maxGuests: json.maxGuests || 1,
            bedrooms: json.bedrooms || 1,
            bathrooms: json.bathrooms || 1,
            beds: json.beds || 1,
            coverPhoto: json.coverPhoto || '',
            minNights: json.minNights || 1,
          })
        } else {
          setError(json.error || 'Listing not found')
        }
      } catch (err) {
        setError('Could not connect to the server.')
      }
    }

    fetchListing()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    const payload = {
      title: form.title,
      description: form.description,
      pricePerNight: Number(form.pricePerNight),
      maxGuests: Number(form.maxGuests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      beds: Number(form.beds),
      coverPhoto: form.coverPhoto,
      minNights: Number(form.minNights),
      location: {
        city: form.city,
        country: form.country,
      },
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      })

      const json = await response.json()

      if (response.ok) {
        navigate('/admin/listings')
      } else {
        setError(json.error || 'Update failed')
      }
    } catch (err) {
      setError('Could not connect to the server.')
    } finally {
      setIsSaving(false)
    }
  }

  if (error && !form) {
    return (
      <div className="edit-listing">
        <p className="edit-listing__error">{error}</p>
        <Link to="/admin/listings">← Back to my listings</Link>
      </div>
    )
  }

  if (!form) {
    return <p className="edit-listing__loading">Loading listing...</p>
  }

  return (
    <div className="edit-listing">
      <h1>Edit listing</h1>
      <Link to="/admin/listings" className="edit-listing__back">
        ← Back to my listings
      </Link>

      <form className="edit-listing__form" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <label>
          City
          <input name="city" value={form.city} onChange={handleChange} required />
        </label>

        <label>
          Country
          <input name="country" value={form.country} onChange={handleChange} required />
        </label>

        <label>
          Price per night (ZAR)
          <input
            name="pricePerNight"
            type="number"
            min={1}
            value={form.pricePerNight}
            onChange={handleChange}
            required
          />
        </label>

        <div className="edit-listing__row">
          <label>
            Max guests
            <input
              name="maxGuests"
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={handleChange}
            />
          </label>
          <label>
            Bedrooms
            <input
              name="bedrooms"
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={handleChange}
            />
          </label>
          <label>
            Beds
            <input
              name="beds"
              type="number"
              min={1}
              value={form.beds}
              onChange={handleChange}
            />
          </label>
          <label>
            Bathrooms
            <input
              name="bathrooms"
              type="number"
              min={0}
              step={0.5}
              value={form.bathrooms}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Minimum nights
          <input
            name="minNights"
            type="number"
            min={1}
            value={form.minNights}
            onChange={handleChange}
          />
        </label>

        <label>
          Cover photo URL
          <input
            name="coverPhoto"
            type="url"
            value={form.coverPhoto}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        {error && <p className="edit-listing__error">{error}</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default EditListingPage
