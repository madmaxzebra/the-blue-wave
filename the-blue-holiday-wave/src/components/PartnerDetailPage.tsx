import { Link, Navigate, useParams } from 'react-router-dom'
import type { PartnerProfile } from '../data/homesPartners'
import { LogoImg } from './LogoImg'
import { ClaimPage } from './community/ClaimPage'
import { ReviewSection } from './community/ReviewSection'
import { PartnerGallery } from './PartnerGallery'
import { applyOverrides, useOwnerContent } from '../lib/ownerContent'
import '../pages/FashionStorePage.css'

type Props = {
  listPath: string
  listLabel: string
  partnerKind: string
  /** restaurant, agency, company ... used in the claim text */
  noun: string
  getPartner: (id: string | undefined) => PartnerProfile | undefined
}

export function PartnerDetailPage({
  listPath,
  listLabel,
  partnerKind,
  noun,
  getPartner,
}: Props) {
  const { partnerId } = useParams()
  const content = useOwnerContent()
  const base = getPartner(partnerId)

  if (!base) {
    return <Navigate to={listPath} replace />
  }
  const partner = applyOverrides(base, content[base.id])

  return (
    <section className="page fashion-store">
      <p className="fashion-store__back">
        <Link to={listPath}>← {listLabel}</Link>
      </p>

      <header className="fashion-store__head">
        <span
          className={`fashion-store__logo fashion-store__logo--img${partner.logoWide ? ' fashion-store__logo--wide' : ''}`}
        >
          <LogoImg
            src={partner.logoImg}
            alt={partner.name}
            label={partner.logoLabel}
            color={partner.logoColor}
          />
        </span>
        <p className="page__kicker fashion-store__kicker">
          {partner.area} · {partnerKind}
        </p>
        <p className="page__lead fashion-store__tagline">{partner.tagline}</p>
      </header>

      <figure className="fashion-store__hero">
        <img src={partner.heroImg} alt={partner.name} />
        <figcaption>
          <span>{partner.collectionLabel}</span>
          <strong>{partner.heroTitle}</strong>
          <p>{partner.heroText}</p>
        </figcaption>
      </figure>

      <blockquote className="fashion-store__quote">“{partner.quote}”</blockquote>

      <h3 className="fashion-store__section">{partner.itemsHeading}</h3>
      <div className="fashion-store__looks">
        {partner.items.map((item) => (
          <article key={item.title} className="fashion-store__look">
            <img src={item.img} alt={item.title} />
            <div>
              <span className="fashion-store__tag">{item.tag}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="fashion-store__feature">
        <img src={partner.highlightImg} alt="" />
        <div>
          <p className="fashion-store__label">{partner.visitLabel}</p>
          <h3>{partner.visitTitle}</h3>
          <p>{partner.intro}</p>
          {partner.address ? (
            <p className="fashion-store__location">
              <strong>{partner.area}</strong>
              <span>{partner.address}</span>
              {partner.openingHours ? (
                <span className="fashion-store__hours">{partner.openingHours}</span>
              ) : null}
              {partner.phone ? <span>{partner.phone}</span> : null}
            </p>
          ) : null}
          <p className="fashion-store__note">{partner.shopNote}</p>
          {partner.whatsapp ? (
            <p className="fashion-store__link-wrap">
              <a className="fashion-store__link fashion-store__link--wa" href={`https://wa.me/${partner.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp ↗
              </a>
            </p>
          ) : null}
          {partner.websiteUrl ? (
            <p className="fashion-store__link-wrap">
              <a className="fashion-store__link" href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                {partner.websiteLabel ?? 'Visit website'} ↗
              </a>
            </p>
          ) : null}
          {partner.mapsUrl ? (
            <p className="fashion-store__link-wrap">
              <a className="fashion-store__link" href={partner.mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps ↗
              </a>
            </p>
          ) : null}
        </div>
      </article>

      {partner.mapsEmbed ? (
        <div className="fashion-store__map">
          <iframe
            src={partner.mapsEmbed}
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${partner.name} location`}
          />
        </div>
      ) : null}

      <article className="fashion-store__story">
        <img src={partner.lifestyleImg} alt="" />
        <div>
          <p className="fashion-store__label">{partner.lifestyleLabel}</p>
          <h3>{partner.lifestyleTitle}</h3>
          <p>{partner.lifestyleText}</p>
        </div>
      </article>

      <PartnerGallery photos={content[partner.id]?.gallery} name={partner.name} />

      <ClaimPage partnerId={partner.id} partnerName={partner.name} noun={noun} />
      <ReviewSection partnerId={partner.id} partnerName={partner.name} />
    </section>
  )
}
