/**
 * HeroBanner.js
 * -------------
 * Full-width image banner shown below the navbar.
 *
 * Beginner notes:
 *  - The image is a normal <img>, so it is easy to replace later.
 *  - The overlay is a separate div that darkens the image slightly.
 *  - Text and button are positioned near the bottom-center of the banner.
 */

import './HeroBanner.css'

const heroImageUrl =
  'https://plus.unsplash.com/premium_photo-1748265794414-32c3a7fcd5a3?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const HeroBanner = () => {
  return (
    <section className="hero-banner" aria-label="Flexible travel inspiration">
      <img
        className="hero-banner-image"
        src={heroImageUrl}
        alt="Modern luxury house at sunset"
      />

      <div className="hero-banner-overlay" />

      

      <div className="hero-banner-content">
        <h1>Not sure where to go? Perfect.</h1>
        <button className="hero-flexible-button" type="button">
          I'm flexible
        </button>
      </div>
    </section>
  )
}

export default HeroBanner
