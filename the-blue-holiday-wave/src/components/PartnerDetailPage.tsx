import { Link, Navigate, useParams } from 'react-router-dom'
import type { PartnerProfile } from '../data/homesPartners'
import '../pages/FashionStorePage.css'

type Props = {
  listPath: string
  listLabel: string
  partnerKind: string
  getPartner: (id: string | undefined) => PartnerProfile | undefined
}

export function PartnerDetailPage({
  listPath,
  listLabel,
  partnerKind,
  getPartner,
}: Props) {
  const { partnerId } = useParams()
  const partner = getPartner(partnerId)

  if (!partner) {
    return <Navigate to={listPath} replace />
  }

  return (
    <section className="page fashion-store">
      <p className="fashion-store__back">
        <Link to={listPath}>← {listLabel}</Link>
      </p>

      <header className="fashion-store__head">
        <span className="fashion-store__logo fashion-store__logo--img">
          <img src={partner.logoImg} alt={partner.name} />
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
          <p className="fashion-store__note">{partner.shopNote}</p>
        </div>
      </article>

      <article className="fashion-store__story">
        <img src={partner.lifestyleImg} alt="" />
        <div>
          <p className="fashion-store__label">{partner.lifestyleLabel}</p>
          <h3>{partner.lifestyleTitle}</h3>
          <p>{partner.lifestyleText}</p>
        </div>
      </article>
    </section>
  )
}
