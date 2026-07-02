/**
 * GiftCards.js
 * ------------
 * "Shop Airbnb gift cards" promotional banner with overlapping card cluster.
 *
 * Beginner notes:
 *  - Edit the constants below to change the heading or button text.
 *  - The left column has text; the right column shows three stacked cards.
 */

import './GiftCards.css'

const HEADING = 'Shop Airbnb gift cards'
const BUTTON_LABEL = 'Learn more'

const SCENERY_CARD_LEFT_URL =
  'https://plus.unsplash.com/premium_photo-1728501571457-bc5826622a58?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const SCENERY_CARD_RIGHT_URL =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'

function GiftCards({
  heading = HEADING,
  buttonLabel = BUTTON_LABEL,
  leftImageUrl = SCENERY_CARD_LEFT_URL,
  rightImageUrl = SCENERY_CARD_RIGHT_URL,
}) {
  return (
    <section className="gift-cards" aria-label="Shop gift cards">
      <div className="gift-cards__inner">
        <div className="gift-cards__text">
          <h2 className="gift-cards__heading">{heading}</h2>
          <button className="gift-cards__button" type="button">
            {buttonLabel}
          </button>
        </div>

        <div className="gift-cards__cluster">
          <div className="gift-cards__card gift-cards__card--left">
            <img
              className="gift-cards__card-image"
              src={leftImageUrl}
              alt="Gift card scenery"
              loading="lazy"
            />
          </div>

          <div className="gift-cards__card gift-cards__card--center">
            <svg
              className="gift-cards__logo"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M16 3.5C12.9 3.5 10.6 6 8.5 10.2L3.7 20C1.9 23.7 4.5 28 8.6 28c2.6 0 4.9-1.5 7.4-4.4 2.5 2.9 4.8 4.4 7.4 4.4 4.1 0 6.7-4.3 4.9-8L23.5 10.2C21.4 6 19.1 3.5 16 3.5Zm0 4c1.5 0 2.9 1.7 4.1 4.2l1 2.1c-1.8.7-3.4 1.9-5.1 3.8-1.7-1.9-3.3-3.1-5.1-3.8l1-2.1C13.1 9.2 14.5 7.5 16 7.5Zm-7.4 16.8c-1.4 0-2.3-1.5-1.7-2.8l2.2-4.6c1.4.5 2.7 1.6 4.2 3.4-1.8 2.4-3.4 4-4.7 4Zm14.8 0c-1.3 0-2.9-1.6-4.7-4 1.5-1.8 2.8-2.9 4.2-3.4l2.2 4.6c.6 1.3-.3 2.8-1.7 2.8Z" />
            </svg>
          </div>

          <div className="gift-cards__card gift-cards__card--right">
            <img
              className="gift-cards__card-image"
              src={rightImageUrl}
              alt="Gift card scenery"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default GiftCards
