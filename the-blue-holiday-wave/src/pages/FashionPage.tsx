import { Link } from 'react-router-dom'
import { fashionStores } from '../data/fashionStores'
import './FashionPage.css'

export function FashionPage() {
  return (
    <section className="page fashion-dir">
      <p className="page__kicker">Fashion & Lifestyle</p>
      <h2 className="page__title">Fashion stores</h2>
      <p className="page__lead">
        Browse partner boutiques for the holiday season. Tap a store for their
        full collection page — one advertiser, one lookbook.
      </p>

      <ul className="fashion-dir__list">
        {fashionStores.map((store) => (
          <li key={store.id}>
            <Link className="fashion-dir__row" to={`/fashion/${store.id}`}>
              <span
                className={`fashion-dir__shot${store.id === 'only-curacao' ? ' fashion-dir__shot--portrait' : ''}`}
              >
                <img src={store.highlightImg} alt="" />
                <span>{store.highlightCaption}</span>
              </span>
              <span className="fashion-dir__copy">
                <span className="fashion-dir__meta">
                  {store.partnerKicker ?? `${store.area} · Partner`}
                </span>
                <strong>{store.name}</strong>
                <span className="fashion-dir__intro">{store.listBlurb ?? store.intro}</span>
              </span>
              <span
                className={`fashion-dir__logo${(store.listLogoLarge ?? store.logoLarge) ? ' fashion-dir__logo--large' : ''}`}
              >
                <img
                  className={store.logoOnDark ? 'fashion-logo--on-dark' : undefined}
                  src={store.logoImg}
                  alt={`${store.name} logo`}
                />
                {store.logoCaption ? (
                  <span className="fashion-dir__logo-caption">{store.logoCaption}</span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="fashion-dir__foot">
        ZARA, Out of the Blue, and ONLY are verified partner listings. Other stores are
        samples for layout until partners confirm.
      </p>
    </section>
  )
}
