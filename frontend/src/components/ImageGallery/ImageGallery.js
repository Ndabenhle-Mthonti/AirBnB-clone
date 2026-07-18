/**
 * ImageGallery.js
 * ---------------
 * Airbnb-style photo grid: one large hero image + up to four smaller tiles.
 
 */

import './ImageGallery.css'

const ImageGallery = ({ photos = [], coverPhoto, title }) => {
  /** Use coverPhoto first, then fill with extra photos (max 5 total) */
  const allPhotos = [
    coverPhoto,
    ...photos.filter((url) => url && url !== coverPhoto),
  ].filter(Boolean)

  const displayPhotos = allPhotos.slice(0, 5)
  const placeholders = Math.max(0, 5 - displayPhotos.length)

  return (
    <div className="image-gallery" aria-label={`Photos of ${title}`}>
      {displayPhotos.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className={`image-gallery__tile image-gallery__tile--${index}`}
        >
          <img src={url} alt={`${title} — photo ${index + 1}`} loading="lazy" />
        </div>
      ))}

      {Array.from({ length: placeholders }).map((_, index) => (
        <div
          key={`placeholder-${index}`}
          className={`image-gallery__tile image-gallery__tile--placeholder image-gallery__tile--${
            displayPhotos.length + index
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default ImageGallery
