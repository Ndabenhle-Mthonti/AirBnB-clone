/**
 * HostingCTA.js
 * -------------
 * "Questions about hosting?" full-width promotional banner.
 *
 
 *  - Edit the constants below to change the heading or button text.
 *  - Swap BACKGROUND_IMAGE_URL when you have your own photo.
 */

import './HostingCTA.css'

const HEADING = 'Questions about hosting?'
const BUTTON_LABEL = 'Ask a Superhost'

const BACKGROUND_IMAGE_URL =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80'

function HostingCTA({
  heading = HEADING,
  buttonLabel = BUTTON_LABEL,
  imageUrl = BACKGROUND_IMAGE_URL,
}) {
  return (
    <section className="hosting-cta" aria-label="Hosting questions">
      <div className="hosting-cta__banner">
        <div className="hosting-cta__image-wrap">
          <img
            className="hosting-cta__image"
            src={imageUrl}
            alt="Happy host"
            loading="lazy"
          />
          <div className="hosting-cta__gradient" aria-hidden="true" />
        </div>

        <div className="hosting-cta__content">
          <h2 className="hosting-cta__heading">{heading}</h2>
          <button className="hosting-cta__button" type="button">
            {buttonLabel}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HostingCTA
