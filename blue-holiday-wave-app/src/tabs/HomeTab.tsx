import '../App.css';
import './HomeTab.css';

const STORIES = [
  {
    img: '/photos/photo1.jpg',
    tag: 'Fashion',
    title: 'Holiday Collections 2026',
    desc: 'The season's most coveted looks — from glittering gowns to relaxed casuals.',
  },
  {
    img: '/photos/photo2.jpg',
    tag: 'Homes',
    title: 'Festive Interior Trends',
    desc: 'Transform your living space with warm tones, natural textures and candlelight.',
  },
  {
    img: '/photos/photo3.jpg',
    tag: 'Taste',
    title: 'Culinaire Feestdagen',
    desc: 'From island spices to European classics — the best holiday flavours.',
  },
];

export function HomeTab() {
  return (
    <div>
      {/* Hero */}
      <div className="home-hero">
        <img src="/blue-gold.png" alt="The Blue Holiday Wave" className="home-hero-logo" />
        <p className="home-hero-tagline">Fashion · Homes · Taste</p>
        <p className="home-hero-season">Holiday 2026</p>
      </div>

      <div className="page-content">
        {/* Featured stories */}
        <div>
          <p className="section-label">Featured</p>
          <h2 className="section-heading">This Week</h2>
        </div>

        {STORIES.map((story, i) => (
          <div key={i} className="card">
            <div className="card-img-placeholder" />
            <div className="card-body">
              <span className="card-tag">{story.tag}</span>
              <h3 className="card-title">{story.title}</h3>
              <p className="card-desc">{story.desc}</p>
            </div>
          </div>
        ))}

        {/* Newsletter */}
        <div className="home-newsletter">
          <p className="section-label">Stay in the loop</p>
          <h3 className="section-heading" style={{ marginBottom: '0.5rem' }}>Get the Newsletter</h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--gray)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Holiday inspiration, exclusive deals and the best stories — straight to your inbox.
          </p>
          <input
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
          />
          <button className="btn-gold" style={{ marginTop: '0.6rem' }}>Subscribe Free</button>
        </div>
      </div>
    </div>
  );
}
