

import './DiscoverExperiences.css'

const DEFAULT_EXPERIENCES = [
  {
    title: 'Things to do on your trip',
    buttonLabel: 'Experiences',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Things to do from home',
    buttonLabel: 'Online Experiences',
    imageUrl:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
  },
]

function DiscoverExperiences({ experiences = DEFAULT_EXPERIENCES }) {
  return (
    <section className="discover-experiences" aria-label="Discover experiences">
      <h2 className="discover-experiences__heading">Discover Airbnb Experiences</h2>

      <div className="discover-experiences__grid">
        {experiences.map((experience) => (
          <article key={experience.title} className="discover-experiences__card">
            <div className="discover-experiences__image-wrap">
              <img
                className="discover-experiences__image"
                src={experience.imageUrl}
                alt={experience.title}
                loading="lazy"
              />
              <div className="discover-experiences__gradient" aria-hidden="true" />
            </div>

            <div className="discover-experiences__content">
              <h3 className="discover-experiences__title">{experience.title}</h3>
              <button className="discover-experiences__button" type="button">
                {experience.buttonLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DiscoverExperiences
