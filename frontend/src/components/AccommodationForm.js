/**
 * AccommodationForm.js
 * ----------------------
 * Multi-step wizard to create a new accommodation listing.
 *
 * Flow:
 *  1. User fills steps → data stored in listingReducer state
 *  2. On "Publish" → buildAccommodationPayload() shapes data for the API
 *  3. POST /api/airbnbs → backend saves to MongoDB
 *  4. New listing appears on Home page (GET /api/airbnbs)
 */

import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingReducer, initialListingState } from '../reducers/listingReducer'
import {
  buildAccommodationPayload,
  validateListingForm,
} from '../utils/buildAccommodationPayload'
import { useAccommodationContext } from '../hooks/useAccommodationContext'
import { API_URL } from '../config/api'

function AccommodationForm() {
  const [state, dispatch] = useReducer(listingReducer, initialListingState)
  const [photoUrlInput, setPhotoUrlInput] = useState('')
  const { dispatch: accommodationDispatch } = useAccommodationContext()
  const navigate = useNavigate()

  const totalSteps = 10

  const nextStep = () =>
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 })

  const prevStep = () =>
    dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 })

  const handleBasicInfo = (e) => {
    dispatch({
      type: 'UPDATE_BASIC_INFO',
      payload: { [e.target.name]: e.target.value },
    })
  }

  const handleLocation = (e) => {
    dispatch({
      type: 'UPDATE_LOCATION',
      payload: { [e.target.name]: e.target.value },
    })
  }

  const handleCapacity = (field, delta) => {
    const current = state.capacity[field]
    const min = field === 'bathrooms' ? 0.5 : 1
    dispatch({
      type: 'UPDATE_CAPACITY',
      payload: { [field]: Math.max(min, current + delta) },
    })
  }

  const handleAmenity = (amenity) => {
    dispatch({ type: 'TOGGLE_AMENITY', payload: amenity })
  }

  /**
   * Photos are stored as URL strings in MongoDB (not files).
   * Paste a link from Unsplash or any image host, then click Add.
   */
  const handleAddPhotoUrl = () => {
    const url = photoUrlInput.trim()
    if (!url.startsWith('http')) {
      alert('Please paste a full image URL starting with http:// or https://')
      return
    }
    dispatch({ type: 'ADD_PHOTO', payload: url })
    setPhotoUrlInput('')
  }

  const handlePricing = (e) => {
    dispatch({
      type: 'UPDATE_PRICING',
      payload: { [e.target.name]: e.target.value },
    })
  }

  const handleAvailability = (e) => {
    dispatch({
      type: 'UPDATE_AVAILABILITY',
      payload: { [e.target.name]: e.target.value },
    })
  }

  const handleRules = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    dispatch({
      type: 'UPDATE_RULES',
      payload: { [e.target.name]: value },
    })
  }

  /**
   * Send listing to backend.
   * buildAccommodationPayload() converts form state → MongoDB schema shape.
   */
  const handleSubmit = async () => {
    const validationErrors = validateListingForm(state)
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: validationErrors })
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Please complete all required fields before publishing.',
      })
      return
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true })
    dispatch({ type: 'SUBMIT_ERROR', payload: null })

    try {
      const body = buildAccommodationPayload(state)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        // Backend returns the full saved document (including _id from MongoDB)
        dispatch({ type: 'SUBMIT_SUCCESS', payload: data._id })

        // Add the new listing to shared context so Home page updates instantly
        accommodationDispatch({ type: 'ADD_ACCOMMODATION', payload: data })

        // Optional: go back to Home after 2 seconds so user sees their new card
        setTimeout(() => navigate('/'), 2000)
      } else {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: data.error || 'Failed to create listing',
        })
      }
    } catch (err) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: 'Could not reach the server. Is the backend running on port 4000?',
      })
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false })
    }
  }

  const handleSaveDraft = () => {
    dispatch({ type: 'SAVE_DRAFT' })
  }

  return (
    <div className="accommodation-form">
      {/* Progress bar */}
      <div className="form-progress">
        <div
          className="form-progress__bar"
          style={{ width: `${(state.currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <p className="form-step-counter">
        Step {state.currentStep} of {totalSteps}
      </p>

      {/* STEP 1: Property type — values must match backend enum exactly */}
      {state.currentStep === 1 && (
        <div className="form-step">
          <h2>What kind of place will guests have?</h2>
          <p>Choose the option that best describes your place.</p>

          {['entire place', 'private room', 'shared room'].map((type) => (
            <label
              key={type}
              className={`form-option ${
                state.basicInfo.roomType === type ? 'form-option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="roomType"
                value={type}
                checked={state.basicInfo.roomType === type}
                onChange={handleBasicInfo}
              />
              {type === 'entire place' && '🏠 Entire place'}
              {type === 'private room' && '🚪 Private room'}
              {type === 'shared room' && '🛋️ Shared room'}
            </label>
          ))}

          <h3>What type of property is it?</h3>
          {['house', 'apartment', 'cabin', 'villa', 'hotel'].map((type) => (
            <label
              key={type}
              className={`form-option ${
                state.basicInfo.propertyType === type
                  ? 'form-option--selected'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="propertyType"
                value={type}
                checked={state.basicInfo.propertyType === type}
                onChange={handleBasicInfo}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      )}

      {/* STEP 2: Location — field names match backend location object */}
      {state.currentStep === 2 && (
        <div className="form-step">
          <h2>Where is your place located?</h2>
          <p>City and country are required by the database.</p>

          <input
            name="address"
            value={state.location.address}
            onChange={handleLocation}
            placeholder="Street address"
          />
          <input
            name="city"
            value={state.location.city}
            onChange={handleLocation}
            placeholder="City *"
          />
          <input
            name="state"
            value={state.location.state}
            onChange={handleLocation}
            placeholder="Province / State"
          />
          <input
            name="country"
            value={state.location.country}
            onChange={handleLocation}
            placeholder="Country *"
          />
          {state.errors.city && <p className="form-error">{state.errors.city}</p>}
          {state.errors.country && (
            <p className="form-error">{state.errors.country}</p>
          )}
        </div>
      )}

      {/* STEP 3: Capacity — guests becomes maxGuests on submit */}
      {state.currentStep === 3 && (
        <div className="form-step">
          <h2>How many guests can your place accommodate?</h2>

          {['guests', 'bedrooms', 'beds', 'bathrooms'].map((field) => (
            <div key={field} className="form-counter">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <div className="form-counter__controls">
                <button type="button" onClick={() => handleCapacity(field, -1)}>
                  −
                </button>
                <span>{state.capacity[field]}</span>
                <button type="button" onClick={() => handleCapacity(field, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 4: Amenities — saved as string array in MongoDB */}
      {state.currentStep === 4 && (
        <div className="form-step">
          <h2>Tell guests what your place has to offer</h2>

          {[
            'wifi',
            'tv',
            'kitchen',
            'washer',
            'airConditioning',
            'heating',
            'pool',
            'parking',
            'petFriendly',
          ].map((amenity) => (
            <label
              key={amenity}
              className={`form-option ${
                state.amenities[amenity] ? 'form-option--selected' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={state.amenities[amenity]}
                onChange={() => handleAmenity(amenity)}
              />
              {amenity.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </label>
          ))}
        </div>
      )}

      {/* STEP 5: Photos — backend stores URL strings, not uploaded files */}
      {state.currentStep === 5 && (
        <div className="form-step">
          <h2>Add photos of your place</h2>
          <p>Paste image URLs (for example from Unsplash). At least one is required.</p>

          <div className="form-photo-url">
            <input
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />
            <button type="button" onClick={handleAddPhotoUrl}>
              Add photo
            </button>
          </div>

          <div className="form-photo-grid">
            {state.photos.map((photoUrl, index) => (
              <div
                key={index}
                className={`form-photo-item ${
                  index === state.coverPhotoIndex ? 'form-photo-item--cover' : ''
                }`}
              >
                <img src={photoUrl} alt={`listing-${index}`} />
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'SET_COVER_PHOTO', payload: index })
                  }
                >
                  {index === state.coverPhotoIndex ? '⭐ Cover' : 'Set as cover'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'REMOVE_PHOTO', payload: index })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {state.errors.photos && (
            <p className="form-error">{state.errors.photos}</p>
          )}
        </div>
      )}

      {/* STEP 6: Title */}
      {state.currentStep === 6 && (
        <div className="form-step">
          <h2>Give your place a title</h2>
          <textarea
            name="title"
            value={state.basicInfo.title}
            onChange={handleBasicInfo}
            placeholder="Cozy cabin in the mountains..."
            maxLength={50}
            rows={3}
          />
          <p>{state.basicInfo.title.length} / 50</p>
          {state.errors.title && <p className="form-error">{state.errors.title}</p>}
        </div>
      )}

      {/* STEP 7: Description */}
      {state.currentStep === 7 && (
        <div className="form-step">
          <h2>Create your description</h2>
          <textarea
            name="description"
            value={state.basicInfo.description}
            onChange={handleBasicInfo}
            placeholder="Describe your space and neighbourhood..."
            maxLength={500}
            rows={6}
          />
          <p>{state.basicInfo.description.length} / 500</p>
          {state.errors.description && (
            <p className="form-error">{state.errors.description}</p>
          )}
        </div>
      )}

      {/* STEP 8: Pricing — pricePerNight is required in backend */}
      {state.currentStep === 8 && (
        <div className="form-step">
          <h2>Set your price</h2>

          <label>Currency</label>
          <select
            name="currency"
            value={state.pricing.currency}
            onChange={handlePricing}
          >
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>

          <label>Price per night ({state.pricing.currency}) *</label>
          <input
            name="pricePerNight"
            type="number"
            value={state.pricing.pricePerNight}
            onChange={handlePricing}
            placeholder="0"
            min="1"
          />
          {state.errors.pricePerNight && (
            <p className="form-error">{state.errors.pricePerNight}</p>
          )}
        </div>
      )}

      {/* STEP 9: Availability and rules */}
      {state.currentStep === 9 && (
        <div className="form-step">
          <h2>Availability and house rules</h2>

          <label>Minimum nights</label>
          <input
            name="minNights"
            type="number"
            value={state.availability.minNights}
            onChange={handleAvailability}
            min="1"
          />

          <label>Check-in time</label>
          <input
            name="checkInTime"
            type="time"
            value={state.rules.checkInTime}
            onChange={handleRules}
          />

          <label>Check-out time</label>
          <input
            name="checkOutTime"
            type="time"
            value={state.rules.checkOutTime}
            onChange={handleRules}
          />

          <h3>Cancellation policy</h3>
          {['flexible', 'moderate', 'strict'].map((policy) => (
            <label
              key={policy}
              className={`form-option ${
                state.cancellationPolicy === policy ? 'form-option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="cancellationPolicy"
                value={policy}
                checked={state.cancellationPolicy === policy}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CANCELLATION_POLICY',
                    payload: e.target.value,
                  })
                }
              />
              {policy.charAt(0).toUpperCase() + policy.slice(1)}
            </label>
          ))}
        </div>
      )}

      {/* STEP 10: Review before publish */}
      {state.currentStep === 10 && (
        <div className="form-step">
          <h2>Review your listing</h2>

          <div className="form-review">
            <p>
              <strong>Type:</strong> {state.basicInfo.roomType} —{' '}
              {state.basicInfo.propertyType}
            </p>
            <p>
              <strong>Location:</strong> {state.location.city},{' '}
              {state.location.country}
            </p>
            <p>
              <strong>Guests:</strong> {state.capacity.guests} ·{' '}
              {state.capacity.bedrooms} bedroom(s) · {state.capacity.beds} bed(s)
            </p>
            <p>
              <strong>Price:</strong> {state.pricing.currency}{' '}
              {state.pricing.pricePerNight} / night
            </p>
            <p>
              <strong>Title:</strong> {state.basicInfo.title}
            </p>
            <p>
              <strong>Photos:</strong> {state.photos.length} added
            </p>
          </div>

          {state.meta.lastSaved && (
            <p className="form-draft-saved">
              Draft saved at {new Date(state.meta.lastSaved).toLocaleTimeString()}
            </p>
          )}

          {state.meta.submitError && (
            <p className="form-error">{state.meta.submitError}</p>
          )}

          {state.meta.submitSuccess && (
            <p className="form-success">
              Listing published! View it on the Home page. ID: {state.meta.listingId}
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="form-nav">
        <button type="button" onClick={handleSaveDraft}>
          Save draft
        </button>

        <div className="form-nav__steps">
          {state.currentStep > 1 && (
            <button type="button" onClick={prevStep}>
              Back
            </button>
          )}

          {state.currentStep < totalSteps ? (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state.meta.isSubmitting}
            >
              {state.meta.isSubmitting ? 'Publishing...' : 'Publish listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccommodationForm
