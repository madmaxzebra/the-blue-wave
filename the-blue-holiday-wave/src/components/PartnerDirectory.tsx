import { Link } from 'react-router-dom'
import type { PartnerProfile } from '../data/homesPartners'
import { LogoImg } from './LogoImg'
import { applyOverrides, useOwnerContent } from '../lib/ownerContent'
import '../pages/FashionPage.css'

type Props = {
  kicker: string
  title: string
  lead: string
  basePath: string
  partners: PartnerProfile[]
  foot: string
}

export function PartnerDirectory({
  kicker,
  title,
  lead,
  basePath,
  partners,
  foot,
}: Props) {
  const content = useOwnerContent()
  return (
    <section className="page fashion-dir">
      <p className="page__kicker">{kicker}</p>
      <h2 className="page__title">{title}</h2>
      <p className="page__lead">{lead}</p>

      <ul className="fashion-dir__list">
        {partners.map((basePartner) => {
          const partner = applyOverrides(basePartner, content[basePartner.id])
          return (
          <li key={partner.id}>
            <Link className="fashion-dir__row" to={`${basePath}/${partner.id}`}>
              <span className="fashion-dir__shot">
                <img src={partner.highlightImg} alt="" />
                <span>{partner.highlightCaption}</span>
              </span>
              <span className="fashion-dir__copy">
                <span className="fashion-dir__meta">
                  {partner.area} · Partner
                </span>
                <strong>{partner.name}</strong>
                <span className="fashion-dir__intro">{partner.intro}</span>
              </span>
              <span
                className={`fashion-dir__logo${partner.logoWide ? ' fashion-dir__logo--wide' : ''}`}
              >
                <LogoImg
                  src={partner.logoImg}
                  alt={`${partner.name} logo`}
                  label={partner.logoLabel}
                  color={partner.logoColor}
                />
              </span>
            </Link>
          </li>
          )
        })}
      </ul>

      <p className="fashion-dir__foot">{foot}</p>
    </section>
  )
}
