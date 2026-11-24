import { Link, Navigate, useParams } from 'react-router-dom'
import { getFashionStore } from '../data/fashionStores'
import './FashionStorePage.css'
import '../components/PartnerContact.css'

export function FashionStorePage() {
  const { storeId } = useParams()
  const store = getFashionStore(storeId)

  if (!store) {
    return <Navigate to="/fashion" replace />
  }

  return (
    <section
      className={`page fashion-store fashion-store--${store.id}${store.photoFit === 'contain' ? ' fashion-store--cutouts' : ''}`}
    >
      <p className="fashion-store__back">
        <Link to="/fashion">← All fashion stores</Link>
      </p>

      <header className="fashion-store__head">
        <span
          className={`fashion-store__logo fashion-store__logo--img${store.logoLarge ? ' fashion-store__logo--large' : ''}`}
        >
          <img
            className={store.logoOnDark ? 'fashion-logo--on-dark' : undefined}
            src={store.logoImg}
            alt={store.name}
          />
          {store.logoCaption ? (
            <span className="fashion-store__logo-caption">{store.logoCaption}</span>
          ) : null}
        </span>
        <p className="page__kicker fashion-store__kicker">
          {store.partnerKicker ?? `${store.area} · Fashion partner`}
        </p>
        <p className="page__lead fashion-store__tagline">{store.tagline}</p>
      </header>

      <figure className="fashion-store__hero">
        <img src={store.heroImg} alt={`${store.name} collection`} />
        <figcaption>
          <span>Collection · Holiday season</span>
          <strong>{store.heroTitle}</strong>
          <p>{store.heroText}</p>
        </figcaption>
      </figure>

      <blockquote className="fashion-store__quote">“{store.quote}”</blockquote>

      <h3 className="fashion-store__section">This season’s looks</h3>
      <div className="fashion-store__looks">
        {store.looks.map((look) => (
          <article key={look.title} className="fashion-store__look">
            <img src={look.img} alt={look.title} />
            <div>
              <span className="fashion-store__tag">{look.tag}</span>
              <h4>{look.title}</h4>
              <p>{look.text}</p>
            </div>
          </article>
        ))}
      </div>

      <article
        className={`fashion-store__feature${store.visitBannerImg ? ' fashion-store__feature--stacked' : ''}`}
      >
        {store.visitBannerImg ? (
          <img
            className="fashion-store__visit-banner"
            src={store.visitBannerImg}
            alt=""
          />
        ) : (
          <img src={store.highlightImg} alt="" />
        )}
        <div>
          <p className="fashion-store__label">In store</p>
          {store.hideVisitHeading ? null : <h3>Visit {store.name}</h3>}
          <p>{store.intro}</p>
          {store.venue ? (
            <p className="fashion-store__location">
              <strong>{store.venue}</strong>
              {store.address ? <span>{store.address}</span> : null}
              {store.openingHours ? (
                <span className="fashion-store__hours">{store.openingHours}</span>
              ) : null}
              {store.phone ? <span>{store.phone}</span> : null}
            </p>
          ) : null}
          <p className="fashion-store__note">{store.shopNote}</p>
          {store.websiteUrl ? (
            <p className="fashion-store__link-wrap">
              <a
                className="fashion-store__link"
                href={store.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {store.websiteLabel ?? 'Visit online'} ↗
              </a>
            </p>
          ) : null}
        </div>
      </article>

      {/* Contact block */}
      {(store.phone || store.whatsapp || store.websiteUrl || store.mapsEmbed) && (
        <div className="partner-contact">
          <h3 className="partner-contact__heading">Contact & location</h3>

          {store.venue && (
            <div className="partner-contact__row">
              <span className="partner-contact__icon">📍</span>
              <div>
                <p className="partner-contact__label">Address</p>
                <p className="partner-contact__value">{store.venue}</p>
                {store.address && <p className="partner-contact__value" style={{ fontSize: '0.78rem', color: '#6B7280' }}>{store.address}</p>}
                {store.openingHours && <p className="partner-contact__hours">{store.openingHours}</p>}
              </div>
            </div>
          )}

          {store.phone && (
            <div className="partner-contact__row">
              <span className="partner-contact__icon">📞</span>
              <div>
                <p className="partner-contact__label">Phone</p>
                <a className="partner-contact__link" href={`tel:${store.phone.replace(/\s/g, '')}`}>
                  {store.phone}
                </a>
              </div>
            </div>
          )}

          {store.whatsapp && (
            <a
              className="partner-contact__whatsapp"
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>💬</span> WhatsApp
            </a>
          )}

          {store.websiteUrl && (
            <a
              className="partner-contact__website"
              href={store.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 {store.websiteLabel ?? 'Visit website'} ↗
            </a>
          )}

          {store.mapsUrl && (
            <a
              className="partner-contact__maps-btn"
              href={store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ Open in Google Maps ↗
            </a>
          )}

          {store.mapsEmbed && (
            <div className="partner-contact__map">
              <iframe
                title={`Map – ${store.name}`}
                src={store.mapsEmbed}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      )}

      {!store.hideLifestyleStory ? (
        <article className="fashion-store__story">
          <img src={store.lifestyleImg} alt="" />
          <div>
            <p className="fashion-store__label">Lifestyle</p>
            <h3>{store.lifestyleTitle}</h3>
            <p>{store.lifestyleText}</p>
          </div>
          {store.lifestyleMarkImg ? (
            <p className="fashion-store__mark">
              <img src={store.lifestyleMarkImg} alt="" />
            </p>
          ) : null}
        </article>
      ) : null}
    </section>
  )
}
