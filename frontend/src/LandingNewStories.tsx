import { LANDING_NEW_STORIES } from './landingStoryData';

type Props = {
  flipsnackUrl: string;
};

export function LandingNewStories({ flipsnackUrl }: Props) {
  return (
    <section className="landing-new-stories" aria-labelledby="landing-new-stories-heading">
      <h2 id="landing-new-stories-heading" className="landing-new-stories__title">
        New magazine stories
      </h2>
      <ul className="landing-new-stories__grid">
        {LANDING_NEW_STORIES.map((story) => (
          <li key={story.slug}>
            <a
              href={flipsnackUrl}
              className="landing-story-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={story.imageUrl}
                alt={story.imageAlt}
                className="landing-story-card__img"
                loading="lazy"
                decoding="async"
              />
              <span className="landing-story-card__title">{story.headline}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
